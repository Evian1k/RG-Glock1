from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app import db
from app.models.user import User
from app.models.education import Course, Enrollment, Quiz, Question, Answer, QuizAttempt

education_bp = Blueprint('education', __name__)

# Courses endpoints
@education_bp.route('/courses', methods=['GET'])
def get_courses():
    """Get all published courses"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 12, type=int)
        category = request.args.get('category')
        level = request.args.get('level')
        
        query = Course.query.filter_by(is_published=True)
        
        if category:
            query = query.filter(Course.category == category)
        
        if level:
            query = query.filter(Course.level == level)
        
        courses = query.order_by(Course.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'courses': [course.to_dict() for course in courses.items],
            'pagination': {
                'page': page,
                'pages': courses.pages,
                'per_page': per_page,
                'total': courses.total
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch courses'}), 500

@education_bp.route('/courses/<int:course_id>', methods=['GET'])
def get_course(course_id):
    """Get single course by ID"""
    try:
        course = Course.query.get(course_id)
        
        if not course or not course.is_published:
            return jsonify({'error': 'Course not found'}), 404
        
        return jsonify({'course': course.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch course'}), 500

@education_bp.route('/courses', methods=['POST'])
@jwt_required()
def create_course():
    """Create new course (instructors only)"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.json
        
        course = Course(
            title=data['title'],
            description=data.get('description'),
            short_description=data.get('short_description'),
            price=data.get('price', 0),
            category=data.get('category'),
            level=data.get('level'),
            duration_hours=data.get('duration_hours'),
            thumbnail=data.get('thumbnail'),
            video_url=data.get('video_url'),
            curriculum=data.get('curriculum', []),
            requirements=data.get('requirements', []),
            learning_outcomes=data.get('learning_outcomes', []),
            instructor_id=user_id
        )
        
        db.session.add(course)
        db.session.commit()
        
        return jsonify({
            'message': 'Course created successfully',
            'course': course.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create course'}), 500

@education_bp.route('/courses/<int:course_id>/enroll', methods=['POST'])
@jwt_required()
def enroll_in_course(course_id):
    """Enroll in a course"""
    try:
        user_id = get_jwt_identity()
        
        course = Course.query.get(course_id)
        if not course or not course.is_published:
            return jsonify({'error': 'Course not found'}), 404
        
        # Check if already enrolled
        existing = Enrollment.query.filter_by(
            student_id=user_id,
            course_id=course_id
        ).first()
        
        if existing:
            return jsonify({'error': 'Already enrolled in this course'}), 400
        
        enrollment = Enrollment(
            student_id=user_id,
            course_id=course_id,
            amount_paid=course.price
        )
        
        db.session.add(enrollment)
        db.session.commit()
        
        return jsonify({
            'message': 'Enrolled successfully',
            'enrollment': enrollment.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to enroll in course'}), 500

@education_bp.route('/my-courses', methods=['GET'])
@jwt_required()
def get_my_courses():
    """Get user's enrolled courses"""
    try:
        user_id = get_jwt_identity()
        
        enrollments = Enrollment.query.filter_by(student_id=user_id).all()
        
        return jsonify({
            'enrollments': [enrollment.to_dict() for enrollment in enrollments]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch enrolled courses'}), 500

# Quiz endpoints
@education_bp.route('/courses/<int:course_id>/quizzes', methods=['GET'])
@jwt_required()
def get_course_quizzes(course_id):
    """Get quizzes for a course"""
    try:
        user_id = get_jwt_identity()
        
        # Check if user is enrolled in the course
        enrollment = Enrollment.query.filter_by(
            student_id=user_id,
            course_id=course_id
        ).first()
        
        if not enrollment:
            return jsonify({'error': 'Not enrolled in this course'}), 403
        
        quizzes = Quiz.query.filter_by(
            course_id=course_id,
            is_published=True
        ).all()
        
        return jsonify({
            'quizzes': [quiz.to_dict() for quiz in quizzes]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch quizzes'}), 500

@education_bp.route('/quizzes/<int:quiz_id>', methods=['GET'])
@jwt_required()
def get_quiz(quiz_id):
    """Get quiz with questions"""
    try:
        user_id = get_jwt_identity()
        
        quiz = Quiz.query.get(quiz_id)
        if not quiz or not quiz.is_published:
            return jsonify({'error': 'Quiz not found'}), 404
        
        # Check if user is enrolled in the course
        enrollment = Enrollment.query.filter_by(
            student_id=user_id,
            course_id=quiz.course_id
        ).first()
        
        if not enrollment:
            return jsonify({'error': 'Not enrolled in this course'}), 403
        
        # Include questions in response
        quiz._include_questions = True
        quiz_data = quiz.to_dict()
        
        # Remove correct answers from questions
        for question in quiz_data['questions']:
            for answer in question['answers']:
                answer.pop('is_correct', None)
        
        return jsonify({'quiz': quiz_data}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch quiz'}), 500

@education_bp.route('/quizzes/<int:quiz_id>/attempt', methods=['POST'])
@jwt_required()
def submit_quiz_attempt(quiz_id):
    """Submit quiz attempt"""
    try:
        user_id = get_jwt_identity()
        data = request.json
        
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return jsonify({'error': 'Quiz not found'}), 404
        
        # Check enrollment
        enrollment = Enrollment.query.filter_by(
            student_id=user_id,
            course_id=quiz.course_id
        ).first()
        
        if not enrollment:
            return jsonify({'error': 'Not enrolled in this course'}), 403
        
        # Check attempt limit
        previous_attempts = QuizAttempt.query.filter_by(
            user_id=user_id,
            quiz_id=quiz_id
        ).count()
        
        if previous_attempts >= quiz.max_attempts:
            return jsonify({'error': 'Maximum attempts reached'}), 400
        
        # Create quiz attempt
        attempt = QuizAttempt(
            user_id=user_id,
            quiz_id=quiz_id,
            answers=data.get('answers', {})
        )
        
        # Calculate score
        score, max_score, percentage = attempt.calculate_score()
        attempt.score = score
        attempt.max_score = max_score
        attempt.percentage = percentage
        attempt.passed = percentage >= quiz.passing_score
        attempt.completed_at = datetime.utcnow()
        
        db.session.add(attempt)
        db.session.commit()
        
        return jsonify({
            'message': 'Quiz submitted successfully',
            'attempt': attempt.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to submit quiz'}), 500
from datetime import datetime
from decimal import Decimal
from app import db

class Course(db.Model):
    __tablename__ = 'courses'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    short_description = db.Column(db.String(500))
    price = db.Column(db.Numeric(10, 2), default=0.00)
    category = db.Column(db.String(100))
    level = db.Column(db.String(50))  # beginner, intermediate, advanced
    duration_hours = db.Column(db.Integer)
    
    # Media
    thumbnail = db.Column(db.String(255))
    video_url = db.Column(db.String(255))
    video_duration = db.Column(db.Integer)  # in seconds
    
    # Course content
    curriculum = db.Column(db.JSON)  # Store course modules/lessons
    requirements = db.Column(db.JSON)  # Prerequisites
    learning_outcomes = db.Column(db.JSON)  # What students will learn
    
    # Course status
    is_published = db.Column(db.Boolean, default=False)
    is_featured = db.Column(db.Boolean, default=False)
    
    # Instructor
    instructor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = db.Column(db.DateTime)
    
    # Relationships
    enrollments = db.relationship('Enrollment', backref='course', lazy='dynamic')
    quizzes = db.relationship('Quiz', backref='course', lazy='dynamic')
    
    def get_enrollment_count(self):
        return self.enrollments.count()
    
    def get_average_rating(self):
        # TODO: Implement rating system
        return 0.0
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'short_description': self.short_description,
            'price': float(self.price),
            'category': self.category,
            'level': self.level,
            'duration_hours': self.duration_hours,
            'thumbnail': self.thumbnail,
            'video_url': self.video_url,
            'video_duration': self.video_duration,
            'curriculum': self.curriculum or [],
            'requirements': self.requirements or [],
            'learning_outcomes': self.learning_outcomes or [],
            'is_published': self.is_published,
            'is_featured': self.is_featured,
            'instructor_id': self.instructor_id,
            'instructor': self.instructor.get_full_name() if self.instructor else None,
            'enrollment_count': self.get_enrollment_count(),
            'average_rating': self.get_average_rating(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'published_at': self.published_at.isoformat() if self.published_at else None
        }

class Enrollment(db.Model):
    __tablename__ = 'enrollments'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    
    # Enrollment details
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)
    progress = db.Column(db.Float, default=0.0)  # Percentage completed
    completed_at = db.Column(db.DateTime)
    certificate_issued = db.Column(db.Boolean, default=False)
    
    # Payment info
    amount_paid = db.Column(db.Numeric(10, 2))
    payment_method = db.Column(db.String(50))
    
    # Ensure unique student-course combination
    __table_args__ = (db.UniqueConstraint('student_id', 'course_id', name='unique_student_course'),)
    
    def is_completed(self):
        return self.progress >= 100.0
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'course_id': self.course_id,
            'course': self.course.to_dict() if self.course else None,
            'enrolled_at': self.enrolled_at.isoformat() if self.enrolled_at else None,
            'progress': self.progress,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'certificate_issued': self.certificate_issued,
            'amount_paid': float(self.amount_paid) if self.amount_paid else None,
            'is_completed': self.is_completed()
        }

class Quiz(db.Model):
    __tablename__ = 'quizzes'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    
    # Quiz settings
    time_limit = db.Column(db.Integer)  # in minutes
    max_attempts = db.Column(db.Integer, default=3)
    passing_score = db.Column(db.Float, default=70.0)
    is_published = db.Column(db.Boolean, default=False)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    questions = db.relationship('Question', backref='quiz', lazy='dynamic', cascade='all, delete-orphan')
    attempts = db.relationship('QuizAttempt', backref='quiz', lazy='dynamic')
    
    def get_question_count(self):
        return self.questions.count()
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'course_id': self.course_id,
            'time_limit': self.time_limit,
            'max_attempts': self.max_attempts,
            'passing_score': self.passing_score,
            'is_published': self.is_published,
            'question_count': self.get_question_count(),
            'questions': [q.to_dict() for q in self.questions] if hasattr(self, '_include_questions') else [],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Question(db.Model):
    __tablename__ = 'questions'
    
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    question_type = db.Column(db.String(50), default='multiple_choice')  # multiple_choice, true_false, text
    points = db.Column(db.Integer, default=1)
    order = db.Column(db.Integer, default=0)
    
    # Question media
    image_url = db.Column(db.String(255))
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    answers = db.relationship('Answer', backref='question', lazy='dynamic', cascade='all, delete-orphan')
    
    def get_correct_answer(self):
        return self.answers.filter_by(is_correct=True).first()
    
    def to_dict(self):
        return {
            'id': self.id,
            'quiz_id': self.quiz_id,
            'question_text': self.question_text,
            'question_type': self.question_type,
            'points': self.points,
            'order': self.order,
            'image_url': self.image_url,
            'answers': [a.to_dict() for a in self.answers],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Answer(db.Model):
    __tablename__ = 'answers'
    
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    answer_text = db.Column(db.Text, nullable=False)
    is_correct = db.Column(db.Boolean, default=False)
    order = db.Column(db.Integer, default=0)
    
    def to_dict(self, include_correct=False):
        data = {
            'id': self.id,
            'question_id': self.question_id,
            'answer_text': self.answer_text,
            'order': self.order
        }
        if include_correct:
            data['is_correct'] = self.is_correct
        return data

class QuizAttempt(db.Model):
    __tablename__ = 'quiz_attempts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)
    
    # Attempt details
    score = db.Column(db.Float)
    max_score = db.Column(db.Float)
    percentage = db.Column(db.Float)
    passed = db.Column(db.Boolean, default=False)
    
    # Timing
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    time_taken = db.Column(db.Integer)  # in seconds
    
    # Answers given (stored as JSON)
    answers = db.Column(db.JSON)
    
    def calculate_score(self):
        """Calculate score based on answers"""
        if not self.answers:
            return 0, 0, 0.0
        
        total_score = 0
        max_possible = 0
        
        for question_id, answer_data in self.answers.items():
            question = Question.query.get(int(question_id))
            if question:
                max_possible += question.points
                correct_answer = question.get_correct_answer()
                if correct_answer and answer_data.get('answer_id') == correct_answer.id:
                    total_score += question.points
        
        percentage = (total_score / max_possible * 100) if max_possible > 0 else 0
        return total_score, max_possible, percentage
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'quiz_id': self.quiz_id,
            'quiz': self.quiz.title if self.quiz else None,
            'score': self.score,
            'max_score': self.max_score,
            'percentage': self.percentage,
            'passed': self.passed,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'time_taken': self.time_taken
        }
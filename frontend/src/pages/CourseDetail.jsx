import React from 'react';
import { useParams } from 'react-router-dom';

const CourseDetail = () => {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Course Detail</h1>
        <p>Course ID: {id}</p>
        <p>Course information and enrollment options will be shown here.</p>
      </div>
    </div>
  );
};

export default CourseDetail;
import React from 'react';

const ProgressSection = () => (
  <div className="p-6 bg-white rounded-lg shadow-sm mb-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">Learning Progress</h2>
      <button className="text-sm text-blue-600">View All Courses</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {["Physics", "Chemistry", "Biology", "Mathematics"].map((subject, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-500">{subject}</label>
            <span className="text-sm font-medium">{Math.floor(Math.random() * 20) + 70}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 rounded-full bg-blue-600" style={{ width: `${Math.random() * 100}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ProgressSection;

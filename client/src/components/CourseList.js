import React, { useState } from 'react';
import coursesData from '../data/coursesData';
import './CourseList.css';

function CourseList() {
 const [selectedCategory, setSelectedCategory] = useState(coursesData[0]?.category || null);
  const [selectedType, setSelectedType] = useState('All');

  const selectedSection = coursesData.find(
    (section) => section.category === selectedCategory
  );

  const filteredCourses = selectedSection
    ? selectedSection.courses.filter(
        (course) => selectedType === 'All' || course.type === selectedType
      )
    : [];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedType('All');
  };

  return (
    <div className="courses-page">
      <h2 className="courses-title">What do you want to learn?</h2>

      <div className="subject-menu">
        {coursesData.map((section) => (
          <button
            key={section.category}
            className={
              selectedCategory === section.category
                ? 'subject-pill active'
                : 'subject-pill'
            }
            onClick={() => handleCategoryClick(section.category)}
          >
            {section.category}
          </button>
        ))}
      </div>

      {!selectedSection && (
        <p className="status-text">Pick a subject above to see recommended courses.</p>
      )}

      {selectedSection && (
        <div className="course-category">
          <div className="category-header-row">
            <h3>{selectedSection.category}</h3>
            <div className="type-filter">
              {['All', 'Free', 'Paid'].map((type) => (
                <button
                  key={type}
                  className={selectedType === type ? 'type-filter-pill active' : 'type-filter-pill'}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {filteredCourses.length === 0 && (
            <p className="status-text">No {selectedType.toLowerCase()} courses in this subject.</p>
          )}

          <div className="course-grid">
            {filteredCourses.map((course) => (
              <div className="course-card" key={course.title}>
                <div className="course-card-header">
                  <h4>{course.title}</h4>
                  <span
                    className={
                      course.type === 'Free'
                        ? 'type-badge free-badge'
                        : 'type-badge paid-badge'
                    }
                  >
                    {course.type}
                  </span>
                </div>
                <p className="platform-text">{course.platform}</p>
                <a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Go to Course
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseList;
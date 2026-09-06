import React, { useState, useEffect } from 'react';


import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Building2, Map, BookOpen, FileText } from 'lucide-react';
import CompanyList from './components/CompanyList';
import CompanyForm from './components/CompanyForm';
import CourseList from './components/CourseList';
import ResumeUpload from './components/ResumeUpload';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import './App.css';

import { getCompanies } from './api/companyApi';
import { getProgress } from './api/roadmapApi';
import { getResumeStatus } from './api/resumeApi';
import roadmapData from './data/roadmapData';
import Roadmap from './components/Roadmap';

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function PrivateRoute({ children }) {
  return isLoggedIn() ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    companyCount: 0,
    roadmapPercent: 0,
    resumeUploaded: false,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [companiesRes, progressRes, resumeRes] = await Promise.all([
          getCompanies(),
          getProgress(),
          getResumeStatus(),
        ]);

        const totalTasks = roadmapData.reduce((sum, week) => sum + week.tasks.length, 0);
        const completedCount = progressRes.data.completedTasks.length;
        const roadmapPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

        setStats({
          companyCount: companiesRes.data.length,
          roadmapPercent,
          resumeUploaded: resumeRes.data.uploaded,
        });
      } catch (err) {
        // fail silently, stats just show defaults
      }
    }
    loadStats();
  }, []);

  const cards = [
    {
      title: 'Company Tracker',
      desc: 'Track deadlines, eligibility, and application status in real time.',
      icon: <Building2 size={28} />,
      path: '/companies',
    },
    {
      title: 'Placement Roadmap',
      desc: 'Week-wise checklist from DSA to HR rounds. Never miss a step.',
      icon: <Map size={28} />,
      path: '/roadmap',
    },
    {
      title: 'Course Recommendations',
      desc: 'Curated courses with platform and price tags for every subject.',
      icon: <BookOpen size={28} />,
      path: '/courses',
    },
    {
      title: 'Resume',
      desc: 'Upload your resume and match it against company requirements.',
      icon: <FileText size={28} />,
      path: '/resume',
    },
  ];

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Ace Your Placement Season</h2>
      <p className="dashboard-subtitle">
        Track company deadlines, follow a placement roadmap, discover top courses, and build a winning resume — all in one place.
      </p>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">{stats.companyCount}</span>
          <span className="stat-label">Companies Tracked</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.roadmapPercent}%</span>
          <span className="stat-label">Roadmap Complete</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.resumeUploaded ? '✓' : '—'}</span>
          <span className="stat-label">Resume Uploaded</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {cards.map((card) => (
          <div
            className="dashboard-card"
            key={card.title}
            onClick={() => navigate(card.path)}
          >
            <div className="dashboard-card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Companies() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCompanyAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <CompanyForm onCompanyAdded={handleCompanyAdded} />
      <CompanyList key={refreshKey} />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/companies"
          element={
            <PrivateRoute>
              <Companies />
            </PrivateRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <PrivateRoute>
              <CourseList />
            </PrivateRoute>
          }
        />
        <Route
          path="/resume"
          element={
            <PrivateRoute>
              <ResumeUpload />
            </PrivateRoute>
          }
        />
        <Route
  path="/roadmap"
  element={
    <PrivateRoute>
      <Roadmap />
    </PrivateRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;
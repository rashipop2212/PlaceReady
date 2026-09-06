import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, BookOpen, FileText, Map, LogOut, Building2 } from 'lucide-react';
import './Layout.css';

function Layout({ children }) {
  const userName = localStorage.getItem('userName');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-brand">
          <HomeIcon size={22} />
          <h1>PlaceReady</h1>
        </div>

     <nav className="nav-links">
  <Link to="/"><HomeIcon size={16} /> Home</Link>
  <Link to="/companies"><Building2 size={16} /> Companies</Link>
  <Link to="/courses"><BookOpen size={16} /> Courses</Link>
  <Link to="/roadmap"><Map size={16} /> Roadmap</Link>
  <Link to="/resume"><FileText size={16} /> Resume</Link>
</nav>

        <div className="header-user-block">
  <button className="btn btn-danger logout-btn" onClick={handleLogout}>
    <LogOut size={14} /> Logout
  </button>
  <p>Welcome, {userName || 'Student'}</p>
</div>
      </header>

           <main>{children}</main>

      <footer className="app-footer">
        <p>© 2026 PlaceReady — Built by Rashi Singh</p>
      </footer>
    </div>
  );
}

export default Layout;
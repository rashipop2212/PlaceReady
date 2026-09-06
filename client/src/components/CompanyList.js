import React, { useEffect, useState } from 'react';
import { getCompanies, deleteCompany, updateCompany } from '../api/companyApi';
import { getAllMatches } from '../api/resumeApi';
import CountdownTimer from './CountdownTimer';
import './CompanyList.css';

const STATUS_OPTIONS = ['Not Applied', 'Applied', 'Test', 'Interview', 'Selected', 'Rejected'];

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [matches, setMatches] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await getCompanies();
      setCompanies(res.data);
      setError('');
    } catch (err) {
      setError('Could not load companies. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await getAllMatches();
      const map = {};
      res.data.results.forEach((m) => {
        map[m.companyId] = m.matchPercentage;
      });
      setMatches(map);
    } catch (err) {
      setMatches({});
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchMatches();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this company?')) return;
    await deleteCompany(id);
    fetchCompanies();
  };

  const handleStatusChange = async (id, newStatus) => {
    setCompanies((prev) =>
      prev.map((c) => (c._id === id ? { ...c, applicationStatus: newStatus } : c))
    );
    try {
      await updateCompany(id, { applicationStatus: newStatus });
    } catch (err) {
      fetchCompanies();
    }
  };

  if (loading) return <p className="status-text">Loading companies...</p>;
  if (error) return <p className="status-text error">{error}</p>;
  if (companies.length === 0) return <p className="status-text">No companies added yet.</p>;

  return (
    <div className="company-grid">
      {companies.map((company) => (
        <div className="company-card" key={company._id}>
          <div className="company-card-header">
            <h3>{company.name}</h3>
            {company.package && <span className="package-badge">{company.package}</span>}
          </div>

          {company.role && <p className="role-text">{company.role}</p>}

          <p className="eligibility-text">
            <strong>Eligibility:</strong> {company.eligibility}
          </p>

          <p className="jd-text">{company.jobDescription}</p>

          {matches[company._id] !== undefined && (
            <div className="match-badge-row">
              <div className="match-badge-bar-wrapper">
                <div
                  className="match-badge-bar"
                  style={{ width: `${matches[company._id]}%` }}
                />
              </div>
              <span className="match-badge-text">{matches[company._id]}% match</span>
            </div>
          )}

          <select
            className="status-select"
            value={company.applicationStatus || 'Not Applied'}
            onChange={(e) => handleStatusChange(company._id, e.target.value)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <div className="company-card-footer">
            <CountdownTimer deadline={company.deadline} />
            <div className="card-actions">
              {company.registrationLink ? (
                <a
                  href={company.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Register
                </a>
              ) : null}
              <button className="btn btn-danger" onClick={() => handleDelete(company._id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CompanyList;
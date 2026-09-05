import React, { useEffect, useState } from 'react';
import { getCompanies, deleteCompany } from '../api/companyApi';
import CountdownTimer from './CountdownTimer';
import './CompanyList.css';

function CompanyList() {
  const [companies, setCompanies] = useState([]);
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

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this company?')) return;
    await deleteCompany(id);
    fetchCompanies();
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

          <div className="company-card-footer">
            <CountdownTimer deadline={company.deadline} />
            <div className="card-actions">
              {company.registrationLink ? (
                
                 <a href={company.registrationLink}
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
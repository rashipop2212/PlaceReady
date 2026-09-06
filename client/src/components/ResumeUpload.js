import React, { useState, useEffect } from 'react';
import { uploadResume, getResumeStatus, getAllMatches } from '../api/resumeApi';
import './ResumeUpload.css';

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchStatus = async () => {
    try {
      const res = await getResumeStatus();
      setStatus(res.data);
      if (res.data.uploaded) {
        fetchMatches();
      }
    } catch (err) {
      setStatus(null);
    }
  };

  const fetchMatches = async () => {
    try {
      setLoadingMatches(true);
      const res = await getAllMatches();
      setMatches(res.data.results);
    } catch (err) {
      setMatches([]);
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const res = await uploadResume(file);
      setMessage(`Resume "${res.data.fileName}" uploaded successfully!`);
      await fetchStatus();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="resume-page">
      <div className="resume-upload-card">
        <h3>Your Resume</h3>

        {status?.uploaded ? (
          <p className="resume-status">
            Current resume: <strong>{status.fileName}</strong>
          </p>
        ) : (
          <p className="resume-status">No resume uploaded yet.</p>
        )}

        {message && <p className="resume-success">{message}</p>}
        {error && <p className="form-error">{error}</p>}

        <input type="file" accept="application/pdf" onChange={handleFileChange} />

        <button className="btn btn-primary" onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : status?.uploaded ? 'Replace Resume' : 'Upload Resume'}
        </button>
      </div>

      {status?.uploaded && (
        <div className="match-results-card">
          <h3>Company Match Results</h3>

          {loadingMatches && <p className="status-text">Calculating matches...</p>}

          {!loadingMatches && matches.length === 0 && (
            <p className="status-text">No companies added yet to compare against.</p>
          )}

          {!loadingMatches && matches.length > 0 && (
            <div className="match-list">
              {matches.map((m) => (
                <div className="match-row" key={m.companyId}>
                  <div className="match-info">
                    <strong>{m.companyName}</strong>
                    {m.role && <span className="match-role"> — {m.role}</span>}
                  </div>
                  <div className="match-bar-wrapper">
                    <div className="match-bar" style={{ width: `${m.matchPercentage}%` }} />
                  </div>
                  <span className="match-percent">{m.matchPercentage}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;
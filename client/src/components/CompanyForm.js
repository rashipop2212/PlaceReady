import React, { useState } from 'react';
import { createCompany } from '../api/companyApi';
import './CompanyForm.css';

function CompanyForm({ onCompanyAdded }) {
  const [form, setForm] = useState({
    name: '',
    role: '',
    package: '',
    eligibility: '',
    jobDescription: '',
    registrationLink: '',
    deadline: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.eligibility || !form.jobDescription || !form.deadline) {
      setError('Please fill in name, eligibility, job description, and deadline.');
      return;
    }

    try {
      setSubmitting(true);
      await createCompany(form);
      setForm({
        name: '',
        role: '',
        package: '',
        eligibility: '',
        jobDescription: '',
        registrationLink: '',
        deadline: '',
      });
      if (onCompanyAdded) onCompanyAdded();
    } catch (err) {
      setError('Failed to add company. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="company-form" onSubmit={handleSubmit}>
      <h3>Add a Company</h3>
      {error && <p className="form-error">{error}</p>}

      <input
        type="text"
        name="name"
        placeholder="Company name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        type="text"
        name="role"
        placeholder="Role (e.g. SDE Intern)"
        value={form.role}
        onChange={handleChange}
      />
      <input
        type="text"
        name="package"
        placeholder="Package (e.g. 6 LPA)"
        value={form.package}
        onChange={handleChange}
      />
      <textarea
        name="eligibility"
        placeholder="Eligibility criteria"
        value={form.eligibility}
        onChange={handleChange}
        rows={2}
      />
      <textarea
        name="jobDescription"
        placeholder="Job description"
        value={form.jobDescription}
        onChange={handleChange}
        rows={4}
      />
      <input
        type="url"
        name="registrationLink"
        placeholder="Registration link"
        value={form.registrationLink}
        onChange={handleChange}
      />
      <label className="deadline-label">
        Registration deadline
        <input
          type="datetime-local"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
        />
      </label>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Adding...' : 'Add Company'}
      </button>
    </form>
  );
}

export default CompanyForm;
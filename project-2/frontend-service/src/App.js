import React, { useState, useEffect } from 'react';

function App() {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState('');

  // Fetch jobs from API
  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => setJobs(data));
  }, []);

  // Create new job
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newJob })
    })
    .then(() => {
      setNewJob('');
      // Refresh job list
      fetch('/api/jobs')
        .then(res => res.json())
        .then(data => setJobs(data));
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Job Queue</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          value={newJob}
          onChange={(e) => setNewJob(e.target.value)}
          placeholder="New job title"
          required
        />
        <button type="submit">Add Job</button>
      </form>

      <h2>Jobs</h2>
      <ul>
        {jobs.map(job => (
          <li key={job.id}>
            {job.title} - {job.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
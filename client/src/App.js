import React, { useState } from 'react';
import CompanyList from './components/CompanyList';
import CompanyForm from './components/CompanyForm';
import './App.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCompanyAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>PlaceReady</h1>
        <p>Your placement prep, all in one place</p>
      </header>

      <main>
        <CompanyForm onCompanyAdded={handleCompanyAdded} />
        <CompanyList key={refreshKey} />
      </main>
    </div>
  );
}

export default App;
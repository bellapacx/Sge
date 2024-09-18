import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainLayout from './components/MainLayout'; // Adjust the path as necessary

const App: React.FC = () => {
  return (
    <Router basename='Sge'>
      <MainLayout />
    </Router>
  );
};

export default App;

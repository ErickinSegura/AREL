// src/App.jsx
import React from 'react';
import AppLayout from './layouts/AppLayout';
import { RouteProvider } from './contexts/RouteContext';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <RouteProvider>
        <AppLayout defaultOpen={false} accentColor="#C74634" />
      </RouteProvider>
    </AuthProvider>
  );
};

export default App;
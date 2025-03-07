import React from 'react';
import AppLayout from './layouts/AppLayout';
import { RouteProvider } from './contexts/RouteContext';

export const App = () => {
  return (
    <RouteProvider>
      <AppLayout defaultOpen={false} accentColor="#C74634" />
    </RouteProvider>
  );
};
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const Dashboard = lazy(() => import('./components/Dashboard'));

const Routes = () => {
  const isLoggedIn = sessionStorage.getItem('token') !== null;
  const username = isLoggedIn ? sessionStorage.getItem('username') : null;

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} username={username} />
      <Suspense fallback={<div className="content">Loading...</div>}>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/dashboard" component={Dashboard} />
      </Suspense>
    </Router>
  );
};

export default Routes;
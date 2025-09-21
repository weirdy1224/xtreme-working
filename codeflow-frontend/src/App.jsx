import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './page/HomePage.jsx';
import LoginPage from './page/LoginPage.jsx';
import SignUpPage from './page/SignUpPage.jsx';
import VerifyEmailPage from './page/VerifyEmailPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import Layout from './layout/Layout.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AddProblem from './page/AddProblem.jsx';
import Dashboard from './components/Dashboard.jsx';
import ProblemPage from './page/ProblemPage.jsx';
import ProfilePage from './page/ProfilePage.jsx';
import LeaderboardPage from './page/LeaderboardPage.jsx';

const App = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="flex flex-col items-center justify-start">
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={!authUser ? <HomePage /> : <Dashboard />} />

          <Route element={<AdminRoute />}>
            <Route
              path="/add-problem"
              element={authUser ? <AddProblem /> : <Navigate to="/" />}
            />
          </Route>

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route
            path="/problem/:id"
            element={authUser ? <ProblemPage /> : <Navigate to="/" />}
          />
        </Route>

        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" replace />}
        />

        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" replace />}
        />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Auth from './Auth';
import LandingPage from './LandingPage';
import AppLayout from './AppLayout';

const AuthWrapper = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showLandingPage, setShowLandingPage] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setShowLandingPage(true);
        setLoading(false);
      } else {
        setUser(null);
        setShowLandingPage(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Auth onLogin={() => setShowLandingPage(true)} />;
  }

  if (showLandingPage) {
    return (
      <LandingPage
        onSetupComplete={() => setShowLandingPage(false)}
      />
    );
  }

  return (
    <div className="App">
      <AppLayout onSwitchToLandingPage={() => setShowLandingPage(true)} />
    </div>
  );
};

export default AuthWrapper;

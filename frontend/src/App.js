import React, { useState, useEffect } from 'react';
import AppLayout from './components/AppLayout';
import './App.css';
import AuthWrapper from './components/AuthWrapper';
import LandingPage from './components/LandingPage';
import { getAuth } from 'firebase/auth';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from './components/firebaseConfig';

function App() {
  const auth = getAuth();

  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [selectedClass, setSelectedClass] = useState({});
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSetupComplete = async (selectedClassData) => {
    setSelectedClass(selectedClassData);
    setIsSetupComplete(true);
  };

  const switchToLandingPage = () => {
    console.log("hit");
    setIsSetupComplete(false);
  };

  return (
    <AuthWrapper>
      <div className="App">
        {userId &&
          (!isSetupComplete ? (
            <LandingPage onSetupComplete={handleSetupComplete} />
          ) : selectedClass ? (
            <AppLayout
              initialSelectedClass={selectedClass}
              onSwitchToLandingPage={switchToLandingPage}
            />
          ) : null)}
      </div>
    </AuthWrapper>
  );
}

export default App;

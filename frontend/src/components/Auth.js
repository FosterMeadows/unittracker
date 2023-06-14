import React, { useState, useEffect } from 'react';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { createInitialDataStructure } from './firebase-utils';
import { checkAndCreateInitialDataStructure } from './firebase-utils';


// Your Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyC2WFV-UZdmL31DyvfFwwmSHNgyoqxNqQ4',
    authDomain: 'modernclassroom-d87d4.firebaseapp.com',
    projectId: 'modernclassroom-d87d4',
    storageBucket: 'modernclassroom-d87d4.appspot.com',
    messagingSenderId: '743466427386',
    appId: '1:743466427386:web:81e6d6094c33650d1cfa43',
    measurementId: 'G-RR50Z4HS35',
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Auth = ({ onLogin }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await checkAndCreateInitialDataStructure(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
  
      // Call the function to create the initial data structure for the new user only if they're new
      if (result.additionalUserInfo && result.additionalUserInfo.isNewUser) {
        await createInitialDataStructure(result.user);
      }
  
      onLogin(); // Invoke the onLogin callback after a successful sign-in
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };
  
  

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}!</p>
          <button onClick={signOutUser}>Sign out</button>
        </div>
      ) : (
        <button onClick={signIn}>Sign in with Google</button>
      )}
    </div>
  );
};

export default Auth;
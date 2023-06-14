import React, { useState, useEffect } from 'react';
import { doc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { getAuth } from 'firebase/auth';
import Header from './Header';
import '../styles/LandingPage.css';
import { MdMoreHoriz } from 'react-icons/md';
import { MdMoreVert } from 'react-icons/md';

const LandingPage = ({ onSetupComplete }) => {
  const [classNames, setClassNames] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const displayName = auth.currentUser.displayName;
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const fetchClassNames = async () => {
      const classRef = collection(db, "users", userId, "classes");
      const snapshot = await getDocs(classRef);

      if (!snapshot.empty) {
        const fetchedClassNames = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClassNames(fetchedClassNames);
      }
    };

    fetchClassNames();
  }, [userId]);

  useEffect(() => {
    const closeMenu = () => {
      setOpenMenu(null);
    };

    document.addEventListener('click', closeMenu);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', closeMenu);
    };
  }, []);

  const handleDeleteClass = async (classId) => {
    // Delete the class from Firestore
    const classDocRef = doc(db, 'users', userId, 'classes', classId);
    await deleteDoc(classDocRef);

    // Update the local state
    setClassNames(classNames.filter((classItem) => classItem.id !== classId));
  };

  const handleSetupComplete = async () => {
    if (classNames.length > 0) {
      let selectedClassData = classNames[0];
      onSetupComplete(selectedClassData);
    } else {
      // Show an error message or prompt the user to create a class before proceeding
      alert('Please create a class before proceeding.');
    }
  };
  

  const handleAddClass = async () => {
    if (newClassName.trim() !== '') {
      // Add the new class to Firestore
      const classRef = collection(db, 'users', userId, 'classes');
      const newClassDocRef = doc(classRef);
      await setDoc(newClassDocRef, { name: newClassName });

      // Add the new class to the local state
      setClassNames([...classNames, { id: newClassDocRef.id, name: newClassName }]);

      // Clear the new class name input field
      setNewClassName('');
    }
  };
      
    return (
      <div className="landingPage">
        <Header />

        <div className="contentWrapper">

        <div className="card">
          <h1>Welcome, {displayName}!</h1>
        </div>

        <div className="card">
          <h2>Here are your currently regifgdfhgfhghdfgdhfstered classes:</h2>

          <div className="classesContainer">
            {classNames.map((classItem) => (
              <div className="classCard" key={classItem.id}>
           
              <button 
                className="menuButton classCardHeader" 
                onClick={(e) => {
                  e.stopPropagation(); // prevent the click from being registered by the div
                  setOpenMenu(openMenu === classItem.id ? null : classItem.id);
                }}
              >
                <MdMoreVert />
              </button>
              <h3>{classItem.name}</h3>
              {openMenu === classItem.id && (
                <div className="menu">
                  <button onClick={() => handleDeleteClass(classItem.id)}>Delete</button>
                </div>
              )}
          </div>
            ))}
          </div>

          <div>
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Need to add a class? Type here."
            />
            <button onClick={handleAddClass}>Add Class</button>
          </div>

          <button onClick={handleSetupComplete}>Proceed to App</button>
        </div> </div>
      </div>
    );
  };

export default LandingPage;

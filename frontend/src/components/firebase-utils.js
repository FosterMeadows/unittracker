import { collection, getDoc, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Assuming 'db' is your Firestore instance

export async function createInitialDataStructure(user) {
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    });
  
    const classRef = collection(userDocRef, 'classes');
    const classData = {
      name: 'Class 1',
      // Add other class-related data here
    };
    await addDoc(classRef, classData);
  }
  

export async function checkAndCreateInitialDataStructure(user) {
    const userDocRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      await createInitialDataStructure(user);
    }
  }


import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC2WFV-UZdmL31DyvfFwwmSHNgyoqxNqQ4',
  authDomain: 'modernclassroom-d87d4.firebaseapp.com',
  projectId: 'modernclassroom-d87d4',
  storageBucket: 'modernclassroom-d87d4.appspot.com',
  messagingSenderId: '743466427386',
  appId: '1:743466427386:web:81e6d6094c33650d1cfa43',
  measurementId: 'G-RR50Z4HS35',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

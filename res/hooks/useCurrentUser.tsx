import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from "firebase/auth";
import { firebase_app_auth } from '../components/FirebaseConfig';

const useCurrentUser = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Use the custom firebase_app_auth instance with configured persistence
    const unsubscribe = onAuthStateChanged(firebase_app_auth, (user) => {
      if (user) {
        // User is signed in
        console.log(`logged in user is ${user.email}`)
        setCurrentUser(user);
      } else {
        // No user is signed in
        setCurrentUser(null);
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  return currentUser;
};

export default useCurrentUser;

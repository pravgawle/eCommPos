import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase_db, firebase_app_auth } from "./FirebaseConfig";
import { onAuthStateChanged } from 'firebase/auth';
import { UserProfile } from "../modals/Types";
import { collection, getDocs } from "firebase/firestore";
import firestore from '@react-native-firebase/firestore';

type UserData = string | null;

type AuthContextType = {
    login: (data: string) => void;
    logout: () => void;
    DataUser: (data: UserData) => void;
    setUserProfile: (profile: UserProfile) => void;
    userData: UserData;
    userToken: UserData;
    userProfile: UserProfile;
    isLoggedIn: () => void;
};

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthContext = createContext<AuthContextType>({
    login: () => { },
    logout: () => { },
    DataUser: () => { },
    setUserProfile: () => { },
    userData: null,
    userToken: null,
    userProfile: null,
    isLoggedIn: () => { },
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [userToken, setUserToken] = useState<UserData>(null);
    const [profilePic, setProfilePic] = useState<UserData>(null);
    const [userData, setUserData] = useState<UserData>(null);
    const [userProfile, setUserProfile] = useState<UserProfile>(null);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        isLoggedIn();

        const initializeAuth = async () => {
            onAuthStateChanged(firebase_app_auth, async (user) => {
                if (user) {
                    // User is signed in
                    const token = await user.getIdToken();

                    setUserToken(token);
                    await AsyncStorage.removeItem('userToken')
                    await AsyncStorage.setItem('userToken', token);

                    DataUser(JSON.stringify(user.providerData));
                    fetchUserProfile(user.uid);

                } else {
                    // No user is signed in
                    logout();
                }
                setIsLoading(false);
            });
        };
        initializeAuth();

    }, []);

    const fetchUserProfile = (userId: string) => {
        const userRef = firestore().collection('users').doc(userId);
    
        userRef.onSnapshot(docSnapshot => {
          if (docSnapshot.exists) {
            setUserProfile({
              firstName: docSnapshot.data()?.firstName,
              lastName: docSnapshot.data()?.lastName,
              email: docSnapshot.data()?.email,
              profileUrl: docSnapshot.data()?.profileUrl,
            });
          } else {
            console.log('No user profile found');
          }
        }, err => {
          console.error("Error fetching user profile:", err);
        });
      };
      
    const isLoggedIn = async () => {
        try {
            const storedUserToken = await AsyncStorage.getItem('userToken');

            const storedUserData = await AsyncStorage.getItem('userData');
            if (storedUserData) {
                const userData: UserData = JSON.parse(storedUserData); // Parse the string back to UserData object
                console.log('User data retrieved successfully:', userData);
                setIsLoading(false);
            } else {
                console.log('No user data found');
                setIsLoading(false);
            }
            setUserToken(storedUserToken);
            setUserData(storedUserData);
            setIsLoading(false);
        } catch (error) {
            console.log(`isLoggedIn error: ${error}`);
            setIsLoading(false);
        }
    }

    const logout = async () => {
        setUserToken(null);
        setUserData(null);
        setUserProfile(null);
        firebase_app_auth.signOut();

        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.log(`Logout error: ${error}`);
        }
    }

    const DataUser = async (data: UserData) => {
        setUserData(data);
        let userDataString = JSON.stringify(data);
        await AsyncStorage.removeItem('userData')
        await AsyncStorage.setItem('userData', userDataString);
        console.log("User data saved successfully!");
    }

    const login = async (data: string) => {
        setUserToken(data);
        await AsyncStorage.setItem('userToken', data);
        console.log("login called");
    }

    const userProfilePic = async (data: UserData) => {
        setProfilePic(data);
        let profilePicString = JSON.stringify(data);
        await AsyncStorage.setItem('ProfilePic', profilePicString);
        console.log("userProfilePic called");
    }

    return (
        <AuthContext.Provider value={{ login, logout, DataUser, userData, userToken, isLoggedIn, userProfile, setUserProfile }}>
            {!isLoading ? children : null} 
        </AuthContext.Provider>
    );
}

import { View, Text, Button, StyleSheet, Image } from 'react-native'
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../../navigations/AppNavigation';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { setDrawerNavigationOptions } from '../../navigations/NavigationOptions';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { firebase_app_auth } from '../../components/FirebaseConfig';
import firestore from '@react-native-firebase/firestore';
import { HeaderBackButton } from '@react-navigation/elements';
import ActionButton from '../../components/ActionButton';
import CustomActivityIndicator from '../../components/CustomActivityIndicator';
type UserProfileScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'UserProfileScreen'>;

type UserProfileScreenProps = {
  navigation: UserProfileScreenNavigationProp;
};

export default function UserProfileScreen({ navigation }: UserProfileScreenProps) {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Profile",
      headerLeft: () => (
        <HeaderBackButton onPress={() => navigation.goBack()} />
      )
    });
  }, [navigation]);


  useEffect(() => {
    setIsLoading(true); 
    const user = firebase_app_auth.currentUser;
    if (user) {
      const userId = user.uid
      firestore()
        .collection('users')
        .doc(userId)
        .get()
        .then((doc) => {
          setIsLoading(false);
          if (doc.exists) {
            const userData = doc.data();
            console.log('User details:', userData);
            if (userData) {
              setEmail(userData.email);
              setFirstName(userData.firstName);
              setLastName(userData.lastName);

            } else {
              console.log('User data is undefined.');
            }
          } else {
            // doc.data() will be undefined in this case
            console.log('No such user!');
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error('Error getting user details:', error);
        });
    }
  }, []);

  const saveProfile = () => {
    setIsLoading(true);
    const user = firebase_app_auth.currentUser;
    if (user) {
      const userId = user.uid;
      firestore()
        .collection('users')
        .doc(userId)
        .set({
          firstName: firstName,
          lastName: lastName,
          email: email, // Email is not editable, but included for completeness
        }, { merge: true }) // Use merge to update the document without overwriting other fields
        .then(() => {
          console.log('Profile successfully updated!');
          setIsLoading(false); // Stop loading if no user is found
          // Optionally, navigate back or show a success message
        })
        .catch((error) => {
          setIsLoading(false); // Stop loading if no user is found
          console.error('Error updating profile:', error);
          // Optionally, show an error message to the user
        });
    } else {
      setIsLoading(false); // Stop loading if no user is found
      console.log('No user signed in.');
      // Handle the case where no user is signed in
    }
  };  

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.profilePic} />
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First Name"
        style={styles.input}
      />
      <TextInput
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last Name"
        style={styles.input}
      />
      <TextInput
        value={email}
        editable={false} // Email is not editable
        placeholder="Email Address"
        style={[styles.input, styles.inputDisabled]}
      />

      <ActionButton style= {{width: 250}} title="Save" onPress={saveProfile} />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <CustomActivityIndicator isLoading={isLoading} message="Loading..." />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75, // Half of width/height to make it circle
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
  },
});
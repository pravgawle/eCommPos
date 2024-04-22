// useSignUp.ts
import { useState, useContext } from 'react';
import { firebase_app, firebase_app_auth, firebase_db } from '../components/FirebaseConfig';
import { createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import { AuthContext } from '../components/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigations/AppNavigation';
import firebase from '@react-native-firebase/app';
import { shopifyStoreUrl, storeFrontAccessToken } from '../components/ShopifyStoreConfig';
import firestore from '@react-native-firebase/firestore';
import {
    getFirestore,
    getDoc,
    updateDoc,
    doc
} from '@firebase/firestore/lite';

interface ErrorMessages {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface SignUpState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface UseSignUpProps {
    navigation: StackNavigationProp<RootStackParamList, 'SignUp'>;
    signUpState: SignUpState;
}

const useSignUp = ({ navigation, signUpState }: UseSignUpProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeInput, setActiveInput] = useState<string>('ALL');

    const [errorState, setErrorState] = useState({
        shouldDisplay: false,
        message: ''
    })

    const [errorMessages, setErrorMessages] = useState<ErrorMessages>({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });


    const { login, DataUser } = useContext(AuthContext);

    const validateFields = () => {
        let errors: ErrorMessages = {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        };
        let formIsValid = true;
        //console.log(`signUpState.firstName: ${signUpState.firstName}`);
        //console.log(`active input : ${activeInput}`);
        if (signUpState.firstName.length == 0 && (activeInput == 'firstName' || activeInput == 'ALL')) {
            errors.firstName = 'First name cannot be empty';
            formIsValid = false;
        }
        if (!signUpState.lastName && (activeInput == 'lastName' || activeInput == 'ALL')) {
            errors.lastName = 'Last name cannot be empty';
            formIsValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (signUpState.email.trim().length === 0 && (activeInput == 'email' || activeInput == 'ALL')) {
            errors.email = 'Email cannot be empty';
            formIsValid = false;
        } else if (!emailRegex.test(signUpState.email.trim()) && (activeInput == 'email' || activeInput == 'ALL')) {
            errors.email = 'Email ID entered is not valid';
            formIsValid = false;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (signUpState.password.trim().length === 0 && (activeInput == 'password' || activeInput == 'ALL')) {
            errors.password = 'Password cannot be empty';
            formIsValid = false;
        } else if (!passwordRegex.test(signUpState.password) && (activeInput == 'password' || activeInput == 'ALL')) {
            errors.password = 'Password must have\nat least 8 characters long\nat least one uppercase letter\none lowercase letter\natleast one number\none special character.';
            formIsValid = false;
        }
        setErrorMessages(errors);
        return formIsValid;
    }

    const onPressRegister = async (signUpState: SignUpState) => {
        if (validateFields()) {
            setIsLoading(true);
            try {
                const userCredential = await createUserWithEmailAndPassword(firebase_app_auth, signUpState.email, signUpState.password);
                setIsLoading(false);
                const token = await userCredential.user.getIdToken();
                login(token);
                DataUser(JSON.stringify(userCredential.user.providerData));
                const userId = userCredential.user.uid;

                console.log(`the user id = ${userId}`)

                // firestore()
                //     .collection('users')
                //     .doc(userId)
                //     .set({
                //         firstName: signUpState.firstName,
                //         lastName: signUpState.lastName,
                //         email: signUpState.email,
                //         cartId: "123"  // Assuming this is a placeholder value you want to set
                //     })
                //     .then(() => {
                //         console.log('User added!');
                //     });
                // You can now create a Shopify cart associated with this user's UID
                //  createCart()

                firestore()
                .collection('users')
                .doc(userId)
                .set({
                    firstName: signUpState.firstName,
                    lastName: signUpState.lastName,
                    email: signUpState.email,
                    profileUrl: '',
                })
                .then(() => {
                    console.log('User added!');
                })
                .catch((error) => {
                    console.error('Error adding user:', error);
                });
            
                // try {

                //     const userData = {
                //         emailID: 'jane.doe@example.com',
                //         firstName: 'Jane',
                //         lastName: 'Doe',
                //         userID: 'user_unique_id'  // Normally, this would be the Firebase Auth user ID
                //       };
                //     await setDoc(doc(firebase_db, 'users', userId), userData);

                //     // Attempt to update the document in Firestore
                //     await setDoc(doc(firebase_db, 'users', userId), {
                //         firstName: signUpState.firstName,
                //         lastName: signUpState.lastName,
                //         email: signUpState.email,
                //         cartId: "123"  // Assuming this is a placeholder value you want to set
                //     });
                //     console.log('User details updated successfully');
                // } catch (error) {
                //     // Handle any errors that occurred during the update
                //     console.error('Error updating user details:', error);
                // }

            } catch (error) {
                setIsLoading(false);
                const authError = error as AuthError;
                setErrorMessages(prev => ({ ...prev, general: authError.message }));
            }
        }
    };

    // Function to call your backend to create a Shopify cart
    const createCart = async (userId: string) => {
        const query = `
          mutation {
            cartCreate(input: {}) {
              cart {
                id
                checkoutUrl
              }
            }
          }
        `;
    
        
        try {
            const response = await fetch(shopifyStoreUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': storeFrontAccessToken,
                },
                body: JSON.stringify({ query }),
            });
    
            const responseData = await response.json();
    
            if (responseData.errors) {
                console.error('GraphQL mutation error:', responseData.errors);
                return null; // Or handle this case as appropriate for your application
            } else {
                const createdCart = responseData.data.cartCreate.cart;
                console.log(`Created cart ID: ${createdCart.id}, Checkout URL: ${createdCart.checkoutUrl}`);
                // Return the created cart's ID and checkout URL
                return { cartId: createdCart.id, checkoutUrl: createdCart.checkoutUrl };
            }
        } catch (error) {
            console.error('Error creating Shopify cart:', error);
            return null; // Or handle this error as appropriate for your application
        }
    };
    



    return {
        isLoading,
        errorMessages,
        onPressRegister,
        validateFields,
        activeInput,
        setActiveInput,
        errorState,
        setErrorState
    };
};

export default useSignUp;

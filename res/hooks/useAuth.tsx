import { useState, useContext } from 'react';
import { AuthContext } from '../components/AuthContext';
import { firebase_app_auth } from '../components/FirebaseConfig';
import { signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigations/AppNavigation';
import { shopifyStoreUrl, storeFrontAccessToken } from '../components/ShopifyStoreConfig';
interface LoginState {
    email: string;
    password: string;
}

interface ErrorState {
    email: string;
    password: string;
    general: string;
}

interface UseLoginProps {
    navigation: StackNavigationProp<RootStackParamList, 'Login'>
}
const useAuth = ({ navigation }: UseLoginProps) => {
    const { login, DataUser } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [loginState, setLoginState] = useState<LoginState>({ email: '', password: '' });
    const [errorState, setErrorState] = useState<ErrorState>({ email: '', password: '', general: '' });

    const validateLogin = (): boolean => {
        let isValid = true;
        const newErrorState: ErrorState = { email: '', password: '', general: '' };

        // Validate email
        if (!loginState.email.trim()) {
            newErrorState.email = 'Email cannot be empty';
            isValid = false;
        }

        // Validate password
        if (!loginState.password.trim()) {
            newErrorState.password = 'Password cannot be empty';
            isValid = false;
        }

        setErrorState(newErrorState);
        return isValid;
    };

    const onPressLogin = async () => {
        if (!validateLogin()) return;

        setIsLoading(true);
        try {
            const response = await signInWithEmailAndPassword(firebase_app_auth, loginState.email, loginState.password);
            setIsLoading(false);
            const token = await response.user.getIdToken();
            login(token);
            DataUser(JSON.stringify(response.user.providerData));

            // Check if a Shopify cart exists for this user's UID
            
            // const cartDetails = await getCart(user.uid);
            // if (cartDetails) {
            //     console.log(`Cart ID: ${cartDetails.id}`);
            //     console.log(`Checkout URL: ${cartDetails.checkoutUrl}`);        
            // } else {

            // }
            // Navigate to another screen or perform further actions
        } catch (error) {
            setIsLoading(false);
            const authError = error as AuthError;
            setErrorState(prev => ({ ...prev, general: authError.message }));
        }
    };


      // Function to call your backend to fetch Shopify cart details
      /*const getCart = async (cartId: string) => {
        const query = `
          {
            cart(id: "${cartId}") {
              id
              checkoutUrl
              lines(first: 20) { 
                edges {
                  node {
                    merchandise {
                      ... on ProductVariant {
                        id
                        product {
                          title
                        }
                      }
                    }
                    quantity
                  }
                }
              }
              estimatedCost {
                totalAmount {
                  amount
                  currencyCode
                }
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
                console.error('GraphQL query error:', responseData.errors);
                return null; // Return null or appropriate error handling
            } else {
                const cartDetails = responseData.data.cart;
                return cartDetails; // Return the cart details object
            }
        } catch (error) {
            console.error('Error retrieving Shopify cart:', error);
            return null; // Return null or appropriate error handling
        }
    };*/
    
    const onPressForgotPassword = () => {
        // Implement forgot password logic or navigation
    };

    const onPressSignUp = () => {
        navigation.navigate('SignUp');
    };

    const clearError = () => {
        setErrorState({ email: '', password: '', general: '' });
    };

    return {
        isLoading,
        loginState,
        setLoginState,
        errorState,
        setErrorState,
        clearError,
        onPressLogin,
        onPressForgotPassword,
        onPressSignUp,
    };
};

export default useAuth;

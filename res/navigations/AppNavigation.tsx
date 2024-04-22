import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnBoarding from '../screens/registration/OnBoarding';
import LaunchScreen from '../screens/registration/LaunchScreen';
import DrawerNavigation from './DrawerNavigation'
import Login from '../screens/registration/Login';
import SignUp from '../screens/registration/SignUp';
import PDPScreen from '../screens/pdp/PDPScreen';
import { useContext, useEffect, useState } from 'react';
import { AuthContext, AuthProvider } from '../components/AuthContext'
import { Product } from '../modals/Types';
import UserProfileScreen from '../screens/profile/UserProfileScreen';
import CustomActivityIndicator from '../components/CustomActivityIndicator';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';

const Stack = createNativeStackNavigator<RootStackParamList>()


export type RootStackParamList = {
    OnBoarding: undefined; 
    LaunchScreen: undefined;
    Login: undefined; 
    SignUp: undefined; 
    DrawerNavigation: undefined;
    HomeScreen: undefined;
    PDPScreen: { item: Product }  | undefined;
    CartScreen: undefined;
    OrderScreen: undefined;
    SettingScreen: undefined;
    UserProfileScreen: undefined;
    CheckoutScreen: { webUrl: string} | undefined;
};

  
const AppNavigation = () => {

    const [isFirstTimeLaunch, setIsFirstTimeLaunch] = useState<Boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { userToken, isLoggedIn } = useContext(AuthContext)

    useEffect(() => {

        const checkIfFirstLaunch = async () => {
            try {
                console.log("Checking if it's the first launch...");
                const value = await AsyncStorage.getItem('isFirstTimeLaunch');
                console.log(`Retrieved value for 'isFirstTimeLaunch': ${value}`);
                if (value === null) {
                    console.log("No value found. Assuming it's the first launch.");
                    await AsyncStorage.setItem('isFirstTimeLaunch', 'true');
                    setIsFirstTimeLaunch(true);
                    setIsLoading(false)
                } else {
                    console.log("Value found. Not the first launch.");
                    setIsFirstTimeLaunch(false);
                    setIsLoading(false)
                }
            } catch (error) {
                console.error("Error checking if it's the first launch:", error);
                setIsFirstTimeLaunch(false);
                setIsLoading(false)
            }
            console.log("Finished checking launch status.");
        }
      
        checkIfFirstLaunch();
        
      }, []);
      

    if (isLoading) {
        return <CustomActivityIndicator isLoading={isLoading} message="Loading..." />
    }

    return (
        <NavigationContainer>
            {userToken !== null ?
                <Stack.Navigator screenOptions={{ headerShown: false, }}>
                    <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} options={{ animation: 'none' }} // Disable animation specifically for this screen
                      // Disable animation specifically for this screen

                />
                                      <Stack.Screen name="PDPScreen" component={PDPScreen} options={{ headerShown: true }} />
                                      <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} options={{ headerShown: true }} />
                                      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} options={{ headerShown: true }} />

                </Stack.Navigator>
                : 
                <Stack.Navigator initialRouteName={isFirstTimeLaunch ? "OnBoarding" : "LaunchScreen"}>
                    <Stack.Screen name="OnBoarding" component={OnBoarding} options={{ headerShown: false }} />
                    <Stack.Screen name="LaunchScreen" component={LaunchScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                    <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
                </Stack.Navigator>}
        </NavigationContainer>

    )
}

export default AppNavigation

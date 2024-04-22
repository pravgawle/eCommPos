import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { primaryColor, textColor, buttonColor } from '../../utils/Colors';
import AlertPopup from '../../components/AlertPopup';
import CustomActivityIndicator from '../../components/CustomActivityIndicator';
import React, { useState, useEffect, useRef } from 'react'
import { firebase_app_auth } from '../../components/FirebaseConfig';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigations/AppNavigation';
import useSignUp from '../../hooks/useSignup';
interface SignUpProps {
    navigation: StackNavigationProp<RootStackParamList, 'SignUp'>
}

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

export default function SignUp({navigation} : SignUpProps) {

    const [signUpState, setSignUpState] = useState<SignUpState>({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })
    const { isLoading, errorMessages, onPressRegister, validateFields, setActiveInput, errorState, setErrorState } = useSignUp({navigation, signUpState});


    const mounted = useRef(false);

    useEffect(() => {
        if (mounted.current) {
            validateFields();
        } else {
            mounted.current = true;
        }
    }, [signUpState]); 

    const onPressLogin = () => {
        navigation.goBack();
        console.log('onPressLogin')
    }
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingViewStyle}>
            <View style={styles.container}>
                <Text style={styles.title}> Create Account </Text>
                <View style={[styles.inputView, (errorMessages.firstName.length > 0) ? { borderColor: 'red', borderWidth: 1 } : {}]}>
                    <TextInput
                        style={[styles.inputText, (errorMessages.firstName.length > 0) ? { color: 'red' } : { color: 'black' }]}
                        placeholder="First Name"
                        keyboardType='default'
                        autoCapitalize='none'
                        autoCorrect={false}
                        placeholderTextColor= {(errorMessages.firstName.length > 0) ? 'red' : "#003f5c"}
                        onChangeText={text => {
                            setActiveInput('firstName');
                            setSignUpState(prevState => ({
                                ...prevState,
                                firstName: text
                            }));
                        }
                        } />
                </View>
                {(errorMessages.firstName.length > 0) && <Text style={styles.errorText}>{errorMessages.firstName}</Text>}
                <View style={[styles.inputView, (errorMessages.lastName.length > 0) ? { borderColor: 'red', borderWidth: 1 } : {}]}>
                    <TextInput
                        style={[styles.inputText, (errorMessages.lastName.length > 0) ? { color: 'red' } : { color: 'black' }]}
                        placeholder="Last Name"
                        keyboardType='default'
                        autoCapitalize='none'
                        autoCorrect={false}
                        placeholderTextColor={(errorMessages.lastName.length > 0) ? 'red' : "#003f5c"}
                        onChangeText={text => {
                            setActiveInput('lastName');
                            setSignUpState(prevState => ({
                                ...prevState,
                                lastName: text
                            }));
                        }
                        }/>
                </View>
                {(errorMessages.lastName.length > 0) && <Text style={styles.errorText}>{errorMessages.lastName}</Text>}
                <View style={[styles.inputView, (errorMessages.email.length > 0) ? { borderColor: 'red', borderWidth: 1 } : {}]}>
                    <TextInput
                        style={[styles.inputText, (errorMessages.email.length > 0) ? { color: 'red' } : { color: 'black' }]}
                        placeholder="Email"
                        keyboardType='email-address'
                        autoCapitalize='none'
                        autoCorrect={false}
                        placeholderTextColor={(errorMessages.email.length > 0) ? 'red' : "#003f5c"}
                        onChangeText={text => {
                            setActiveInput('email');
                            setSignUpState(prevState => ({
                                ...prevState,
                                email: text
                            }));
                        }
                        }
                        value={signUpState.email} 
                        />
                </View>
                {(errorMessages.email.length > 0) && <Text style={styles.errorText}>{errorMessages.email}</Text>}
                <View style={[styles.inputView, (errorMessages.password.length > 0) ? { borderColor: 'red', borderWidth: 1 } : {}]}>
                    <TextInput
                        style={[styles.inputText, (errorMessages.password.length > 0) ? { color: 'red' } : { color: 'black' }]}
                        secureTextEntry
                        placeholder="Password"
                        autoCapitalize='none'
                        autoCorrect={false}
                        placeholderTextColor={(errorMessages.password.length > 0) ? 'red' : "#003f5c"}
                        onChangeText={text => {
                            setActiveInput('password');
                            setSignUpState(prevState => ({
                                ...prevState,
                                password: text
                            }));
                        }
                        }
                        value={signUpState.password} 
                        />
                </View>
                {(errorMessages.password.length > 0) && <Text style={styles.errorText}>{errorMessages.password}</Text>}
                <TouchableOpacity
                    onPress={() => onPressRegister(signUpState)}
                    style={styles.loginBtn}>
                    <Text style={styles.loginTextColor}>REGISTER </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onPressLogin}
                    style={styles.loginBtn}>
                    <Text style={styles.loginTextColor}> LOGIN</Text>
                </TouchableOpacity>
                <AlertPopup
                    visible={errorState.shouldDisplay}
                    message={errorState.message}
                    onClose={() => setErrorState({ ...errorState, shouldDisplay: false })}
                />
                <CustomActivityIndicator isLoading={isLoading} message="Loading..." />
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    errorText: {
        width: '80%',
        color: 'white',
        fontSize: 12,
        marginBottom: 5,
        marginLeft: 20,
        flexWrap: "wrap"
    },
    keyboardAvoidingViewStyle: {
        flex: 1,
        backgroundColor: primaryColor
    },
    container: {
        flex: 1,
        backgroundColor: primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontWeight: "bold",
        fontSize: 50,
        color: textColor,
        marginBottom: 40,
    },
    inputView: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 25,
        height: 50,
        marginBottom: 10,
        justifyContent: "center"
    },
    inputText: {
        height: 50,
        marginLeft: 20,
        marginRight: 20,
        color: "black"
    },
    forgotAndSignUpText: {
        color: textColor,
        fontSize: 11
    },
    loginTextColor: {
        color: textColor,
        fontSize: 20
    },
    loginBtn: {
        width: "80%",
        backgroundColor: buttonColor,
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 10
    }
});
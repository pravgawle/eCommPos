import React, { Component, useContext, useState } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { primaryColor, secondaryColor, textColor, backgroundColor, buttonColor } from '../../utils/Colors'; // Import colors
import { firebase_app_auth } from '../../components/FirebaseConfig';
import { AuthError, signInWithEmailAndPassword } from 'firebase/auth';
import AlertPopup from '../../components/AlertPopup';
import CustomActivityIndicator from '../../components/CustomActivityIndicator';
import { AuthContext } from '../../components/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigations/AppNavigation';
import useAuth from '../../hooks/useAuth';
interface LoginProps {
    navigation: StackNavigationProp<RootStackParamList, 'Login'>
}

const Login = ({ navigation } : LoginProps) => {
    const { isLoading, 
        loginState, 
        setLoginState, 
        errorState, 
        setErrorState,
        clearError, 
        onPressLogin, 
        onPressForgotPassword, 
        onPressSignUp  } = useAuth({navigation});
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <View style={[styles.inputView, errorState.email ? { borderColor: 'red', borderWidth: 2 } : {}]}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Email"
                    keyboardType='email-address'
                    autoCapitalize='none'
                    autoCorrect={false}
                    placeholderTextColor="#003f5c"
                    onChangeText={text => {
                        setErrorState({...errorState, email: ''})
                        setLoginState({ ...loginState, email: text });
                          }
                     }
                    value={loginState.email} />
            </View>
            {errorState.password ? <Text style={styles.errorText}>{errorState.email}</Text> : null}
            <View style={[styles.inputView, errorState.password ? { borderColor: 'red', borderWidth: 2 } : {}]}>
                <TextInput
                    style={styles.inputText}
                    secureTextEntry
                    keyboardType='default'
                    autoCapitalize='none'
                    autoCorrect={false}
                    placeholder="Password"
                    placeholderTextColor="#003f5c"
                    onChangeText={text => {
                        setErrorState({...errorState, password: ''})
                        setLoginState({ ...loginState, password: text });
                          }
                     }
                    value={loginState.password}/>
            </View>
            {errorState.password ? <Text style={styles.errorText}>{errorState.email}</Text> : null}
            <TouchableOpacity
                onPress={onPressForgotPassword}>
                <Text style={styles.forgotAndSignUpText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onPressLogin}
                style={styles.loginBtn}>
                <Text style={styles.loginTextColor}>LOGIN </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onPressSignUp}
                style={styles.loginBtn}>
                <Text style={styles.loginTextColor}>Signup</Text>
            </TouchableOpacity>
            <AlertPopup
                visible={errorState.general !== ''}
                message= {errorState.general}
                onClose={() => setErrorState({ ...errorState, general: '' })}
            />
            <CustomActivityIndicator isLoading={isLoading} message="Loading..." />
        </View>
    )
}

const styles = StyleSheet.create({
    errorText: {
        width: '80%',
        color: 'red',
        fontSize: 15,
        marginBottom: 5,
        marginLeft: 20,
        flexWrap: "wrap"
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
        justifyContent: "center",
        padding: 20
    },
    inputText: {
        height: 50,
        color: "black"
    },
    forgotAndSignUpText: {
        color: textColor,
        fontSize: 11,
        marginTop: 10
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

export default Login;



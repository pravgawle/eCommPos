import { View, Text, StyleSheet, TouchableHighlight } from "react-native"
import { primaryColor, secondaryColor, textColor, backgroundColor, buttonColor } from '../../utils/Colors';
import { regularFont, boldFont, italicFont } from '../../utils/Fonts';
import { TouchableOpacity } from "react-native-gesture-handler";
import { RootStackParamList } from "../../navigations/AppNavigation";
import { StackNavigationProp } from "@react-navigation/stack";


interface LaunchScreenProps {
    navigation: StackNavigationProp<RootStackParamList, 'LaunchScreen'>
}

const LaunchScreen = ({ navigation } : LaunchScreenProps) => {

    const signInButtonPressed = ()=> {
        navigation.navigate('Login')
        console.log('sign In button pressed')
    }

    const signUpButtonPressed = ()=> {
        navigation.navigate('SignUp')
    }

    return (
        <View style={styles.backgroundStyle}>
            <Text style={styles.textStyle2}>Please create your account or Sign In if you are a existing user</Text>
            <TouchableHighlight style={styles.startButtonStyle} underlayColor={primaryColor} onPress={signInButtonPressed}>
                <Text style= {{color: "white", fontFamily: boldFont, fontSize: 20}}>Sign In</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.startButtonStyle} underlayColor={primaryColor} onPress={signUpButtonPressed}>
                <Text style= {{color: "white", fontFamily: boldFont, fontSize: 20}}>Sign Up</Text>
            </TouchableHighlight>
        </View>
    )
}
export default LaunchScreen;

const styles = StyleSheet.create({
    startButtonStyle: {
        backgroundColor: buttonColor, 
        justifyContent: 'center', 
        alignItems: "center",
        minWidth: 250,
        borderRadius: 10,
        minHeight: 50,
        margin: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4
    },
    backgroundStyle: {
        backgroundColor: primaryColor, 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: "center"
    },
    textStyle1: {
        color: textColor,
        fontFamily: boldFont,
        fontSize: 30,
        margin: 30
    },
    textStyle2: {
        color: textColor,
        fontFamily: regularFont,
        fontSize: 30,
        textAlign: "center",
        margin: 20
    }
})

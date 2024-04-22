import { View, Text, StyleSheet, TouchableHighlight } from "react-native"
import { primaryColor, secondaryColor, textColor, backgroundColor, buttonColor } from '../../utils/Colors'; // Import colors
import { regularFont, boldFont, italicFont } from '../../utils/Fonts'; // Import fonts
import { TouchableOpacity } from "react-native-gesture-handler";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigations/AppNavigation";

interface OnBoardingProps {
    navigation: StackNavigationProp<RootStackParamList, 'OnBoarding'>
}

const OnBoarding = ({ navigation } : OnBoardingProps) => {

    const startButtonPressed = ()=> {
        navigation.navigate('LaunchScreen');
    }

    return (
        <View style={styles.backgroundStyle}>
            <Text style={styles.textStyle1}>Welcome</Text>
            <Text style={styles.textStyle2}>E-COMM POS</Text>
            <TouchableHighlight style={styles.startButtonStyle} underlayColor={primaryColor} onPress={startButtonPressed}>
                <Text style= {{color: "white", fontFamily: boldFont, fontSize: 20}}>START</Text>
            </TouchableHighlight>
        </View>
    )
}
export default OnBoarding;

const styles = StyleSheet.create({
    startButtonStyle: {
        backgroundColor: buttonColor, 
        justifyContent: 'center', 
        alignItems: "center",
        minWidth: 250,
        borderRadius: 10,
        minHeight: 50,
        margin: 50,
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
        fontSize: 30
    }
})

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { primaryColor, redColor } from '../utils/Colors';

interface ActionButtonSecondaryProps {
  title: string; // Title of the button
  onPress: (event: GestureResponderEvent) => void; // Function to call when the button is pressed
  style?: StyleProp<ViewStyle>; 
  textStyle?: StyleProp<TextStyle>; 
}

const ActionButtonSecondary: React.FC<ActionButtonSecondaryProps> = ({ title, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ActionButtonSecondary;

const styles = StyleSheet.create({
  button: {
    backgroundColor: redColor,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    padding: 5,
  },
});

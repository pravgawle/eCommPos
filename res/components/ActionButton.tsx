import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import { primaryColor } from '../utils/Colors';

interface ActionButtonProps {
  title: string; // Title of the button
  onPress: (event: GestureResponderEvent) => void; // Function to call when the button is pressed
  style?: StyleProp<ViewStyle>; 
  textStyle?: StyleProp<ViewStyle>; 
}

const ActionButton: React.FC<ActionButtonProps> = ({ title, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: primaryColor,
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
  },
});

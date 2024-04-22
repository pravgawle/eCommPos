import React from 'react';
import { View, Modal, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { whiteColor, transparentBlackBackground, primaryColor } from '../utils/Colors';


type CustomActivityIndicatorProps = {
  isLoading: boolean;
  message?: string;
};

const CustomActivityIndicator = ({ isLoading, message } : CustomActivityIndicatorProps) => {
  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={isLoading}
      onRequestClose={() => {}}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          {message && <Text style={styles.message}>{message}</Text>}
          <ActivityIndicator
            animating={isLoading}
            size="large"
            color={primaryColor} // Customize the color as needed
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: transparentBlackBackground, // Semi-transparent background
  },
  activityIndicatorWrapper: {
    backgroundColor: whiteColor,
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  message: {
    marginBottom: 5,
  },
});

export default CustomActivityIndicator;

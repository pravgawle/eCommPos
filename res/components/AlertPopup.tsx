import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { textColor, primaryColor, buttonColor, transparentBlackBackground, whiteColor } from '../utils/Colors';

interface AlertPopupProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const AlertPopup = ({ visible, message, onClose } : AlertPopupProps) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.alertBox}>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: transparentBlackBackground,
  },
  alertBox: {
    width: '80%',
    backgroundColor: whiteColor,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  message: {
    marginBottom: 55,
    textAlign: 'center',
  },
  button: {
    minWidth: 60,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: primaryColor,
  },
  buttonText: {
    color: whiteColor,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AlertPopup;

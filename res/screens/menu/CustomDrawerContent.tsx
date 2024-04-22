import React, { useContext } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { AuthContext } from '../../components/AuthContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigations/AppNavigation';
import ActionButtonSecondary from '../../components/ActionButtonSecondary';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { logout, userProfile } = useContext(AuthContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { DataUser } = useContext(AuthContext);

  const handleLogout = () => {
    console.log('User logged out');
    logout()
  };

  const navigateToUserProfile = () => {
    navigation.navigate('UserProfileScreen')
  };

  return (
    <DrawerContentScrollView {...props}>
      <TouchableOpacity onPress={navigateToUserProfile} style={styles.userSection}>
        <Text style={styles.userName}>{userProfile?.firstName ?? 'User'}</Text>
      </TouchableOpacity>
      <DrawerItemList {...props} />
      <View style={styles.logoutSection}>
        <ActionButtonSecondary style={{height : 40}} title="Logout" onPress={handleLogout} />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  logoutSection: {
    flexDirection: 'column-reverse',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  userSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomDrawerContent;
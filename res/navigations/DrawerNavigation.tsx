import { createDrawerNavigator } from '@react-navigation/drawer'
import React, { Component, useContext } from 'react'
import { Text, View } from 'react-native'
import HomeScreen from '../screens/home/HomeScreen'
import CartScreen from '../screens/cart/CartScreen'
import OrderScreen from '../screens/orders/OrderScreen'
import SettingScreen from '../screens/settings/SettingScreen'
import PDPScreen from '../screens/pdp/PDPScreen'
import { Product } from '../modals/Types'
import { createStackNavigator } from '@react-navigation/stack'
import CustomDrawerContent from '../screens/menu/CustomDrawerContent'
import { AuthContext } from '../components/AuthContext'
const Drawer = createDrawerNavigator()
const HomeStack = createStackNavigator();

export default function DrawerNavigation() {

  return (
    <Drawer.Navigator initialRouteName="HomeScreen"  drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Cart" component={CartScreen} />
      <Drawer.Screen name="Orders" component={OrderScreen} />
      <Drawer.Screen name="Settings" component={SettingScreen} />
    </Drawer.Navigator>
  );
}

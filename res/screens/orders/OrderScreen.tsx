import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { setDrawerNavigationOptions } from '../../navigations/NavigationOptions';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../../navigations/AppNavigation';
import { useCart } from '../../hooks/useCart';
import { useOrders } from '../../hooks/useOrders';
import { useIsFocused } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import CustomActivityIndicator from '../../components/CustomActivityIndicator';

type OrdersScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'OrderScreen'>;

type OrdersScreenProps = {
  navigation: OrdersScreenNavigationProp;
};

export default function OrdersScreen({ navigation }: OrdersScreenProps) {
  const { orders, fetchOrders } = useOrders();
  const { cartItemCount, fetchCartItemCount } = useCart();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);  // Add this line


  useLayoutEffect(() => {
    setDrawerNavigationOptions({ navigation, cartItemCount, navigationTitle: 'Orders' });
  }, [navigation, cartItemCount]);


  useEffect(() => {
    if (isFocused) {
      setIsLoading(true);   // Set loading to true before starting to fetch data
      fetchCartItemCount();
      fetchOrders();
      setIsLoading(false);  // Set loading to false after data is fetched
    }
  }, [isFocused]); 

  return (
    <View style={styles.container}>
      {isLoading ? (
          <CustomActivityIndicator isLoading={isLoading} message="Loading..." />
        ) : (<FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text style={styles.orderItemLabel}>Order Name:</Text>
            <Text style={styles.orderItemText}>{item.name}</Text>
            <Text style={styles.orderItemLabel}>Email:</Text>
            <Text style={styles.orderItemText}>{item.email}</Text>
            <Text style={styles.orderItemLabel}>Total Price:</Text>
            <Text style={styles.orderItemText}>{item.totalPrice}</Text>
            <Text style={styles.orderItemLabel}>Product:</Text>
            {item.lineItems.map((lineItem, index) => (
              <Text key={index} style={styles.orderItemText}>{lineItem.quantity} x {lineItem.name}</Text>
            ))}
            <View style={styles.statusContainer}>
              <Text style={styles.statusTextLabel}>Fulfillment:</Text>
              <Text style={styles.statusText}>{item.displayFulfillmentStatus}</Text>
              <Text style={styles.statusTextLabel}>Payment:</Text>
              <Text style={styles.statusText}>{item.displayFinancialStatus}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyMessageContainer}>
            <Text style={styles.emptyMessageText}>You have No orders</Text>
          </View>
        )}
      />)}
    </View>
  );
}
const styles = StyleSheet.create({

  statusTextLabel: {
    fontWeight: 'bold',
    fontSize: 11, // Same as other labels, adjust if needed
    color: 'black'
  },
  orderItemText: {
    fontSize: 11, // Same as other labels, adjust if needed
    color: 'gray'
  },
  orderItemLabel: {
    fontWeight: 'bold',
    fontSize: 11, // Adjust font size as needed
    color: 'black' // or any other color you prefer
  },
  emptyMessageText: {
    fontSize: 16,
    color: 'gray',
  },
  emptyMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  statusContainer: {
    flex: 1, // Adjust the flex ratio to allocate space according to your design
    alignItems: 'flex-end', // Aligns text to the right side
  },
  statusText: {
    fontSize: 12,
    color: 'grey'
  },
  orderItem: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  
});
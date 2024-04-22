import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useLayoutEffect } from 'react'
import { setDrawerNavigationOptions } from '../../navigations/NavigationOptions';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../../navigations/AppNavigation';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import CartProductCell from './views/CartProductCell';
import { primaryColor } from '../../utils/Colors';
import { useIsFocused } from '@react-navigation/native';
import CustomActivityIndicator from '../../components/CustomActivityIndicator';
import ActionButton from '../../components/ActionButton';
import ActionButtonSecondary from '../../components/ActionButtonSecondary';
import { useCartMenu } from './useCartMenu';

type CartScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'CartScreen'>;

type CartScreenProps = {
  navigation: CartScreenNavigationProp;
};

export default function CartScreen({ navigation }: CartScreenProps) {

  const {
    cartProducts,
    cartItemCount,
    handleProceedToCheckout,
    handleClearCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
    loadCart,
    isLoading
} = useCartMenu(navigation);

  const isFocused = useIsFocused()

  useLayoutEffect(() => {
    setDrawerNavigationOptions({ navigation, cartItemCount, navigationTitle: 'Cart' });
    const fetchData = async () => {
      loadCart()
    };
    fetchData();
  }, [navigation, cartItemCount]);


  useEffect(() => {
    if (isFocused) {
      loadCart()
    }
  }, [isFocused]); 

  return (
    <>
      <StatusBar backgroundColor='#000' />
      <SafeAreaView style={styles.container}>

      <FlatList
          data={cartProducts}
          keyExtractor={(item, index) => item.id}
          numColumns={2}
          horizontal={false}
          renderItem={({ item }) => <CartProductCell
          item={item}
          onRemove={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
      />}
          contentContainerStyle={styles.contentContainer}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={() => (
            <View style={styles.emptyMessageContainer}>
              <Text style={styles.emptyMessageText}>Your cart is empty</Text>
            </View>
          )}
        />
        <View style={styles.footer}>
          <ActionButton title="Proceed to Checkout" onPress={handleProceedToCheckout} />
          <ActionButtonSecondary title="Clear Cart" onPress={handleClearCart} />
        </View>
        {isLoading && (
        <View style={styles.loadingOverlay}>
          <CustomActivityIndicator isLoading={isLoading} message="Loading..." />
        </View>
      )}
        
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({

  emptyMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessageText: {
    fontSize: 16,
    color: 'gray',
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  footer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    height: 170
  },
  footerButton: {
    backgroundColor: primaryColor,
    padding: 10,
    paddingVertical:10,
    borderRadius: 15,
  },
  footerButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  container: {
    flex: 1,
    paddingTop: -60,
  },
  scrroll: {
    padding: 12,
  },
  contentContainer: {
    paddingHorizontal: 4,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 4,
  },
})

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useCreateCheckout } from '../../hooks/useCreateCheckout';
import { Product } from '../../modals/Types';
import { useCart } from '../../hooks/useCart';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../../navigations/AppNavigation';

type CartMenuNavigationProp = DrawerNavigationProp<RootStackParamList, 'CartScreen'>;

export const useCartMenu = (navigation: CartMenuNavigationProp) => {
    const [isLoading, setIsLoading] = useState(true); 
    const {createCheckout} = useCreateCheckout();
    const { cartProducts, addToCart, updateCartItemQuantityFromCart, cartItemCount, removeItemFromCart, clearCart, fetchCartProducts, fetchCartItemCount } = useCart();
  

    const loadCart = async () => {
        setIsLoading(true);
        await fetchCartItemCount();
        await fetchCartProducts();
        setIsLoading(false);
      };


    const handleClearCart = () => {
        console.log('Clear cart');
        clearCart();
      };

      const handleRemoveFromCart = (variantID: string) => {
        setIsLoading(true);
        removeItemFromCart(variantID);
        setIsLoading(false);
    };

    const handleUpdateQuantity = (item: Product, newQuantity: number) => {
        if (newQuantity > 0) {
          setIsLoading(true);
          updateCartItemQuantityFromCart(item.variantID, newQuantity);
          setIsLoading(false);
        }
    };

  const handleProceedToCheckout = useCallback(async () => {
        console.log('Proceed to Checkout');


        try {
            const webUrl = await createCheckout(cartProducts);
            if (navigation) {
                navigation.navigate('CheckoutScreen', { webUrl });
              } else {
                console.error('Navigation is undefined');
              }
          } catch (error) {
            console.error('Checkout process error:', error);
            Alert.alert("Checkout Error", "Unable to proceed to checkout. Please try again later.");
          } finally {
            setIsLoading(false);
          }
    }, [cartProducts, createCheckout, navigation]);

    return {
        cartProducts,
        addToCart,
        updateCartItemQuantityFromCart,
        removeItemFromCart,
        clearCart,
        loadCart,
        handleClearCart,
        fetchCartProducts,
        fetchCartItemCount,
        handleRemoveFromCart,
        handleUpdateQuantity,
        cartItemCount,
        handleProceedToCheckout,
        isLoading
    };
};

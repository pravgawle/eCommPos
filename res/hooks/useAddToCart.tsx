import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../modals/Types'; // Adjust the import path as necessary
import { shopifyStoreUrl, storeFrontAccessToken } from '../components/ShopifyStoreConfig';

export const useAddToCart = () => {
  const addToCart = useCallback(async (product: Product, quantity: number): Promise<string> => {
    // First, check if there is already a cart ID saved
    const existingCartId = await AsyncStorage.getItem('cartID');

    // Define GraphQL mutations for creating a new cart and updating an existing cart
    const createCartMutation = `
      mutation CartCreate($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart {
            id
          }
        }
      }
    `;

    const updateCartMutation = `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
          }
        }
      }
    `;

    const variables = {
      ...(existingCartId && { cartId: existingCartId }),
      lines: [
        {
          quantity,
          merchandiseId: `gid://shopify/ProductVariant/${product.variantID}`,
        },
      ],
    };

    const mutation = existingCartId ? updateCartMutation : createCartMutation;

    try {
      const response = await fetch(shopifyStoreUrl, {
        method: 'POST',
        headers: {
          'X-Shopify-Storefront-Access-Token': storeFrontAccessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: mutation,
          variables,
        }),
      });

      const jsonResponse = await response.json();
      const cartId = existingCartId || jsonResponse.data.cartCreate?.cart.id || jsonResponse.data.cartLinesAdd?.cart.id;
      
      // Save the new or updated cart ID in AsyncStorage
      await AsyncStorage.setItem('cartID', cartId);
      return cartId;
    } catch (error) {
      console.error('Error managing cart:', error);
      throw error;
    }
  }, []);

  return { addToCart };
};

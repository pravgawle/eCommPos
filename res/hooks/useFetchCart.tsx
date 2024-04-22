import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const graphqlAPI = 'Your Shopify Storefront GraphQL Endpoint';
const storefrontAccessToken = 'Your Storefront Access Token';

export const useFetchCart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      const cartId = await AsyncStorage.getItem('cartID');
      if (!cartId) {
        console.log('No cart ID found');
        return;
      }

      const query = `
        query FetchCart($id: ID!) {
          cart(id: $id) {
            id
            lines(first: 50) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      priceV2 {
                        amount
                        currencyCode
                      }
                      image {
                        url
                        altText
                        width
                        height
                      }
                      product {
                        id
                        title
                        handle
                      }
                    }
                  }
                }
              }
            }
            estimatedCost {
              totalAmount {
                amount
                currencyCode
              }
            }
            checkoutUrl
          }
        }
      `;

      try {
        const response = await fetch(graphqlAPI, {
          method: 'POST',
          headers: {
            'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: query,
            variables: { id: cartId },
          }),
        });

        const jsonResponse = await response.json();
        setCartItems(jsonResponse.data.cart.lines.edges.map((edge: any) => edge.node));
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, []);

  return { cartItems };
};

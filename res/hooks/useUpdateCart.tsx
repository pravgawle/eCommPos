import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const graphqlAPI = 'Your Shopify Storefront GraphQL Endpoint';
const storefrontAccessToken = 'Your Storefront Access Token';

export const useUpdateCart = () => {
    const updateCart = useCallback(async (lines: { merchandiseId: string, quantity: number }[]): Promise<void> => {
        const cartId = await AsyncStorage.getItem('cartID');
        if (!cartId) {
            throw new Error('No cart ID found');
        }

        const mutation = `
            mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
                cartLinesUpdate(cartId: $cartId, lines: $lines) {
                    cart {
                        id
                        lines(first: 10) {
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
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        const variables = {
            cartId,
            lines: lines.map(line => ({
                id: line.merchandiseId,
                quantity: line.quantity
            }))
        };

        try {
            const response = await fetch(graphqlAPI, {
                method: 'POST',
                headers: {
                    'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: mutation,
                    variables,
                }),
            });

            const jsonResponse = await response.json();
            if (jsonResponse.errors) {
                console.error('GraphQL errors:', jsonResponse.errors);
                throw new Error('Failed to update cart');
            }

            // Optionally do something with the response, e.g., update local state
        } catch (error) {
            console.error('Error updating cart:', error);
            throw error;
        }
    }, []);

    return { updateCart };
};

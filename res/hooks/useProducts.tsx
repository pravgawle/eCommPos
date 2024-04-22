// useProducts.ts
import { useState, useEffect, useCallback } from 'react';
import { Product, ProductEdge } from '../modals/Types'; // Adjust the import path as needed
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shopifyStoreUrl, storeFrontAccessToken, shopifyAdminStoreUrl } from '../components/ShopifyStoreConfig';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [countCart, setCountCart] = useState<number>(0);
  const [cartId, setcartId] = useState<string | null>(null);


  const fetchDataNew = useCallback(async () => {
    try {
      const query = `
      {
        products(first: 10) {
          edges {
            node {
              id
              title
              description
              images(first: 1) {
                edges {
                  node {
                    originalSrc
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    price
                  }
                }
              }
            }
          }
        }
      }`;

      const response = await fetch(shopifyAdminStoreUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': storeFrontAccessToken,
        },
        body: JSON.stringify({
          query,
        }),
      });

      const jsonResponse = await response.json();
      console.log('GraphQL query response:', jsonResponse);

      if (jsonResponse.errors) {
        console.error('GraphQL query error fetch products data:', jsonResponse.errors);
        throw new Error('Failed to fetch products due to GraphQL errors');
      }

      const fetchedProducts = jsonResponse.data.products.edges.map((edge: ProductEdge) => ({
        id: edge.node.id,
        title: edge.node.title,
        description: edge.node.description,
        imageUrl: edge.node.images.edges[0]?.node.originalSrc,
        price: edge.node.variants.edges[0]?.node.price,
        variantID: edge.node.variants.edges[0]?.node.id,
      }));

      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Optionally, handle the error in state/UI
    }
  }, []);

  const fetchData = async () => {
    try {
      const query = `
      {
        products(first: 10) {
          edges {
            node {
              id
              title
              description
              images(first: 1) {
                edges {
                  node {
                    originalSrc
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    price
                  }
                }
              }
            }
          }
        }
      }`;

      const response = await fetch(shopifyStoreUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': storeFrontAccessToken,
        },
        body: JSON.stringify({ query }),
      });

      const responseData = await response.json();

      if (responseData.errors) {
        console.error('GraphQL query error:', responseData.errors);
      } else {
        const fetchedProducts = responseData.data.products.edges.map((product: any) => ({
          id: product.node.id,
          title: product.node.title,
          description: product.node.description,
          imageUrl: product.node.images.edges.length > 0 ? product.node.images.edges[0].node.originalSrc : null,
          price : product.node.variants.edges.length > 0 ? product.node.variants.edges[0].node.price : null,
          variantID: product.node.variants.edges.length > 0 ? product.node.variants.edges[0].node.id : null
        }));
        setProducts(fetchedProducts);
      }
    } catch (error) {
      console.error('Error fetching data from Shopify:', error);
    }
  };

  const updateCartCount = () => {
    setCountCart(prevCount => prevCount + 1);
  };

  const removeFromCart = () => {
    setCountCart(prevCount => Math.max(0, prevCount - 1));
  };

  useEffect(() => {
    fetchDataNew();
  }, []);


  const initialiseCart = async () => {
    try {
        // Define the GraphQL Mutation for creating a new cart
        const mutation = `
            mutation {
                cartCreate {
                    cart {
                        id
                    }
                    userErrors {
                        code
                        field
                        message
                    }
                }
            }`;

        // Send the Request to Shopify's GraphQL endpoint

        const response = await fetch(shopifyStoreUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': storeFrontAccessToken,
          },
          body: JSON.stringify({ query: mutation }),
        });

        // Process the Response
        const responseData = await response.json();

        console.log(` initialise cart json : ${responseData}`)

       // Check if there are user errors
        if (responseData.data && responseData.data.cartCreate && responseData.data.cartCreate.userErrors && responseData.data.cartCreate.userErrors.length > 0) {
            console.error('Cart creation errors:', responseData.data.cartCreate.userErrors);
        } else if (responseData.data && responseData.data.cartCreate && responseData.data.cartCreate.cart) {
            // Extract the Cart ID and use it
            const newCartId = responseData.data.cartCreate.cart.id;
            await AsyncStorage.setItem('cartId', newCartId); // Persist cart ID for later use
            console.log(`Created cart ID is: ${newCartId}`);
        } else {
            console.error('Unexpected response structure:', responseData);
        }
    } catch (error) {
        console.error('Error creating cart:', error);
    }
};


  return { products, countCart, updateCartCount, removeFromCart, cartId};
};

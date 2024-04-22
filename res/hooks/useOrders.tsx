import { useCallback, useState } from 'react';
import { shopifyAdminStoreUrl, storeFrontAccessToken } from '../components/ShopifyStoreConfig';
import { firebase_app_auth } from '../components/FirebaseConfig';

interface LineItem {
  name: string;
  quantity: number;
}

interface Order {
  id: string;
  name: string;
  email: string;
  totalPrice: string;
  lineItems: LineItem[];
  displayFulfillmentStatus: string;
  displayFinancialStatus: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {

    const user = firebase_app_auth.currentUser;
    const customerEmail = user?.email ?? ''
    console.log(`customerEmail = ${customerEmail}`)
    try {
        const query = `
        {
          orders(first: 10, query: "email:'${customerEmail}'") {
            edges {
              node {
                id
                name
                email
                totalPrice
                displayFulfillmentStatus
                displayFinancialStatus
                lineItems(first: 5) {
                  edges {
                    node {
                      name
                      quantity
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
        body: JSON.stringify({ query }),
      });

      const jsonResponse = await response.json();
      console.log('GraphQL query response:', jsonResponse);

      if (jsonResponse.errors) {
        console.error('GraphQL query error:', jsonResponse.errors);
        throw new Error('Failed to fetch orders due to GraphQL errors');
      }

      console.log('GraphQL query response:', jsonResponse.data.orders);

      const fetchedOrders = jsonResponse.data.orders.edges.map((edge: any) => ({
        id: edge.node.id,
        name: edge.node.name,
        email: edge.node.email,
        totalPrice: edge.node.totalPrice,
        displayFulfillmentStatus: edge.node.displayFulfillmentStatus,
        displayFinancialStatus: edge.node.displayFinancialStatus,
        lineItems: edge.node.lineItems.edges.map((lineItemEdge: any) => ({
          name: lineItemEdge.node.name,
          quantity: lineItemEdge.node.quantity,
        })),
      }));
      console.log(`fetchedOrders - ${fetchedOrders}`)
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Error fetching orders');
    }
  }, [shopifyAdminStoreUrl, storeFrontAccessToken]);

  return { orders, error, fetchOrders };
};

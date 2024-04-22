import { useCallback, useState } from 'react';
import { shopifyStoreUrl, storeFrontAccessToken, storeFrontApiAccessToken } from '../components/ShopifyStoreConfig';
import { Product } from '../modals/Types';
import { useCart } from './useCart';
// Define the interface for the checkout response for better type checking
interface CheckoutResponse {
    webUrl: string;
}

interface CheckoutUserError {
    code: string;
    field: [string];
    message: string;
  }
  
  interface Checkout {
    webUrl: string;
  }

interface CheckoutCreateResponse {
    data: {
      checkoutCreate: {
        checkout?: Checkout;
        checkoutUserErrors: CheckoutUserError[];
      };
    };
    errors?: { message: string }[];
  }

const CREATE_CHECKOUT_MUTATION = `
mutation createCheckout($input: CheckoutCreateInput!) {
  checkoutCreate(input: $input) {
    checkout {
      webUrl
    }
    checkoutUserErrors {
      code
      field
      message
    }
  }
}`;
// Custom hook to create a Shopify checkout
export const useCreateCheckout = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [checkoutSession, setCheckoutSession] = useState<string | null>(null);
    const { clearCart } = useCart();

    const createCheckout = useCallback(async (products: Product[]): Promise<string> => {
    setIsLoading(true);
    setError(null);

    const lineItems = products.map(product => ({
      variantId: product.variantID,
      quantity: product.quantity,
    }));

    try {
      const response = await fetch(shopifyStoreUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storeFrontApiAccessToken,
        },
        body: JSON.stringify({
          query: CREATE_CHECKOUT_MUTATION,
          variables: { input: { lineItems } },
        }),
      });

      const jsonResponse: CheckoutCreateResponse = await response.json();

      if (jsonResponse.errors?.length) {
        throw new Error(`GraphQL errors: ${JSON.stringify(jsonResponse.errors)}`);
      }

      const { checkoutCreate } = jsonResponse.data;
      if (checkoutCreate.checkoutUserErrors.length > 0) {
        throw new Error(`Checkout creation errors: ${JSON.stringify(checkoutCreate.checkoutUserErrors)}`);
      }

      const { checkout } = checkoutCreate;
      if (checkout && checkout.webUrl) {
        setCheckoutSession(checkout.webUrl);
        return checkout.webUrl;
      } else {
        throw new Error('Failed to create checkout due to unknown reasons');
      }
    } catch (err) {
      setError(err as Error);
      throw err; // Re-throw to ensure the error can be handled by the caller
    } finally {
      setIsLoading(false);
    }
  }, []);

    return { createCheckout, checkoutSession, isLoading, error };
};


/*
export const useCreateCheckout = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [checkoutSession, setCheckoutSession] = useState<CheckoutResponse | null>(null);
  
    const createCheckout = useCallback(async (products: Product[]): Promise<string> => {
      setIsLoading(true);
      setError(null);
  
      const lineItems = products.map(product => ({
        variantId: product.variantID,
        quantity: product.quantity,
      }));
  
      try {
        const response = await fetch(shopifyStoreUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': storeFrontAccessToken,
          },
          body: JSON.stringify({
            query: CREATE_CHECKOUT_MUTATION,
            variables: { input: { lineItems } },
          }),
        });
  
        const jsonResponse: any = await response.json();
        console.log(`checkout response - ${jsonResponse.data.checkoutCreate}`)

        if (jsonResponse.errors || jsonResponse.data.checkoutCreate.checkoutUserErrors.length > 0) {
          const errorMessage = jsonResponse.errors ? jsonResponse.errors : jsonResponse.data.checkoutCreate.checkoutUserErrors;
          setError(new Error(`GraphQL errors: ${JSON.stringify(errorMessage)}`));
          return Promise.reject(new Error(`GraphQL errors: ${JSON.stringify(errorMessage)}`));
        }
  
        const { checkout } = jsonResponse.data.checkoutCreate;
        console.log(`checkout response - ${jsonResponse}`)
        if (checkout) {
          setCheckoutSession(checkout);
          console.log(`checkout irl - ${checkout.webUrl}`)
          return checkout.webUrl;
        } else {
          throw new Error('Failed to create checkout due to unknown reasons');
        }
      } catch (error) {
        setError(error as Error);
        return Promise.reject(error);
      } finally {
        setIsLoading(false);
      }
    }, []);
  
    return { createCheckout, checkoutSession, isLoading, error };
  };*/
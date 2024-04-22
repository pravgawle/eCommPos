export interface Product {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: string;
    variantID: string;
    quantity: number;
  }
  


  export interface ProductVariantPrice {
    amount: string;
    currencyCode: string;
  }
  
  export interface ProductVariant {
    id: string;
    title: string;
    price: string;
  }
  
  export interface ProductImage {
    originalSrc: string;
  }
  
  interface ProductNode {
    id: string;
    title: string;
    description: string;
    images: {
      edges: Array<{ node: ProductImage }>;
    };
    variants: {
      edges: Array<{ node: ProductVariant }>;
    };
  }
  
  export interface ProductEdge {
    node: ProductNode;
  }


  export interface CartProduct extends Product {
    variantID: string;
    quantity: number;
  }

  export type UserProfile = {
    firstName?: string;
    lastName?: string;
    email?: string;
    token?: string;
    profileUrl?: string;
  } | null;
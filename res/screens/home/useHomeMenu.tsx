import { useState } from "react";
import { useCart } from "../../hooks/useCart";
import { Product } from "../../modals/Types";
import { useProducts } from "../../hooks/useProducts";

export const useHomeMenu = () => {
    const [isLoading, setIsLoading] = useState(true); 
    const { cartProducts, addToCart, updateProductQuantity, cartItemCount, fetchCartItemCount, fetchCartProducts } = useCart();
    const { products } = useProducts();
  

    const loadHomeScren = async () => {
        setIsLoading(true);
        await fetchCartItemCount();
        await fetchCartProducts();
        setIsLoading(false);
      };


      const handleUpdateCountCart = async (item: Product, newQuantity: number) => {
        console.log(` product id ${item.variantID} and quantity - ${newQuantity}`);
        setIsLoading(true); 
        await addToCart(item, newQuantity);
        setIsLoading(false); 
      };
    
    return { cartProducts, addToCart, updateProductQuantity, cartItemCount, fetchCartItemCount, fetchCartProducts, loadHomeScren, handleUpdateCountCart, products, isLoading };
};

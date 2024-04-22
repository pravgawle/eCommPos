import { useState, useEffect } from 'react';
import { Product } from '../modals/Types';
import firestore from '@react-native-firebase/firestore';
import { firebase_app_auth } from '../components/FirebaseConfig';
import firebase from "firebase/app";
import useCurrentUser from './useCurrentUser';

export const useCart = () => {
    const [cartItemCount, setCartItemCount] = useState<number>(0);
    const [cartProducts, setCartProducts] = useState<Product[]>([]);

       // Function to update the total item count from Firestore
       const fetchCartItemCount = async () => {
        try {
            const user = firebase_app_auth.currentUser;

            if (!user) {
                console.log('User is not logged in');
                return;
            }
            console.log(`get user uid - ${user.uid}`);
            const cartItemsSnap = await firestore().collection('carts').doc(user.uid).collection('items').get();
            let itemCount = 0;
            cartItemsSnap.forEach(doc => {
                console.log(`doc data - ${doc.data().quantity}`);
                itemCount += doc.data().quantity;
            });
            console.log(`fetch cart item count - ${itemCount}`)
            setCartItemCount(itemCount);
        } catch (error) {
            console.error('Error fetching cart item count:', error);
        }
    };

    // Function to add a product to the cart
    // Function to fetch all products from the cart
    const fetchCartProducts = async () => {
        const user = firebase_app_auth.currentUser;

        if (!user) {
            console.log('User is not logged in');
            return;
        }

        const cartItemsSnap = await firestore().collection('carts').doc(user.uid).collection('items').get();
        const newCartProducts: Product[] = [];
        let newCartItemCount = 0;

        cartItemsSnap.forEach(doc => {
            const data = doc.data(); // Ensure this casting aligns with your product model

            const product: Product = {
                id: data.productId
                , // Assuming you want to use Firestore document ID as product ID in your app
                title: data.productTitle,
                description: data.productDescription,
                imageUrl: data.productImageUrl,
                price: data.productPrice,
                variantID: data.productVariantId,
                quantity: data.quantity
            };
            console.log(`product id - ${product.id}`)
            console.log(`product id - ${product.description}`)
            console.log(`product id - ${product.title}`)
            console.log(`product id - ${product.imageUrl}`)
            console.log(`product - ${product}`)

            newCartProducts.push(product);
            newCartItemCount += product.quantity;
        });

        setCartProducts(newCartProducts);
        setCartItemCount(newCartItemCount);
    };

    // Function to add a product to the cart
    const addToCart = async (item: Product, addedQuantity: number) => {
        try {
            const user = firebase_app_auth.currentUser;
            if (!user?.uid) {
                console.log('User not signed in');
                return;
            }

            const updatedVariantID = item.variantID.replace('gid://shopify/ProductVariant/', '');
            const itemRef = firestore().collection('carts').doc(user.uid).collection('items').doc(updatedVariantID);

            const doc = await itemRef.get();
            let newQuantity = addedQuantity;
            if (doc.exists) {
                newQuantity += doc.data()?.quantity || 0;
            }

            await itemRef.set({
                productId: item.id,
                productTitle: item.title,
                productDescription: item.description,
                productImageUrl: item.imageUrl,
                productPrice: item.price,
                productVariantId: item.variantID,
                quantity: newQuantity
            }, { merge: true });

            fetchCartItemCount();  // Update the total cart item count
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    // Function to remove a product from the cart
    const removeFromCart = async (variantID: string) => {
        const user = firebase_app_auth.currentUser;
        if (!user?.uid) {
            console.error('User not signed in');
            return;
        }

        const updatedVariantID = variantID.replace('gid://shopify/ProductVariant/', '');
        await firestore().collection('carts').doc(user.uid).collection('items').doc(updatedVariantID).delete();
        fetchCartItemCount();  // Update the total cart item count
    };

    // Function to update the quantity of an existing product in the cart
    const updateProductQuantity = async (variantID: string, newQuantity: number) => {
        const user = firebase_app_auth.currentUser;
        if (!user) {
            console.error('User is not logged in');
            return;
        }

        const updatedVariantID = variantID.replace('gid://shopify/ProductVariant/', '');
        await firestore().collection('carts').doc(user.uid).collection('items').doc(updatedVariantID).set({
            quantity: newQuantity
        }, { merge: true });

        fetchCartItemCount();  // Update the total cart item count
    };
       // Updated removeFromCart function
    const removeItemFromCart = async (variantID: string) => {
        const user = firebase_app_auth.currentUser;
        if (!user?.uid) {
            console.error('User not signed in');
            return;
        }

        // Remove the specific item from the cart
        console.error(`variantID = ${variantID}`)
        const updatedVariantID = variantID.replace('gid://shopify/ProductVariant/', '');
        await firestore().collection('carts').doc(user.uid).collection('items').doc(updatedVariantID).delete();

        // Fetch the updated cart items and count after removal
        fetchCartProducts();
    };

    const updateCartItemQuantityFromCart = async (variantID: string, quantity: number) => {
        const user = firebase_app_auth.currentUser;
        if (!user?.uid) {
            console.error('User not signed in');
            return;
        }
    
        if (quantity < 1) {
            console.error('Quantity must be at least 1');
            return;
        }
    
        const updatedVariantID = variantID.replace('gid://shopify/ProductVariant/', '');
        const itemRef = firestore().collection('carts').doc(user.uid).collection('items').doc(updatedVariantID);
    
        await itemRef.update({
            quantity: quantity
        }).then(() => {
            console.log(`Updated item ${updatedVariantID} to quantity ${quantity}`);
        }).catch((error) => {
            console.error('Error updating cart item quantity:', error);
        });
    
        // After updating, you might want to fetch the latest cart details
        await fetchCartProducts();
        await fetchCartItemCount();
    };
      // New clearCart function
    const clearCart = async () => {
        const user = firebase_app_auth.currentUser;
        if (!user?.uid) {
            console.error('User not signed in');
            return;
        }

        // Retrieve all cart items
        const cartItemsSnap = await firestore().collection('carts').doc(user.uid).collection('items').get();
        
        // Batch delete all items
        const batch = firestore().batch();
        cartItemsSnap.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        // Update the local state to reflect the empty cart
        setCartProducts([]);
        setCartItemCount(0);
    };
    // Expose functions and state for use in components
    return { cartProducts, cartItemCount, addToCart, removeFromCart, updateProductQuantity,updateCartItemQuantityFromCart, fetchCartProducts, removeItemFromCart, clearCart, fetchCartItemCount };
};
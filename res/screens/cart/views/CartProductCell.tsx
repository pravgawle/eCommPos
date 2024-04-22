import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Dimensions } from 'react-native';
import { Product } from '../../../modals/Types'; // Adjust import path as necessary
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigations/AppNavigation';
import { useCart } from '../../../hooks/useCart';
import ActionButtonSecondary from '../../../components/ActionButtonSecondary';
import { redColor } from '../../../utils/Colors';

interface CartProductCellProps {
  item: Product;
  onRemove: (variantID: string) => void;
  onUpdateQuantity: (item: Product, newQuantity: number) => void;
}

const screenWidth = Dimensions.get('window').width;
const productCellWidth = screenWidth / 2 - 8; // Adjust based on your layout preferences
let width = Dimensions.get('screen').width / 2 - 8

const CartProductCell: React.FC<CartProductCellProps> = ({ item, onRemove, onUpdateQuantity }) => {
  const productWidth = width / 2 - 12;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { updateCartItemQuantityFromCart } = useCart();
  const [quantity, setQuantity] = useState<number>(item.quantity);

  const updateQuantity = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      handleQuantityUpdate(quantity + 1);
    } else {
      handleQuantityUpdate(quantity - 1);
    }
  };

  const handleQuantityUpdate = (newQuantity: number) => {
    if (newQuantity < 1) {
      // If new quantity is less than 1, don't update the quantity
      Alert.alert('Invalid Quantity', 'Quantity cannot be less than 1.');
      return;
    }
    setQuantity(newQuantity); // Update local state
  };

  const handleUpdateCart = () => {
    onUpdateQuantity(item, quantity);
  }

  const handleDelete = () => {
    // Confirm deletion
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => onRemove(item.variantID) },
      ],
    );
  };

  const handlePress = useCallback(() => {
    navigation.navigate('PDPScreen', { item: item })
  }, [navigation, item]);

  return (
    <>
      <TouchableOpacity style={[styles.viewBox, { width: productWidth }]} onPress={handlePress}>
        <View style={styles.box}>
          <View style={styles.circularRing}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          </View>
          <View style={{ paddingTop: 10 }}>
            <Text style={styles.text}>{item.title}</Text>
          </View>
          <View style={{ paddingTop: 10 }}>
            <Text style={styles.decsText} numberOfLines={3} >{item.description}</Text>
          </View>
          <View style={{ paddingTop: 10 }}>
            <Text style={styles.text} numberOfLines={3} >{item.price}</Text>
          </View>
          <View style={styles.actionContainer}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => updateQuantity('decrease')} style={styles.quantityButton}>
                <Text style={styles.quantityText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{`${quantity}`}</Text>
              <TouchableOpacity onPress={() => updateQuantity('increase')} style={styles.quantityButton}>
                <Text style={styles.quantityText}>+</Text>
              </TouchableOpacity>
            </View>
            <ActionButtonSecondary
              title="Update Cart"
              onPress={handleUpdateCart}
              style={{ height: 25, width: 60 }}
              textStyle= {{
                fontSize: 8,
                fontWeight: '400',
                color: 'white',
                textAlign: 'center',
              }}
            />
            {/* <TouchableOpacity style={styles.btnView} onPress={handleUpdateCart}>
              <Text style={styles.addToCartText}>Update Cart</Text>
            </TouchableOpacity> */}
          </View>
        </View>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>X</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      <View style={styles.horizontalLine} />
    </>
  )
};

export default CartProductCell;

const styles = StyleSheet.create({

  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: redColor,
    borderRadius: 10,
    padding: 0,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cartBadge: {
    position: 'absolute',
    right: 5,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10, // Adjust space from the description or image above
    marginRight: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10, // Adjust based on your design
  },
  quantityButton: {
    backgroundColor: '#e0e0e0', // Light grey
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderRadius: 4,
  },
  quantityText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: 10, // Add some space between buttons and text
  },
  columnWrapper: {
    justifyContent: "space-between", // This ensures that there's space between items horizontally
    marginBottom: 4, // Adjust the space between rows
  },
  contentContainer: {
    paddingHorizontal: 4, // Adjust padding as needed
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrroll: {
    padding: 12,
  },
  horizontalLine: {
    marginVertical: 10,
  },
  viewBox: {

    // {{backgroundColor:'red', flex: 0.5, width:width, height:300, margin: 4}}
    flex: 0.5,
    width: width,
    height: 330,
    margin: 4,
    flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // alignSelf:'center',
    backgroundColor: "white"
  },

  newBox: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#fff0e6', // You can change the border color
    backgroundColor: 'white', // You can change the background color
    alignItems: 'center',
    // justifyContent:'center',
    width: "100%",
    height: 330,
    shadowColor: 'black', // You can change the shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // This elevation is for Android shadow
  },

  box: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#fff0e6', // You can change the border color
    backgroundColor: 'white', // You can change the background color
    alignItems: 'center',
    justifyContent: 'space-between',
    width: "100%",
    height: "100%",
    shadowColor: 'black', // You can change the shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // This elevation is for Android shadow
  },
  circularRing: {
    backgroundColor: 'white', // You can change the background color
    borderRadius: 9,
    width: "100%",
    height: 150,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: 'contain',
    // tintColor:'#fff'
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
    backgroundColor: "white"
  },
  decsText: {
    fontSize: 12,
    fontWeight: '400',
    color: 'gray',
    textAlign: 'center',
    backgroundColor: "white"
  },
  btnView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    height: 30,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#900",
    paddingVertical: 0,
    paddingHorizontal: 10, // Adjust width of the button if necessary
    marginBottom: 0, // Ensure there's a margin at the bottom
    marginLeft: 'auto', // This ensures the button aligns to the right
  },

  addToCartText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
})

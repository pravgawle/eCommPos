import React, { useState, useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigations/AppNavigation';
import { Product } from '../../../modals/Types';
import ActionButtonSecondary from '../../../components/ActionButtonSecondary';
import { red } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

interface ProductCellProps {
  item: Product;
  onUpdateCountCart: (item: Product, newQuantity: number) => void;
}

let width = Dimensions.get('screen').width / 2 - 8

const ProductCell: React.FC<ProductCellProps> = memo(({ item, onUpdateCountCart }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [quantity, setQuantity] = useState<number>(1);

  const productWidth = width / 2 - 12; 

  const updateQuantity = useCallback((type: 'increase' | 'decrease') => {
    setQuantity((prevQuantity) => type === 'increase' ? prevQuantity + 1 : Math.max(1, prevQuantity - 1));
  }, []);

  const handleAddToCart = useCallback(() => {
    console.log(`item is going to cart - ${item.variantID} with quantity - ${quantity}`)
    onUpdateCountCart(item, quantity);
  }, [item.id, quantity, onUpdateCountCart]);

  const handlePress = useCallback(() => {
    navigation.navigate('PDPScreen', {item: item})
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
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={() => updateQuantity('increase')} style={styles.quantityButton}>
                <Text style={styles.quantityText}>+</Text>
              </TouchableOpacity>
            </View>

            <ActionButtonSecondary title='Add To Cart' style= {styles.btnView} textStyle= {{
                fontSize: 8,
                fontWeight: '400',
                color: 'white',
                textAlign: 'center',
              }} onPress={handleAddToCart}/>
            {/* <TouchableOpacity style={styles.btnView} onPress={handleAddToCart}>
              <Text style={styles.addToCartText}>Add To Cart</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.horizontalLine} />
    </>
  )
});

export default ProductCell;

const styles = StyleSheet.create({

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
      height: 40,
      alignItems: 'center',
      marginLeft: 5,
      marginRight: 5,
      // padding: 10,
      // marginTop: 10, // Adjust space from the description or image above
      // marginBottom: 10,
      // backgroundColor: 'red',
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 10, // Adjust based on your design
    },
    quantityButton: {
      backgroundColor: '#e0e0e0', // Light grey
      paddingHorizontal: 2,
      paddingVertical: 5,
      borderRadius: 4,
    },
    quantityText: {
      fontSize: 12,
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
      height: 300,
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
      height: 25,
      borderRadius: 5,
      padding: 5,
      backgroundColor: "#900",
      paddingVertical: 0,
      paddingHorizontal: 5, // Adjust width of the button if necessary
      marginBottom: 10, // Ensure there's a margin at the bottom
      marginLeft: 'auto', // This ensures the button aligns to the right
    },
  
    addToCartText: {
      fontSize: 10,
      fontWeight: '600',
      color: 'white',
      textAlign: 'center',
    },
  })
  
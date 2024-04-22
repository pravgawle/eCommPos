import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface CartIconWithBadgeProps {
  quantity: number;
  onPress: () => void;
}

const CartIconWithBadge: React.FC<CartIconWithBadgeProps> = ({ quantity, onPress }) => {
  return (
    <View>
      <Image
        source={require('../../../../res/assets/shopping_cart_icon.png')}
        style={styles.icon}
        resizeMode="contain" 
      />
      {quantity > 0 && (
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{quantity}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
    marginRight: 20,
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
    fontSize: 8,
    fontWeight: 'bold',
  },
});

export default CartIconWithBadge;

import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { Product } from '../../modals/Types';
import { ScrollView } from 'react-native-gesture-handler';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../../navigations/AppNavigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';


// Define the type for the product data
type PDPScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PDPScreen'>;

type PDPScreenRouteProp = RouteProp<RootStackParamList, 'PDPScreen'>;



type PDPScreenProps = {
  navigation: PDPScreenNavigationProp;
  route: PDPScreenRouteProp;
};

export default function PDPScreen({ navigation, route }: PDPScreenProps) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Store Products",
      headerLeft: () => (
        <HeaderBackButton onPress={() => navigation.goBack()} />
      )
    });
  }, [navigation]);

  return (
      <ScrollView style={styles.container}>
        <Image source={{ uri: route.params?.item.imageUrl }} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{route.params?.item.title}</Text>
          <Text style={styles.description}>{route.params?.item.description}</Text>
        </View>
      </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
});

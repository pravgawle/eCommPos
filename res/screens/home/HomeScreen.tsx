import { View, StatusBar, SafeAreaView, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useLayoutEffect } from 'react'
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../../navigations/AppNavigation';
import ProductCell from './views/ProductCell';
import { setDrawerNavigationOptions } from '../../navigations/NavigationOptions';
import { useIsFocused } from '@react-navigation/native';
import CustomActivityIndicator from '../../components/CustomActivityIndicator';
import { useHomeMenu } from './useHomeMenu';

type HomeScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'HomeScreen'>;

type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {

  const 
  { cartItemCount, 
    loadHomeScren,
    handleUpdateCountCart,
    products,
    isLoading } = useHomeMenu();

  const isFocused = useIsFocused(); 


  useLayoutEffect(() => {
    setDrawerNavigationOptions({ navigation, cartItemCount, navigationTitle: 'Store' });
  }, [navigation, cartItemCount]);

  useEffect(() => {
    const fetchData = async () => {
      loadHomeScren()
    };
  
    fetchData();
  }, []);


  useEffect(() => {
    if (isFocused) {
      loadHomeScren() 
    }
  }, [isFocused]); 
  
  return (
    <>
      <StatusBar backgroundColor='#000' />
      <SafeAreaView style={styles.container}>
       <FlatList
          data={products}
          keyExtractor={(item, index) => item.id}
          numColumns={2}
          horizontal={false}
          renderItem={({ item }) => <ProductCell item={item} onUpdateCountCart={handleUpdateCountCart} />}
          contentContainerStyle={styles.contentContainer}
          columnWrapperStyle={styles.columnWrapper}
        />
      {isLoading && (
        <View style={styles.overlay}>
          <CustomActivityIndicator isLoading={isLoading} message="Loading..." />
        </View>
      )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrroll: {
    padding: 12,
  },
  contentContainer: {
    paddingHorizontal: 4,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 4,
  },
  overlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
})

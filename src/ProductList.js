
import React, { useState } from 'react';
import { FlatList, View, Text, Image, TouchableOpacity, StyleSheet, Alert, Dimensions, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import products from './products.json'; 

const ProductList = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const addItemToCart = async (item) => {
    const storedCart = await AsyncStorage.getItem('cart');
    let updatedCart = storedCart ? JSON.parse(storedCart) : [];

    const itemIndex = updatedCart.findIndex(cartItem => cartItem.id === item.id);
    
    if (itemIndex > -1) {
      
      updatedCart[itemIndex].quantity += 1;
    } else {
      
      updatedCart.push({ ...item, quantity: 1 });
    }
    
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
    Alert.alert('Success', `${item.title} added to cart`);
  };

  const filteredProducts = products.products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProduct = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2} ellipsizeMode='tail'>{item.description}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.discount}>Discount: {item.discountPercentage}%</Text>
          <Text style={styles.price}>₹{item.price}</Text>
        </View>
        <Text style={styles.rating}>Rating: {item.rating}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => addItemToCart(item)}>
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
        <Text style={styles.cartButtonText}>Go to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  searchInput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    width: width * 0.9,
    alignSelf: 'center',
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 100, 
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  discount: {
    fontSize: 14,
    color: '#ff5722',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  rating: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#ff5722',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cartButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20,
    position: 'absolute',
    bottom: 0,
    width: '90%',
    alignSelf: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProductList;


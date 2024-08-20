import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        setCart(storedCart ? JSON.parse(storedCart) : []);
      } catch (error) {
        Alert.alert('Error', 'Failed to load cart.');
      }
    };

    fetchCart();
  }, []);

  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handlePlaceOrder = () => {
    if (!name || !address || !phone) {
      Alert.alert('Missing Information', 'Please fill out all fields.');
      return;
    }

    Alert.alert('Order Placed', 'Thank you for your order!');

    AsyncStorage.removeItem('cart');
    setCart([]);

    navigation.navigate('Cart');
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
        <Text style={styles.itemDetails}>Price: ₹{item.price * item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checkout</Text>
      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={item => item.id.toString()}
        style={styles.cartList}
      />
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Total Quantity: {calculateTotalQuantity()}</Text>
        <Text style={styles.summaryText}>Total Amount: ₹{calculateTotalAmount()}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
        <Text style={styles.placeOrderButtonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
  },
  cartList: {
    marginBottom: 20,
  },
  summary: {
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  placeOrderButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: width * 0.9,
    alignSelf: 'center',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Checkout;

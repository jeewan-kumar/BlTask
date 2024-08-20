
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Alert, Dimensions, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        setCart(storedCart ? JSON.parse(storedCart) : []);
      } catch (error) {
        Alert.alert('Error', 'Failed to load cart.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateItemQuantity = async (id, change) => {
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return { ...item, quantity: Math.max(newQuantity, 1) };
      }
      return item;
    });
    setCart(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItemFromCart = async (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Cart is empty', 'Please add items to your cart before checking out.');
      return;
    }
    navigation.navigate('Checkout');
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDetails}>Price: ₹{item.price}</Text>
        <Text style={styles.itemDetails}>Total: ₹{item.price * item.quantity}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <View style={styles.quantityButton}>
        <TouchableOpacity
          onPress={() => updateItemQuantity(item.id, -1)}
          accessible={true}
          accessibilityLabel={`Decrease quantity of ${item.title}`}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => updateItemQuantity(item.id, 1)}
          accessible={true}
          accessibilityLabel={`Increase quantity of ${item.title}`}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
        </View>

        <View style={styles.removeButton} >
        <TouchableOpacity           
          onPress={() => removeItemFromCart(item.id)}
          accessible={true}
          accessibilityLabel={`Remove ${item.title} from cart`}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
        </View>       
       
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4caf50" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      {cart.length > 0 ? (
        <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
          <View style={styles.summary}>
            <Text style={styles.summaryText}>Total Quantity: {calculateTotalQuantity()}</Text>
            <Text style={styles.summaryText}>Total Amount: ₹{calculateTotalAmount()}</Text>
          </View>
        </>
      ) : (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      )}
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Checkout</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDetails: {
    fontSize: 15,
    color: '#666',
    marginVertical: 2,
  },
  quantityButton: {
    backgroundColor: '#4caf50',
    flexDirection: 'row',
    padding: 5,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  removeButton: {
    marginTop:10,
    backgroundColor: '#ff5722',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: width * 0.9,
    alignSelf: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginTop: 20,
  },
  summary: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    marginTop: 10,
  },
});

export default Cart;

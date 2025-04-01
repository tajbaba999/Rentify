import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { fetchProducts } from "@/api/api";
import { ProductsPageProps } from "@/navigation/ProductsStack";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../firebaseConfig";

interface Product {
  id: string;
  product_name: string;
  product_category: string;
  product_description: string;
  product_price: number;
  product_stock: number;
  product_image?: string;
}


const Products = ({ navigation }: ProductsPageProps) => {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // const navigation = useNavigation();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        if (Array.isArray(data)) {
          const formattedData = data.map((item: any) => ({
            id: item.id || item._id, // Handle MongoDB's `_id`
            product_name: item.product_name,
            product_category: item.product_category,
            product_description: item.product_description,
            product_price: item.product_price,
            product_stock: item.product_stock,
            product_image: item.product_image || "https://via.placeholder.com/150", // Fallback image
          }));
          setProducts(formattedData);
        } else {
          console.error("Invalid product data received:", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigation.navigate("Login");
      }
    });
    return unsubscribe;
  }, [navigation]);

  const renderProductItem = ({ item } : { item : Product}) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.navigate("ProductDetails", { id: item.id })}
    >
      <Image style={styles.productImage} source={{ uri: item.product_image }} />
      <Text style={styles.productName}>{item.product_name}</Text>
      <Text style={styles.productPrice}>${item.product_price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1FE687" />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item?.id?.toString() ?? Math.random().toString()}
          numColumns={2}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  productItem: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  productName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
  },
  productPrice: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Products;

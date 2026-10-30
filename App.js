import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  StatusBar,
  Pressable,
  Image,
} from "react-native";

const products = [
  {
    id: 1,
    name: "Wireless Headphone",
    price: "$99.99",
    emoji: "🎧",
    color: "#E9E2FF",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Everyday Backpack",
    price: "$39.99",
    emoji: "🎒",
    color: "#DDF3E4",
    category: "Accessories",
  },
  {
    id: 3,
    name: "Classic Sneakers",
    price: "$49.99",
    emoji: "👟",
    color: "#FFE3E8",
    category: "Shoes",
  },
  {
    id: 4,
    name: "Smart Watch",
    price: "$79.99",
    emoji: "⌚",
    color: "#FFF0D5",
    category: "Electronics",
  },
];

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase()),
  );
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    async function ambilProduk() {
      try {
        const response = await fetch("https://dummyjson.com/products");

        if (!response.ok) {
          throw new Error("Gagal mengambil data produk");
        }

        const data = await response.json();
        setProducts(data.products);
        console.log(data.products[0]);
      } catch (err) {
        setError("Produk gagal dimuat. Periksa koneksi internet.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    ambilProduk();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF9F3" />

      {selectedProduct && (
        <View style={styles.detailContainer}>
          <Pressable onPress={() => setSelectedProduct(null)}>
            <Text style={styles.backButton}>‹ Kembali ke katalog</Text>
          </Pressable>

          <Image
            source={{ uri: selectedProduct.thumbnail }}
            style={styles.detailImage}
            resizeMode="contain"
          />

          <Text style={styles.detailCategory}>{selectedProduct.category}</Text>

          <Text style={styles.detailTitle}>{selectedProduct.title}</Text>

          <Text style={styles.detailPrice}>
            ${selectedProduct.price.toFixed(2)}
          </Text>

          <Text style={styles.detailDescription}>
            {selectedProduct.description}
          </Text>
        </View>
      )}

      {!selectedProduct && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {loading && (
            <Text style={{ textAlign: "center", margin: 20 }}>
              Memuat produk...
            </Text>
          )}

          {error !== "" && (
            <Text style={{ textAlign: "center", margin: 20 }}>{error}</Text>
          )}
          <View style={styles.header}>
            <Text style={styles.logo}>pastel.market ✿</Text>
            <Text style={styles.greeting}>Hello, shopper! 👋</Text>
            <Text style={styles.heading}>
              Find your little{"\n"}happy things.
            </Text>
            <Text style={styles.subtitle}>Lovely finds, lovely prices.</Text>
          </View>

          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search your favorite items..."
              placeholderTextColor="#A39A9A"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Our collection</Text>
              <Text style={styles.sectionSubtitle}>
                Little things, big joy ♡
              </Text>
            </View>
            <Text style={styles.productCount}>{products.length} items</Text>
          </View>

          <View style={styles.productGrid}>
            {filteredProducts.map((product) => (
              <Pressable
                key={product.id}
                style={styles.productCard}
                onPress={() => setSelectedProduct(product)}
              >
                <View
                  style={[styles.productImage, { backgroundColor: "#F0E9FA" }]}
                >
                  <Image
                    source={{ uri: product.thumbnail }}
                    style={styles.productPhoto}
                    resizeMode="contain"
                  />

                  <View style={styles.heart}>
                    <Text style={styles.heartText}>♡</Text>
                  </View>
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.category}>{product.category}</Text>
                  <Text style={styles.producttitle}>{product.title}</Text>
                  <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Made with love & pastel colors ♡
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  detailContainer: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 30,
    backgroundColor: "#FFF9F3",
  },
  backButton: {
    fontSize: 15,
    color: "#8D78B8",
    fontWeight: "700",
    marginBottom: 20,
  },
  detailImage: {
    width: "100%",
    height: 260,
    backgroundColor: "#F0E9FA",
    borderRadius: 20,
    marginBottom: 20,
  },
  detailCategory: {
    fontSize: 13,
    color: "#9B86BD",
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#493D4B",
    marginBottom: 10,
  },
  detailPrice: {
    fontSize: 21,
    fontWeight: "800",
    color: "#7D699F",
    marginBottom: 18,
  },
  detailDescription: {
    fontSize: 15,
    lineHeight: 23,
    color: "#74666F",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF9F3",
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 20,
  },
  logo: {
    fontSize: 18,
    fontWeight: "800",
    color: "#8D78B8",
    marginBottom: 28,
  },
  greeting: {
    fontSize: 14,
    color: "#9A8585",
    marginBottom: 8,
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 39,
    color: "#493D4B",
  },
  subtitle: {
    fontSize: 14,
    color: "#94868D",
    marginTop: 8,
  },
  searchBox: {
    marginHorizontal: 22,
    marginBottom: 28,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1E7E5",
  },
  searchIcon: {
    fontSize: 26,
    color: "#9B86BD",
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#493D4B",
  },
  sectionHeader: {
    marginHorizontal: 22,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#493D4B",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#A09298",
    marginTop: 5,
  },
  productCount: {
    fontSize: 11,
    color: "#8D78B8",
    backgroundColor: "#EDE7FA",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 12,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 22,
  },
  productCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    padding: 9,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F4EBE8",
  },
  productImage: {
    height: 135,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  productPhoto: {
    width: "85%",
    height: "85%",
  },
  productEmoji: {
    fontSize: 57,
  },
  heart: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 28,
    height: 28,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  heartText: {
    fontSize: 19,
    color: "#D78FAD",
  },
  productInfo: {
    paddingHorizontal: 5,
    paddingTop: 12,
    paddingBottom: 8,
  },
  category: {
    fontSize: 10,
    color: "#9B86BD",
    marginBottom: 5,
  },
  productName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#493D4B",
    minHeight: 34,
  },
  price: {
    fontSize: 15,
    fontWeight: "800",
    color: "#7D699F",
    marginTop: 7,
  },
  footer: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 28,
  },
  footerText: {
    fontSize: 12,
    color: "#B09DA5",
  },
});

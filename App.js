
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
  Alert,
  ActivityIndicator,
} from "react-native";

const API_URL = "http://192.168.1.13:8085";

const initialForm = {
  title: "",
  description: "",
  category: "",
  price: "",
  brand: "",
  stock: "",
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formVisible, setFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(initialForm);

  // READ: Mengambil produk dari API PHP dan MySQL
  async function ambilProduk() {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/products?limit=500`
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data produk");
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      setError("Produk gagal dimuat. Periksa koneksi.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    ambilProduk();
  }, []);

  const filteredProducts = products.filter((product) =>
    (product.title || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Membuka form tambah produk
  function bukaFormTambah() {
    setEditingProduct(null);
    setForm(initialForm);
    setFormVisible(true);
  }

  // Membuka form edit produk
  function bukaFormEdit(product) {
    setEditingProduct(product);

    setForm({
      title: product.title || "",
      description: product.description || "",
      category: product.category || "",
      price: String(product.price ?? ""),
      brand: product.brand || "",
      stock: String(product.stock ?? ""),
    });

    setSelectedProduct(null);
    setFormVisible(true);
  }

  // CREATE dan UPDATE
  async function simpanProduk() {
    if (!form.title.trim()) {
      Alert.alert("Peringatan", "Nama produk wajib diisi.");
      return;
    }

    if (
      form.price.trim() === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      Alert.alert("Peringatan", "Masukkan harga yang valid.");
      return;
    }

    if (
      form.stock.trim() !== "" &&
      (!Number.isInteger(Number(form.stock)) ||
        Number(form.stock) < 0)
    ) {
      Alert.alert("Peringatan", "Stok harus berupa bilangan bulat.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      brand: form.brand.trim(),
      stock: Number(form.stock || 0),
      thumbnail: editingProduct?.thumbnail || "",
    };

    try {
      setSaving(true);

      const url = editingProduct
        ? `${API_URL}/products/${editingProduct.id}`
        : `${API_URL}/products/add`;

      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Gagal menyimpan produk");
      }

      Alert.alert(
        "Berhasil",
        editingProduct
          ? "Produk berhasil diperbarui."
          : "Produk berhasil ditambahkan."
      );

      setFormVisible(false);
      setEditingProduct(null);
      setForm(initialForm);

      await ambilProduk();
    } catch (err) {
      Alert.alert("Gagal", err.message);
      console.log(err);
    } finally {
      setSaving(false);
    }
  }

  // DELETE
  function hapusProduk(product) {
    Alert.alert(
      "Hapus Produk",
      `Yakin ingin menghapus ${product.title}?`,
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_URL}/products/${product.id}`,
                {
                  method: "DELETE",
                }
              );

              if (!response.ok) {
                throw new Error("Gagal menghapus produk");
              }

              setSelectedProduct(null);
              Alert.alert("Berhasil", "Produk berhasil dihapus.");
              await ambilProduk();
            } catch (err) {
              Alert.alert("Gagal", err.message);
              console.log(err);
            }
          },
        },
      ]
    );
  }

  function ubahForm(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF9F3" />

      {/* FORM TAMBAH DAN EDIT */}
      {formVisible ? (
        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={() => setFormVisible(false)}
          >
            <Text style={styles.backButton}>‹ Kembali ke katalog</Text>
          </Pressable>

          <Text style={styles.formTitle}>
            {editingProduct ? "Edit Produk" : "Tambah Produk"}
          </Text>

          <Text style={styles.formSubtitle}>
            Lengkapi informasi produk kamu ♡
          </Text>

          <Text style={styles.inputLabel}>Nama Produk *</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Contoh: Wireless Headphone"
            value={form.title}
            onChangeText={(value) => ubahForm("title", value)}
          />

          <Text style={styles.inputLabel}>Deskripsi</Text>
          <TextInput
            style={[styles.formInput, styles.textArea]}
            placeholder="Deskripsi produk..."
            multiline
            value={form.description}
            onChangeText={(value) =>
              ubahForm("description", value)
            }
          />

          <Text style={styles.inputLabel}>Kategori</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Contoh: Electronics"
            value={form.category}
            onChangeText={(value) =>
              ubahForm("category", value)
            }
          />

          <Text style={styles.inputLabel}>Harga *</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Contoh: 99.99"
            keyboardType="decimal-pad"
            value={form.price}
            onChangeText={(value) =>
              ubahForm("price", value)
            }
          />

          <Text style={styles.inputLabel}>Merek</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Nama merek"
            value={form.brand}
            onChangeText={(value) =>
              ubahForm("brand", value)
            }
          />

          <Text style={styles.inputLabel}>Stok</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Contoh: 20"
            keyboardType="numeric"
            value={form.stock}
            onChangeText={(value) =>
              ubahForm("stock", value)
            }
          />

          <Pressable
            style={styles.saveButton}
            onPress={simpanProduk}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>
                {editingProduct ? "Simpan Perubahan" : "Tambah Produk"}
              </Text>
            )}
          </Pressable>
        </ScrollView>
      ) : selectedProduct ? (
        /* DETAIL PRODUK */
        <ScrollView style={styles.detailContainer}>
          <Pressable
            onPress={() => setSelectedProduct(null)}
          >
            <Text style={styles.backButton}>
              ‹ Kembali ke katalog
            </Text>
          </Pressable>

          <Image
            source={{ uri: selectedProduct.thumbnail }}
            style={styles.detailImage}
            resizeMode="contain"
          />

          <Text style={styles.detailCategory}>
            {selectedProduct.category}
          </Text>

          <Text style={styles.detailTitle}>
            {selectedProduct.title}
          </Text>

          <Text style={styles.detailPrice}>
            ${Number(selectedProduct.price || 0).toFixed(2)}
          </Text>

          <Text style={styles.detailDescription}>
            {selectedProduct.description}
          </Text>

          <Text style={styles.detailExtra}>
            Merek: {selectedProduct.brand || "-"}
          </Text>

          <Text style={styles.detailExtra}>
            Stok: {selectedProduct.stock ?? 0}
          </Text>

          <View style={styles.actionRow}>
            <Pressable
              style={styles.editButton}
              onPress={() => bukaFormEdit(selectedProduct)}
            >
              <Text style={styles.actionText}>Edit Produk</Text>
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={() => hapusProduk(selectedProduct)}
            >
              <Text style={styles.actionText}>Hapus</Text>
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        /* HALAMAN KATALOG */
        <ScrollView showsVerticalScrollIndicator={false}>
          {loading && (
            <ActivityIndicator
              size="large"
              color="#8D78B8"
              style={{ margin: 20 }}
            />
          )}

          {error !== "" && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <View style={styles.header}>
            <Text style={styles.logo}>pastel.market ✿</Text>
            <Text style={styles.greeting}>Hello, shopper! 👋</Text>

            <Text style={styles.heading}>
              Find your little{"\n"}happy things.
            </Text>

            <Text style={styles.subtitle}>
              Lovely finds, lovely prices.
            </Text>
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
              <Text style={styles.sectionTitle}>
                Our collection
              </Text>

              <Text style={styles.sectionSubtitle}>
                Little things, big joy ♡
              </Text>
            </View>

            <Text style={styles.productCount}>
              {products.length} items
            </Text>
          </View>

          <Pressable
            style={styles.addButton}
            onPress={bukaFormTambah}
          >
            <Text style={styles.addButtonText}>
              + Tambah Produk
            </Text>
          </Pressable>

          <View style={styles.productGrid}>
            {filteredProducts.map((product) => (
              <Pressable
                key={product.id}
                style={styles.productCard}
                onPress={() => setSelectedProduct(product)}
              >
                <View style={styles.productImage}>
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
                  <Text style={styles.category}>
                    {product.category}
                  </Text>

                  <Text style={styles.productName}>
                    {product.title}
                  </Text>

                  <Text style={styles.price}>
                    ${Number(product.price || 0).toFixed(2)}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {!loading && filteredProducts.length === 0 && (
            <Text style={styles.emptyText}>
              Produk tidak ditemukan.
            </Text>
          )}

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
  addButton: {
    backgroundColor: "#8D78B8",
    marginHorizontal: 22,
    marginBottom: 20,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
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
    backgroundColor: "#F0E9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  productPhoto: {
    width: "85%",
    height: "85%",
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
    marginBottom: 15,
  },
  detailExtra: {
    fontSize: 14,
    color: "#74666F",
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 25,
    marginBottom: 35,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#8D78B8",
    padding: 15,
    borderRadius: 13,
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#D98291",
    padding: 15,
    borderRadius: 13,
    alignItems: "center",
  },
  actionText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 25,
  },
  formTitle: {
    fontSize: 27,
    fontWeight: "800",
    color: "#493D4B",
  },
  formSubtitle: {
    color: "#94868D",
    marginTop: 7,
    marginBottom: 22,
  },
  inputLabel: {
    color: "#493D4B",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 12,
  },
  formInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#F1E7E5",
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: "#493D4B",
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#8D78B8",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 40,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  errorText: {
    textAlign: "center",
    color: "#D45C6A",
    margin: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#94868D",
    margin: 25,
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

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const favs = await AsyncStorage.getItem("favorites");
      setFavorites(favs ? JSON.parse(favs) : []);
    };
    loadFavorites();
  }, []);

  const removeFavorite = async (id) => {
    const newFavorites = favorites.filter((item) => item.imdbID !== id);
    setFavorites(newFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Favoritos</Text>
      {favorites.length === 0 ? (
        <Text style={styles.empty}>Nenhum filme favoritado ainda 😢</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.imdbID}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.Poster }} style={styles.poster} />
              <View style={styles.info}>
                <Text style={styles.movieTitle}>{item.Title}</Text>
                <Text style={styles.year}>{item.Year}</Text>
              </View>
              <TouchableOpacity
                onPress={() => removeFavorite(item.imdbID)}
                style={styles.iconBtn}
              >
                <Ionicons name="trash" size={28} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a2e", padding: 10 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  empty: { color: "#aaa", textAlign: "center", marginTop: 50 },
  card: {
    flexDirection: "row",
    backgroundColor: "#2d2d44",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
    alignItems: "center",
  },
  poster: { width: 100, height: 150 },
  info: { flex: 1, padding: 10 },
  movieTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  year: { color: "#aaa", marginTop: 4 },
  iconBtn: {
    padding: 10,
  },
});

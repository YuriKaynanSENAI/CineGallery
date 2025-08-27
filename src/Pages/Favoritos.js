import React, { useEffect, useState } from "react";
// Importa React e hooks: useState para criar estado, useEffect para efeitos colaterais

import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
// Importa componentes do React Native para interface, lista, imagens e botões

import AsyncStorage from "@react-native-async-storage/async-storage";
// Importa AsyncStorage para salvar e recuperar dados localmente

export default function Favorites() {
  // Componente funcional Favorites

  const [favorites, setFavorites] = useState([]);
  // Estado que armazena a lista de filmes favoritos

  useEffect(() => {
    const loadFavorites = async () => {
      const favs = await AsyncStorage.getItem("favorites");
      setFavorites(favs ? JSON.parse(favs) : []);
      // Ao montar o componente, carrega favoritos do AsyncStorage
      // Se não houver, inicia como array vazio
    };
    loadFavorites();
  }, []);
  // useEffect vazio garante que o carregamento acontece apenas uma vez

  const removeFavorite = async (id) => {
    const newFavorites = favorites.filter((item) => item.imdbID !== id);
    setFavorites(newFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
    // Remove um filme do array e atualiza o AsyncStorage
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⭐ Meus Favoritos</Text>
      {/* Título da tela */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.imdbID}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.Poster }} style={styles.poster} />
            {/* Mostra poster do filme */}
            <View style={styles.info}>
              <Text style={styles.movieTitle}>{item.Title}</Text>
              {/* Título do filme */}
              <TouchableOpacity onPress={() => removeFavorite(item.imdbID)}>
                <Text style={styles.remove}>Remover</Text>
                {/* Botão para remover dos favoritos */}
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
  card: {
    flexDirection: "row",
    backgroundColor: "#2d2d44",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
  poster: { width: 100, height: 150 },
  info: { flex: 1, padding: 10 },
  movieTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  remove: { color: "#e74c3c", marginTop: 5 },
});

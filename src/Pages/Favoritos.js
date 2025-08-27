// Importando React e o hook useState para controlar estado interno do componente
import React, { useState } from "react";

// Importando componentes básicos do React Native
import {
  View, // container básico para estruturar layouts
  Text, // exibir textos
  FlatList, // lista performática para exibir filmes
  Image, // carregar e exibir imagens (pôster dos filmes)
  TouchableOpacity, // botão clicável (no caso, usado para "Remover")
  StyleSheet, // criar estilos CSS-in-JS
} from "react-native";

// Importando AsyncStorage para salvar/buscar/remover favoritos localmente
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importando useFocusEffect (executa uma função sempre que a tela entra em foco)
import { useFocusEffect } from "@react-navigation/native";

// Componente principal da tela de favoritos
export default function Favorites() {
  // Hook de estado para armazenar a lista de filmes favoritos
  const [favorites, setFavorites] = useState([]);

  // Sempre que a tela "Favorites" for aberta ou voltar ao foco,
  // recarregar os favoritos do AsyncStorage
  useFocusEffect(
    React.useCallback(() => {
      const loadFavorites = async () => {
        // Buscar do AsyncStorage a chave "favorites"
        const favs = await AsyncStorage.getItem("favorites");

        // Se existir algo, transforma de JSON em array e salva no estado
        // Se não existir, salva um array vazio
        setFavorites(favs ? JSON.parse(favs) : []);
      };

      // Executa a função de carregar favoritos
      loadFavorites();
    }, []) // [] significa que o efeito não depende de nada além do foco da tela
  );

  // Função para remover um filme da lista de favoritos
  const removeFavorite = async (id) => {
    // Cria uma nova lista sem o item cujo imdbID seja igual ao clicado
    const newFavorites = favorites.filter((item) => item.imdbID !== id);

    // Atualiza o estado local com a nova lista
    setFavorites(newFavorites);

    // Salva a lista atualizada no AsyncStorage
    await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  // JSX (UI) que será renderizado na tela
  return (
    <View style={styles.container}>
      {/* Título da tela */}
      <Text style={styles.title}>⭐ Meus Favoritos</Text>

      {/* FlatList exibe a lista de filmes favoritos */}
      <FlatList
        data={favorites} // Fonte de dados
        keyExtractor={(item) => item.imdbID} // Cada item é identificado pelo imdbID
        renderItem={(
          { item } // Renderização de cada filme
        ) => (
          <View style={styles.card}>
            {/* Pôster do filme */}
            <Image source={{ uri: item.Poster }} style={styles.poster} />

            {/* Área com informações e botão remover */}
            <View style={styles.info}>
              <Text style={styles.movieTitle}>{item.Title}</Text>

              {/* Botão para remover dos favoritos */}
              <TouchableOpacity onPress={() => removeFavorite(item.imdbID)}>
                <Text style={styles.remove}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// Estilos da tela
const styles = StyleSheet.create({
  // Container principal da tela
  container: { flex: 1, backgroundColor: "#1a1a2e", padding: 10 },

  // Estilo do título
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },

  // Card de cada filme
  card: {
    flexDirection: "row", // Alinha pôster e informações lado a lado
    backgroundColor: "#2d2d44",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden", // Garante que a borda arredondada "corta" a imagem
  },

  // Pôster do filme
  poster: { width: 100, height: 150 },

  // Área de informações do filme
  info: { flex: 1, padding: 10 },

  // Título do filme
  movieTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  // Botão de remover
  remove: { color: "#e74c3c", marginTop: 5 },
});

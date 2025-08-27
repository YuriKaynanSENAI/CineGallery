import React, { useEffect, useState } from "react";
// Importa React e hooks: useState para criar estados, useEffect para efeitos colaterais

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
// Importa componentes do React Native para interface, lista, imagens e indicador de carregamento

import axios from "axios";
// Importa axios para fazer requisições HTTP à API

const API_KEY = "882fa1a2";
// Chave da API OMDB (para buscar filmes)

const POSTER_FALLBACK = "https://via.placeholder.com/300x450?text=No+Image";
// URL de imagem padrão caso o filme não tenha poster

export default function Gallery() {
  // Componente funcional Gallery

  const [query, setQuery] = useState("Jujutsu");
  // Estado para armazenar o termo de busca inicial
  const [movies, setMovies] = useState([]);
  // Estado que armazena a lista de filmes buscados
  const [loading, setLoading] = useState(true);
  // Estado para controlar carregamento
  const [err, setErr] = useState("");
  // Estado para mensagens de erro

  const fetchMovies = async (q) => {
    // Função que busca filmes na API
    setLoading(true);
    setErr("");
    // Ativa carregamento e limpa erros
    try {
      const urls = [
        `https://www.omdbapi.com/?s=${encodeURIComponent(
          q
        )}&type=movie&page=1&apikey=${API_KEY}`,
        `https://www.omdbapi.com/?s=${encodeURIComponent(
          q
        )}&type=movie&page=2&apikey=${API_KEY}`,
      ];
      // Cria URLs para página 1 e 2 da API
      const [r1, r2] = await Promise.all(urls.map((u) => axios.get(u)));
      // Faz requisições simultâneas para as duas páginas
      const list1 = r1.data.Search || [];
      const list2 = r2.data.Search || [];
      // Extrai os arrays de filmes ou vazio se não houver
      const merged = [...list1, ...list2]
        .filter((m) => m && m.imdbID)
        // Remove entradas inválidas
        .reduce(
          (acc, item) =>
            acc.some((x) => x.imdbID === item.imdbID) ? acc : acc.concat(item),
          []
        );
      // Remove duplicatas baseado no imdbID
      setMovies(merged.slice(0, 20));
      // Salva no estado apenas os 20 primeiros filmes
    } catch (e) {
      setErr("Falha ao carregar filmes. Tente novamente.");
      // Se der erro, salva mensagem de erro
    } finally {
      setLoading(false);
      // Desativa carregamento
    }
  };

  useEffect(() => {
    fetchMovies(query);
    // Ao montar o componente, faz a busca inicial
  }, []);

  const onSearch = () => {
    if (query.trim()) fetchMovies(query.trim());
    // Função chamada ao apertar o botão de busca
  };

  const numColumns = 3;
  const spacing = 8;
  const { width } = Dimensions.get("window");
  const itemW = (width - (numColumns + 1) * spacing) / numColumns;
  // Calcula largura de cada card baseado na tela e quantidade de colunas

  const renderItem = ({ item }) => (
    // Função que renderiza cada item da lista
    <View style={[styles.card, { width: itemW }]}>
      <Image
        source={{
          uri:
            item.Poster && item.Poster !== "N/A"
              ? item.Poster
              : POSTER_FALLBACK,
        }}
        style={styles.poster}
      />
      {/* Mostra poster do filme ou fallback */}
      <Text numberOfLines={2} style={styles.caption}>
        {item.Title}
      </Text>
      {/* Título do filme */}
      <Text style={styles.year}>{item.Year}</Text>
      {/* Ano do filme */}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Buscar (ex: marvel, batman, star)..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={onSearch}>
          <Text style={styles.searchBtnText}>Buscar</Text>
        </TouchableOpacity>
      </View>
      {/* Barra de busca */}

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : err ? (
        <View style={{ padding: 16 }}>
          <Text style={{ color: "#fff", textAlign: "center" }}>{err}</Text>
          <TouchableOpacity
            style={[styles.searchBtn, { alignSelf: "center", marginTop: 12 }]}
            onPress={onSearch}
          >
            <Text style={styles.searchBtnText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.imdbID}
          renderItem={renderItem}
          numColumns={numColumns}
          columnWrapperStyle={{ gap: spacing, marginBottom: spacing }}
          contentContainerStyle={{ padding: spacing }}
        />
      )}
      {/* Mostra indicador de carregamento, erro ou lista de filmes */}
    </View>
  );
}

const PRIMARY = "#6C3BF4";
// Cor principal dos botões

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E0E10" },
  searchRow: { flexDirection: "row", padding: 12, gap: 8 },
  input: {
    flex: 1,
    backgroundColor: "#1a1a1e",
    color: "#fff",
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 44,
    borderWidth: 1,
    borderColor: "#2a2a30",
  },
  searchBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 10,
  },
  searchBtnText: { color: "#fff", fontWeight: "700" },
  card: { backgroundColor: "#121217", borderRadius: 12, overflow: "hidden" },
  poster: { width: "100%", aspectRatio: 2 / 3 },
  caption: { color: "#fff", fontSize: 12, paddingHorizontal: 8, paddingTop: 6 },
  year: { color: "#aaa", fontSize: 11, paddingHorizontal: 8, paddingBottom: 8 },
});

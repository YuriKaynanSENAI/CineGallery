import React, { useEffect, useState } from "react";
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
import axios from "axios";

const API_KEY = "882fa1a2";
const POSTER_FALLBACK = "https://via.placeholder.com/300x450?text=No+Image";

export default function Gallery() {
  const [query, setQuery] = useState(""); // barra de pesquisa começa vazia
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Filmes recomendados
  const recommendedQueries = ["batman", "jujutsu", "spiderman"];

  const fetchMovies = async (q) => {
    setLoading(true);
    setErr("");
    try {
      const urls = [
        `https://www.omdbapi.com/?s=${encodeURIComponent(
          q
        )}&type=movie&page=1&apikey=${API_KEY}`,
        `https://www.omdbapi.com/?s=${encodeURIComponent(
          q
        )}&type=movie&page=2&apikey=${API_KEY}`,
      ];
      const [r1, r2] = await Promise.all(urls.map((u) => axios.get(u)));
      const list1 = r1.data.Search || [];
      const list2 = r2.data.Search || [];
      const merged = [...list1, ...list2]
        .filter((m) => m && m.imdbID)
        .reduce(
          (acc, item) =>
            acc.some((x) => x.imdbID === item.imdbID) ? acc : acc.concat(item),
          []
        );
      setMovies(merged.slice(0, 20));
    } catch (e) {
      setErr("Falha ao carregar filmes. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Ao abrir a tela, busca os filmes recomendados
  useEffect(() => {
    const fetchRecommended = async () => {
      setLoading(true);
      let results = [];
      for (let q of recommendedQueries) {
        try {
          const res = await axios.get(
            `https://www.omdbapi.com/?s=${q}&type=movie&page=1&apikey=${API_KEY}`
          );
          results = results.concat(res.data.Search || []);
        } catch (e) {
          // ignora erro de uma query
        }
      }
      // Remove duplicados
      const unique = results.filter(
        (v, i, a) => a.findIndex((x) => x.imdbID === v.imdbID) === i
      );
      setMovies(unique.slice(0, 20));
      setLoading(false);
    };
    fetchRecommended();
  }, []);

  const onSearch = () => {
    if (query.trim()) fetchMovies(query.trim());
  };

  const numColumns = 3;
  const spacing = 8;
  const { width } = Dimensions.get("window");
  const itemW = (width - (numColumns + 1) * spacing) / numColumns;

  const renderItem = ({ item }) => (
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
      <Text numberOfLines={2} style={styles.caption}>
        {item.Title}
      </Text>
      <Text style={styles.year}>{item.Year}</Text>
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
    </View>
  );
}

const PRIMARY = "#6C3BF4";

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

// Importa React e hooks useEffect (efeitos colaterais) e useState (estado)
import React, { useEffect, useState } from "react";

// Importa componentes visuais do React Native
import {
  View, // contêiner básico
  Text, // exibir textos
  TextInput, // campo de busca
  TouchableOpacity, // botão clicável
  FlatList, // lista performática para exibir filmes
  Image, // exibir imagens dos pôsteres
  ActivityIndicator, // indicador de carregamento (spinner)
  StyleSheet, // estilização
  Dimensions, // pega dimensões da tela para calcular grid
} from "react-native";

// Biblioteca para chamadas HTTP
import axios from "axios";

// Para salvar/buscar/remover favoritos localmente
import AsyncStorage from "@react-native-async-storage/async-storage";

// Ícones (estrela de favoritos)
import { Ionicons } from "@expo/vector-icons";

// useFocusEffect: executa quando a tela entra em foco
import { useFocusEffect } from "@react-navigation/native";

// Chave da API do OMDB (OMDb API)
const API_KEY = "882fa1a2";

// Imagem de fallback caso não exista pôster
const POSTER_FALLBACK = "https://via.placeholder.com/300x450?text=No+Image";

// Componente principal da tela de galeria
export default function Gallery() {
  // Estado para guardar texto digitado na busca
  const [query, setQuery] = useState("");

  // Lista de filmes buscados
  const [movies, setMovies] = useState([]);

  // Controle de loading (exibir spinner enquanto carrega filmes)
  const [loading, setLoading] = useState(true);

  // Mensagem de erro (se falhar a busca)
  const [err, setErr] = useState("");

  // Guarda ids dos filmes que já estão como favoritos
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Flag usada para forçar atualização da lista de favoritos
  const [updateFav, setUpdateFav] = useState(false);

  // Lista inicial de buscas recomendadas
  const recommendedQueries = ["batman", "jujutsu", "spiderman"];

  // Função para buscar filmes da API a partir de uma query
  const fetchMovies = async (q) => {
    setLoading(true); // ativa loading
    setErr(""); // limpa erro
    try {
      // Monta duas URLs para pegar até 2 páginas de resultados
      const urls = [
        `https://www.omdbapi.com/?s=${encodeURIComponent(
          q
        )}&type=movie&page=1&apikey=${API_KEY}`,
        `https://www.omdbapi.com/?s=${encodeURIComponent(
          q
        )}&type=movie&page=2&apikey=${API_KEY}`,
      ];

      // Executa as duas requisições em paralelo
      const [r1, r2] = await Promise.all(urls.map((u) => axios.get(u)));

      // Pega listas de cada resposta
      const list1 = r1.data.Search || [];
      const list2 = r2.data.Search || [];

      // Junta os resultados, remove duplicados pelo imdbID
      const merged = [...list1, ...list2]
        .filter((m) => m && m.imdbID)
        .reduce(
          (acc, item) =>
            acc.some((x) => x.imdbID === item.imdbID) ? acc : acc.concat(item),
          []
        );

      // Limita a 20 resultados
      setMovies(merged.slice(0, 20));
    } catch (e) {
      // Se der erro na API
      setErr("Falha ao carregar filmes. Tente novamente.");
    } finally {
      // Desativa loading
      setLoading(false);
    }
  };

  // Carregar filmes recomendados ao abrir a tela (só 1x)
  useEffect(() => {
    const fetchRecommended = async () => {
      setLoading(true);
      let results = [];

      // Para cada termo recomendado, busca na API
      for (let q of recommendedQueries) {
        try {
          const res = await axios.get(
            `https://www.omdbapi.com/?s=${q}&type=movie&page=1&apikey=${API_KEY}`
          );
          results = results.concat(res.data.Search || []);
        } catch (e) {}
      }

      // Remove duplicados
      const unique = results.filter(
        (v, i, a) => a.findIndex((x) => x.imdbID === v.imdbID) === i
      );

      // Limita a 20 filmes
      setMovies(unique.slice(0, 20));
      setLoading(false);
    };

    // Executa assim que a tela for carregada
    fetchRecommended();
  }, []);

  // Sempre que a tela ganhar foco, recarrega os favoritos do AsyncStorage
  useFocusEffect(
    React.useCallback(() => {
      const loadFavorites = async () => {
        const favs = await AsyncStorage.getItem("favorites");
        const favList = favs ? JSON.parse(favs) : [];

        // Salva apenas os imdbID para fácil checagem
        setFavoriteIds(favList.map((f) => f.imdbID));
      };
      loadFavorites();
    }, [updateFav]) // depende de updateFav para atualizar sempre que mudar
  );

  // Alternar (adicionar/remover) favorito
  const toggleFavorite = async (movie) => {
    try {
      // Carrega lista atual de favoritos
      let favs = await AsyncStorage.getItem("favorites");
      favs = favs ? JSON.parse(favs) : [];

      // Se já é favorito, remove
      if (favoriteIds.includes(movie.imdbID)) {
        favs = favs.filter((f) => f.imdbID !== movie.imdbID);
      } else {
        // Se não é, adiciona
        favs.push(movie);
      }

      // Salva no AsyncStorage
      await AsyncStorage.setItem("favorites", JSON.stringify(favs));

      // Força reload dos favoritos
      setUpdateFav((prev) => !prev);
    } catch (e) {
      console.log("Erro ao atualizar favoritos", e);
    }
  };

  // Função chamada ao clicar no botão "Buscar"
  const onSearch = () => {
    if (query.trim()) fetchMovies(query.trim());
  };

  // Configurações do grid de filmes (3 colunas com espaçamento)
  const numColumns = 3;
  const spacing = 8;
  const { width } = Dimensions.get("window");
  const itemW = (width - (numColumns + 1) * spacing) / numColumns;

  // Renderização de cada item do FlatList
  const renderItem = ({ item }) => (
    <View style={[styles.card, { width: itemW }]}>
      {/* Pôster do filme */}
      <Image
        source={{
          uri:
            item.Poster && item.Poster !== "N/A"
              ? item.Poster
              : POSTER_FALLBACK, // fallback se não tiver imagem
        }}
        style={styles.poster}
      />

      {/* Botão para adicionar/remover favorito */}
      <TouchableOpacity
        style={styles.favoriteBtn}
        onPress={() => toggleFavorite(item)}
      >
        {/* Ícone estrela (preenchida se for favorito) */}
        <Ionicons
          name={favoriteIds.includes(item.imdbID) ? "star" : "star-outline"}
          size={24}
          color="#ffd700"
        />
      </TouchableOpacity>

      {/* Título do filme (2 linhas máx.) */}
      <Text numberOfLines={2} style={styles.caption}>
        {item.Title}
      </Text>

      {/* Ano do filme */}
      <Text style={styles.year}>{item.Year}</Text>
    </View>
  );

  // UI principal
  return (
    <View style={styles.container}>
      {/* Área de busca */}
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

      {/* Exibir carregando, erro ou lista */}
      {loading ? (
        // Enquanto carrega -> spinner centralizado
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : err ? (
        // Se houver erro -> mensagem e botão tentar novamente
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
        // Se tudo certo -> renderiza lista de filmes
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

// Cor primária usada em botões
const PRIMARY = "#6C3BF4";

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E0E10" },

  // Linha de busca
  searchRow: { flexDirection: "row", padding: 12, gap: 8 },

  // Campo de input
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

  // Botão de buscar
  searchBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 10,
  },
  searchBtnText: { color: "#fff", fontWeight: "700" },

  // Card de cada filme
  card: { backgroundColor: "#121217", borderRadius: 12, overflow: "hidden" },

  // Pôster com proporção 2:3
  poster: { width: "100%", aspectRatio: 2 / 3 },

  // Texto do título
  caption: { color: "#fff", fontSize: 12, paddingHorizontal: 8, paddingTop: 6 },

  // Ano do filme
  year: { color: "#aaa", fontSize: 11, paddingHorizontal: 8, paddingBottom: 8 },

  // Botão estrela de favorito
  favoriteBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 4,
    borderRadius: 12,
  },
});

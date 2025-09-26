// src/Pages/Gallery.js
// Tela que busca filmes da API (OMDb) e permite favoritar/desfavoritar.

import React, { useEffect, useState } from "react";
// Importa React e hooks (estado e efeito)

import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
// Importa componentes do RN:
// View, FlatList, StyleSheet, ActivityIndicator (spinner), TouchableOpacity

import TextComp from "../components/TextComp";
// Texto padronizado

import MovieCard from "../components/MovieCard";
// Card de filme reutilizável

import {
  addFavorite,
  removeFavoriteById,
  isFavorite,
} from "../components/AsyncStorage";
// Importa helpers de favoritos: adicionar, remover e checar se é favorito

// URL da API pública (exemplo) — faz busca por "batman" com chave pública
const API_URL = "https://www.omdbapi.com/?apikey=thewdb&s=batman";

const Gallery = () => {
  // Componente funcional da galeria de filmes
  const [movies, setMovies] = useState([]);
  // Estado que armazena os filmes buscados
  const [loading, setLoading] = useState(true);
  // Estado que controla o indicador de carregamento
  const [favIds, setFavIds] = useState([]);
  // Estado que guarda os imdbIDs que estão favoritados (array de strings)

  const fetchMovies = async () => {
    // Função que realiza a requisição para buscar filmes
    try {
      setLoading(true);
      // Marca como carregando enquanto busca os dados
      const res = await fetch(API_URL);
      // Faz a chamada HTTP para a API
      const data = await res.json();
      // Converte a resposta para JSON
      if (data && data.Search) {
        setMovies(data.Search);
        // Se houver resultados, atualiza o estado movies
      }
    } catch (e) {
      // Em caso de erro, registra no console
      console.error("Erro ao buscar filmes:", e);
    } finally {
      setLoading(false);
      // Remove o estado de carregamento, garanta que spinner pare
    }
  };

  const toggleFavorite = async (movie) => {
    // Alterna o status de favorito de um filme (adiciona ou remove)
    const isFav = await isFavorite(movie.imdbID);
    // Consulta se já é favorito (lê do storage)
    if (isFav) {
      await removeFavoriteById(movie.imdbID);
      // Se já era, remove do storage
      setFavIds((prev) => prev.filter((id) => id !== movie.imdbID));
      // Atualiza estado local removendo o id
    } else {
      await addFavorite(movie);
      // Se não era favorito, adiciona ao storage
      setFavIds((prev) => [...prev, movie.imdbID]);
      // Atualiza estado local adicionando o id
    }
  };

  const checkFavorites = async (list) => {
    // Verifica, para uma lista de filmes, quais já estão favoritados
    const favStatus = [];
    // Array temporário para armazenar ids favoritados
    for (const movie of list) {
      if (await isFavorite(movie.imdbID)) {
        favStatus.push(movie.imdbID);
        // Se o helper disser que é favorito, adiciona o id
      }
    }
    setFavIds(favStatus);
    // Atualiza o estado com os ids que são favoritos
  };

  useEffect(() => {
    // Ao montar a tela, busca os filmes da API
    fetchMovies();
  }, []);

  useEffect(() => {
    // Quando a lista de filmes muda, checa quais são favoritos
    if (movies.length > 0) {
      checkFavorites(movies);
    }
  }, [movies]);

  if (loading) {
    // Enquanto estiver carregando, retorna uma tela centralizada com spinner
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <TextComp variant="body">Carregando filmes...</TextComp>
      </View>
    );
  }

  return (
    // JSX principal da tela quando não está carregando
    <View style={styles.container}>
      <TextComp variant="title" style={styles.title}>
        Galeria de Filmes
      </TextComp>
      <FlatList
        data={movies} // dados vindos da API
        keyExtractor={(item) => item.imdbID} // chave única por item
        renderItem={({ item }) => {
          // Para cada filme, decide se está favoritado e exibe MovieCard
          const isFav = favIds.includes(item.imdbID);
          return (
            <MovieCard
              movie={item}
              rightContent={
                // Botão de favoritar/desfavoritar
                <TouchableOpacity
                  style={[styles.favBtn, isFav && styles.favActive]}
                  onPress={() => toggleFavorite(item)} // alterna favorito ao pressionar
                >
                  <TextComp color="#fff">{isFav ? "★" : "☆"}</TextComp>
                </TouchableOpacity>
              }
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Estilos da galeria
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: "center",
  },
  center: {
    // Estilo usado quando está carregando (spinner)
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  favBtn: {
    // Estilo do botão de favorito (estado padrão)
    backgroundColor: "#3498db",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  favActive: {
    // Estilo aplicado quando o item está favoritado
    backgroundColor: "#f1c40f",
  },
});

export default Gallery;
// Exporta a tela como default

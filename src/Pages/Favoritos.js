// src/Pages/Favoritos.js
// Tela que lista os filmes salvos como favoritos e permite removê-los.

import React, { useEffect, useState } from "react";
// Importa React e hooks: useEffect para efeitos colaterais e useState para estado local.

import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
// Importa componentes do RN:
// View -> container básico
// FlatList -> lista performática para arrays
// StyleSheet -> utilitário para estilos
// TouchableOpacity -> botão com feedback de opacidade

import TextComp from "../components/TextComp";
// Importa componente de texto padrão (para títulos/corpo)

import MovieCard from "../components/MovieCard";
// Importa componente comum que renderiza um card de filme

import { getFavorites, removeFavoriteById } from "../components/AsyncStorage";
// Importa helpers do AsyncStorage customizado: buscar e remover favoritos

const Favoritos = () => {
  // Componente funcional da tela Favoritos
  const [favorites, setFavorites] = useState([]);
  // Estado local que guarda a lista de favoritos (inicia vazia)

  const loadFavorites = async () => {
    // Função que carrega os favoritos do armazenamento e atualiza o estado
    const favs = await getFavorites();
    // Chama o helper para obter a lista (retorna array ou [])
    setFavorites(favs);
    // Atualiza o estado com os favoritos carregados
  };

  const handleRemove = async (id) => {
    // Função chamada ao pressionar "Remover" para excluir um favorito
    await removeFavoriteById(id);
    // Remove do armazenamento pelo imdbID
    loadFavorites();
    // Recarrega a lista para refletir a alteração na UI
  };

  useEffect(() => {
    // useEffect que roda ao montar o componente (com array de dependências vazio)
    loadFavorites();
    // Carrega os favoritos uma única vez quando a tela é exibida
  }, []);

  return (
    // JSX retornado pela tela
    <View style={styles.container}>
      {/* Título da tela */}
      <TextComp variant="title">Meus Favoritos</TextComp>

      {favorites.length === 0 ? (
        // Se não houver favoritos, mostra uma mensagem vazia
        <TextComp variant="body" style={styles.empty}>
          Nenhum filme favorito ainda.
        </TextComp>
      ) : (
        // Caso contrário, renderiza a FlatList com os favoritos
        <FlatList
          data={favorites} // dados da lista
          keyExtractor={(item) => item.imdbID} // chave única por item
          renderItem={({ item }) => (
            // Para cada item, renderiza um MovieCard com um botão de remover
            <MovieCard
              movie={item}
              rightContent={
                // Botão de remover posicionado à direita do card
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemove(item.imdbID)}
                >
                  <TextComp color="#fff">Remover</TextComp>
                </TouchableOpacity>
              }
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Estilos do componente Favoritos
  container: {
    flex: 1, // ocupa toda a tela
    paddingTop: 20,
    backgroundColor: "#f5f5f5",
  },
  empty: {
    textAlign: "center", // centraliza o texto
    marginTop: 40,
  },
  removeBtn: {
    backgroundColor: "#e74c3c", // vermelho para ação de deletar
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
});

export default Favoritos;
// Exporta o componente como default

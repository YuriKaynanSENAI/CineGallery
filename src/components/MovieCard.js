// src/components/MovieCard.js
// Card de filme reutilizável para Gallery e Favoritos

import React from "react";
// Importa React para criar o componente.

import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
// View → container de layout.
// Image → exibir imagens (pôster do filme).
// StyleSheet → criar estilos otimizados.
// TouchableOpacity → botão "clicável" com efeito de opacidade.

import TextComp from "./TextComp";
// Componente de texto customizado, para manter padronização.

const MovieCard = ({
  movie, // objeto do filme (com Title, Year, Poster, imdbID)
  onPress, // ação ao clicar no card
  onLongPress, // ação ao manter pressionado
  rightContent, // conteúdo opcional à direita (ex: botão de favorito ou lixeira)
}) => {
  if (!movie) return null;
  // Se não houver filme, não renderiza nada.

  return (
    <TouchableOpacity
      style={styles.card} // aplica estilos do card
      onPress={onPress} // executa função ao clicar
      onLongPress={onLongPress} // executa função ao pressionar e segurar
      activeOpacity={0.8} // controla a opacidade do toque
    >
      <Image
        source={{ uri: movie.Poster }} // URL do pôster do filme
        style={styles.poster} // aplica estilos da imagem
        resizeMode="cover" // ajusta a imagem sem distorcer
      />
      <View style={styles.info}>
        {/* Informações do filme */}
        <TextComp variant="subtitle" style={styles.title} numberOfLines={2}>
          {/* Título do filme (máx. 2 linhas) */}
          {movie.Title}
        </TextComp>
        <TextComp variant="small" color="#777">
          {/* Ano do filme */}
          {movie.Year}
        </TextComp>
        {rightContent && <View style={styles.right}>{rightContent}</View>}
        {/* Renderiza conteúdo extra se for passado (ex: botão de favorito) */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row", // organiza imagem + texto lado a lado
    backgroundColor: "#fff", // fundo branco
    borderRadius: 10, // cantos arredondados
    marginVertical: 6, // margem entre cards (em cima/baixo)
    marginHorizontal: 10, // margem lateral
    elevation: 2, // sombra no Android
    shadowColor: "#000", // cor da sombra
    shadowOpacity: 0.1, // opacidade da sombra
    shadowRadius: 4, // "borrado" da sombra
    shadowOffset: { width: 0, height: 2 }, // posição da sombra
    overflow: "hidden", // corta conteúdo que passar da borda
  },
  poster: {
    width: 100, // largura do pôster
    height: 150, // altura do pôster
  },
  info: {
    flex: 1, // ocupa o resto do espaço
    padding: 10, // espaço interno
    justifyContent: "center", // centraliza o conteúdo verticalmente
  },
  title: {
    marginBottom: 4, // espaço abaixo do título
  },
  right: {
    position: "absolute", // posiciona de forma absoluta
    top: 10, // distância do topo
    right: 10, // distância da direita
  },
});

export default MovieCard;
// Exporta o componente para ser usado em outras telas.

import React, { useEffect, useState } from "react";
// Importa React e os hooks:
// useState -> para criar estados dentro do componente
// useEffect -> para executar efeitos colaterais, como buscar dados ao carregar

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// Importa componentes do React Native:
// View -> container de layout
// Text -> exibição de texto
// TouchableOpacity -> botão que reage ao toque
// StyleSheet -> criação de estilos

import AsyncStorage from "@react-native-async-storage/async-storage";
// Importa AsyncStorage para salvar e recuperar dados localmente (como sessão do usuário)

export default function Home({ navigation }) {
  // Componente funcional Home
  // Recebe a prop "navigation" para navegar entre telas do app

  const [username, setUsername] = useState("");
  // Cria estado "username" para armazenar o nome do usuário logado
  // Inicialmente vazio

  useEffect(() => {
    AsyncStorage.getItem("@cinegallery:username").then((v) => {
      if (v) setUsername(v);
      // Ao montar o componente, busca o nome do usuário no AsyncStorage
      // Se existir, atualiza o estado "username"
    });
  }, []);
  // Dependência vazia -> roda apenas uma vez, quando o componente é carregado

  const logout = async () => {
    // Função que realiza logout
    try {
      await AsyncStorage.multiRemove([
        "@cinegallery:logged",
        "@cinegallery:username",
      ]);
      // Remove do AsyncStorage os dados de login e usuário

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
      // Navega para a tela Login e limpa o histórico de navegação
      // Evita que o usuário volte para a Home pressionando o botão voltar
    } catch (e) {
      console.log("Erro ao sair:", e);
      // Caso ocorra erro ao limpar AsyncStorage, exibe no console
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Bem-vindo{username ? `, ${username}` : ""} 👋
        {/* Mostra "Bem-vindo, username" se houver username, senão apenas "Bem-vindo" */}
      </Text>
      <Text style={styles.subtitle}>Pronto para maratonar?</Text>
      {/* Subtítulo da tela */}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Gallery")}
        // Navega para a tela Gallery ao tocar no botão
      >
        <Text style={styles.buttonText}>Ver Galeria de Filmes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondary]}
        onPress={logout}
      >
        <Text style={styles.buttonText}>Sair</Text>
        {/* Botão vermelho para fazer logout */}
      </TouchableOpacity>
    </View>
  );
}

const PRIMARY = "#6C3BF4";
// Cor primária utilizada nos botões

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0E10",
    padding: 24,
    justifyContent: "center",
  },
  // Container principal ocupa toda a tela, com padding e fundo escuro
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },
  // Estilo do título
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 20,
    textAlign: "center",
  },
  // Estilo do subtítulo
  button: {
    backgroundColor: PRIMARY,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  // Estilo dos botões principais
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  // Estilo do texto dentro dos botões
  secondary: { backgroundColor: "#ef4444" },
  // Estilo do botão secundário (logout) com cor vermelha
});

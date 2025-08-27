// Importando React e hooks useEffect e useState
import React, { useEffect, useState } from "react";

// Importando componentes do React Native
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// Importando AsyncStorage para persistência de dados locais
import AsyncStorage from "@react-native-async-storage/async-storage";

// Componente principal da tela Home
export default function Home({ navigation }) {
  // Estado para armazenar o nome de usuário
  const [username, setUsername] = useState("");

  // Hook que executa quando o componente é montado
  useEffect(() => {
    // Busca o nome do usuário salvo no AsyncStorage
    AsyncStorage.getItem("@cinegallery:username").then(
      (v) => v && setUsername(v) // Se existir, atualiza o estado username
    );
  }, []); // [] significa que executa apenas uma vez ao montar o componente

  // Função para deslogar o usuário
  const logout = async () => {
    try {
      // Remove as chaves de login e username do AsyncStorage
      await AsyncStorage.multiRemove([
        "@cinegallery:logged",
        "@cinegallery:username",
      ]);

      // Navegação: substitui a tela atual pelo Login
      // getParent() pega o Stack Navigator pai, replace evita warning de RESET
      navigation.getParent()?.replace("Login");
    } catch (e) {
      // Se der erro, apenas loga no console
      console.log("Erro ao deslogar:", e);
    }
  };

  // JSX que renderiza a tela
  return (
    <View style={styles.container}>
      {/* Saudação com o nome do usuário, se houver */}
      <Text style={styles.title}>
        Bem-vindo{username ? `, ${username}` : ""} 👋
      </Text>

      {/* Subtítulo */}
      <Text style={styles.subtitle}>Pronto para maratonar?</Text>

      {/* Botão para navegar para a galeria de filmes */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Gallery")}
      >
        <Text style={styles.buttonText}>Ver Galeria de Filmes</Text>
      </TouchableOpacity>

      {/* Botão de logout */}
      <TouchableOpacity
        style={[styles.button, styles.secondary]} // Aplica estilo secundário vermelho
        onPress={logout} // Chama função logout ao clicar
      >
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

// Cor primária utilizada nos botões
const PRIMARY = "#6C3BF4";

// Estilos da tela
const styles = StyleSheet.create({
  // Container principal da tela
  container: {
    flex: 1, // Ocupa toda a tela
    backgroundColor: "#0E0E10",
    padding: 24,
    justifyContent: "center", // Centraliza verticalmente
  },

  // Título de boas-vindas
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },

  // Subtítulo menor
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 20,
    textAlign: "center",
  },

  // Botão principal
  button: {
    backgroundColor: PRIMARY,
    padding: 14,
    borderRadius: 12,
    alignItems: "center", // Centraliza o texto horizontalmente
    marginTop: 12,
  },

  // Texto dentro do botão
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  // Botão secundário (vermelho) usado para logout
  secondary: { backgroundColor: "#ef4444" },
});

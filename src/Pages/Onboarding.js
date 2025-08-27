// Importa React
import React from "react";

// Importa componentes básicos do React Native
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// View: container
// Text: para exibir textos
// TouchableOpacity: botão clicável
// StyleSheet: criar estilos

// AsyncStorage para salvar localmente se o usuário já viu o onboarding
import AsyncStorage from "@react-native-async-storage/async-storage";

// Componente funcional Onboarding
export default function Onboarding({ navigation }) {
  // navigation: usado para navegar entre telas

  // Função chamada quando o usuário termina o onboarding
  const finishOnboarding = async () => {
    // Salva no AsyncStorage que o usuário já viu o onboarding
    await AsyncStorage.setItem("hasSeenOnboarding", "true");

    // Navega para a tela Login, substituindo a tela atual
    // (não permite voltar para o onboarding com o botão de voltar)
    navigation.replace("Login");
  };

  // JSX: layout do onboarding
  return (
    <View style={styles.container}>
      {/* Título de boas-vindas */}
      <Text style={styles.title}>🎬 Bem-vindo ao CineGallery!</Text>

      {/* Subtítulo explicativo */}
      <Text style={styles.subtitle}>
        Explore milhares de filmes, salve seus favoritos e aproveite a magia do
        cinema.
      </Text>

      {/* Botão para finalizar onboarding */}
      <TouchableOpacity style={styles.button} onPress={finishOnboarding}>
        <Text style={styles.buttonText}>Começar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos da tela
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda a tela
    justifyContent: "center", // Centraliza verticalmente
    alignItems: "center", // Centraliza horizontalmente
    backgroundColor: "#1a1a2e",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#6c5ce7",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

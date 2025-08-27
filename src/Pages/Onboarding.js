import React from "react";
// Importa React

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// Importa componentes do React Native para interface e botões

import AsyncStorage from "@react-native-async-storage/async-storage";
// Importa AsyncStorage para salvar localmente que o usuário viu o onboarding

export default function Onboarding({ navigation }) {
  // Componente funcional Onboarding, recebe prop navigation para navegação

  const finishOnboarding = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    // Salva no AsyncStorage que o usuário já passou pelo onboarding
    navigation.replace("Login");
    // Navega para a tela Login substituindo a tela atual
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎬 Bem-vindo ao CineGallery!</Text>
      {/* Título de boas-vindas */}
      <Text style={styles.subtitle}>
        Explore milhares de filmes, salve seus favoritos e aproveite a magia do
        cinema.
      </Text>
      {/* Descrição */}
      <TouchableOpacity style={styles.button} onPress={finishOnboarding}>
        <Text style={styles.buttonText}>Começar</Text>
        {/* Botão para finalizar onboarding */}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  button: { backgroundColor: "#6c5ce7", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

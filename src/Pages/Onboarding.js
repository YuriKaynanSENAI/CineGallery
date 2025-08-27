import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Onboarding({ navigation }) {
  const finishOnboarding = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎬 Bem-vindo ao CineGallery!</Text>
      <Text style={styles.subtitle}>
        Explore milhares de filmes, salve seus favoritos e aproveite a magia do
        cinema.
      </Text>
      <TouchableOpacity style={styles.button} onPress={finishOnboarding}>
        <Text style={styles.buttonText}>Começar</Text>
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

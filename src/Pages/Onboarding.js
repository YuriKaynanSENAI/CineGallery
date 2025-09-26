// src/Pages/Onboarding.js
// Tela inicial de boas-vindas com botão para começar (marca usuário como 'visto' e vai para Login).

import React from "react";
// Importa React (não há estado local aqui)

import { View, StyleSheet, TouchableOpacity } from "react-native";
// Importa View, StyleSheet e TouchableOpacity para o botão

import TextComp from "../components/TextComp";
// Componente de texto padronizado

import { useNavigation } from "@react-navigation/native";
// Hook de navegação para redirecionar após começar

import { setLogged } from "../components/AsyncStorage";
// Helper para marcar que o onboarding foi visto (reaproveita a flag de logged)

const Onboarding = () => {
  // Componente funcional do Onboarding
  const navigation = useNavigation();
  // Obtém objeto de navegação

  const handleStart = async () => {
    // Função executada ao pressionar "Começar"
    await setLogged(true);
    // Marca o usuário como 'logado' (ou como que o app usa para pular telas)
    navigation.replace("Login");
    // Navega para a tela Login substituindo a atual
  };

  return (
    // JSX do Onboarding
    <View style={styles.container}>
      <TextComp variant="title" style={styles.title}>
        Bem-vindo ao CineGallery
      </TextComp>

      <TextComp variant="body" style={styles.subtitle}>
        Explore filmes, descubra novas histórias e monte sua lista de favoritos!
      </TextComp>

      <TouchableOpacity style={styles.btn} onPress={handleStart}>
        <TextComp color="#fff">Começar</TextComp>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Estilos do Onboarding
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 25,
    textAlign: "center",
  },
  btn: {
    marginTop: 15,
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
});

export default Onboarding;
// Exporta o componente Onboarding

// src/Pages/Login.js
// Tela de login simples: salva username e marca usuário como logado.

import React, { useState } from "react";
// Importa React e hook useState para controlar o input

import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
// Importa View, StyleSheet, TouchableOpacity (botão) e Alert para mensagens

import TextComp from "../components/TextComp";
// Componente de texto padronizado

import InputComp from "../components/InputComp";
// Campo de input reutilizável

import { setUsername, setLogged } from "../components/AsyncStorage";
// Helpers para salvar username e sinalizar que o usuário está logado

import { useNavigation } from "@react-navigation/native";
// Hook de navegação para redirecionar após login

const Login = () => {
  // Componente funcional da tela de Login
  const [username, setUser] = useState("");
  // Estado que armazena o valor do input do usuário

  const navigation = useNavigation();
  // Obtém objeto de navegação

  const handleLogin = async () => {
    // Função chamada ao pressionar "Entrar"
    if (!username.trim()) {
      // Verifica se o campo não está vazio (retirando espaços)
      Alert.alert("Erro", "Digite um nome de usuário.");
      // Mostra um alerta caso esteja vazio e interrompe
      return;
    }

    await setUsername(username);
    // Salva o username no AsyncStorage customizado

    await setLogged(true);
    // Marca que o usuário está logado

    navigation.replace("Home");
    // Navega para a tela Home substituindo a atual (sem voltar)
  };

  return (
    // JSX da tela de login
    <View style={styles.container}>
      <TextComp variant="title" style={styles.title}>
        CineGallery
      </TextComp>

      <InputComp
        placeholder="Digite seu nome de usuário"
        value={username}
        onChangeText={setUser}
        // Input controlado: value e onChangeText atualizam o estado
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <TextComp color="#fff">Entrar</TextComp>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Estilos do Login
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  btn: {
    marginTop: 15,
    backgroundColor: "#2ecc71",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
});

export default Login;
// Exporta o componente Login

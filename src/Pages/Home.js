// src/Pages/Home.js
// Tela inicial que cumprimenta o usuário e permite navegar para Gallery ou fazer logout.

import React, { useEffect, useState } from "react";
// Importa React e hooks (estado e efeito)

import { View, StyleSheet, TouchableOpacity } from "react-native";
// Importa componentes do RN: View, StyleSheet, TouchableOpacity

import { useNavigation } from "@react-navigation/native";
// Importa hook de navegação para controlar navegação entre telas

import TextComp from "../components/TextComp";
// Componente de texto padronizado

import { getUsername, clearSession } from "../components/AsyncStorage";
// Helpers: pegar o username e limpar sessão (logout)

const Home = () => {
  // Componente funcional da tela Home
  const [username, setUsername] = useState("");
  // Estado local para armazenar o nome do usuário

  const navigation = useNavigation();
  // Obtém o objeto de navegação (navigate, replace, etc)

  useEffect(() => {
    // Ao montar, carrega o nome do usuário do armazenamento
    const loadUser = async () => {
      const name = await getUsername();
      // Chama getUsername (pode ser null)
      setUsername(name || "Usuário");
      // Define o nome no estado, fallback para "Usuário" se null/undefined
    };
    loadUser();
    // Executa a função assíncrona de carregamento
  }, []);

  const handleLogout = async () => {
    // Função de logout chamada ao pressionar "Sair"
    await clearSession();
    // Limpa as chaves de sessão (LOGGED e USERNAME)
    navigation.replace("Login");
    // Substitui a tela atual pela tela de Login (impede voltar)
  };

  return (
    // JSX da tela Home
    <View style={styles.container}>
      <TextComp variant="title" style={styles.title}>
        Bem-vindo, {username}!{/* Exibe o nome carregado dinamicamente */}
      </TextComp>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Gallery")}
        // Navega para a tela "Gallery" ao pressionar
      >
        <TextComp color="#fff">Ver Galeria de Filmes</TextComp>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
        {/* Botão de logout que chama handleLogout */}
        <TextComp color="#fff">Sair</TextComp>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Estilos da Home
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
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  btnLogout: {
    marginTop: 10,
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
});

export default Home;
// Exporta o componente Home

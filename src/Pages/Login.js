import React, { useState } from "react";
// Importa o React e o hook useState, que permite criar estados dentro do componente

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
// Importa componentes do React Native para interface, alertas, teclado e estilos

import AsyncStorage from "@react-native-async-storage/async-storage";
// Importa AsyncStorage para salvar dados localmente (como sessão do usuário)

export default function Login({ navigation }) {
  // Define o componente funcional Login e recebe a prop navigation para navegar entre telas

  const [user, setUser] = useState("");
  // Estado para armazenar o nome do usuário digitado
  const [pass, setPass] = useState("");
  // Estado para armazenar a senha digitada
  const [loading, setLoading] = useState(false);
  // Estado para controlar se o login está em processamento (desativa botão e mostra "Entrando...")

  const handleLogin = async () => {
    // Função chamada ao apertar o botão "Entrar"
    if (!user || !pass) {
      // Se o usuário ou senha estiverem vazios
      Alert.alert("Ops", "Preencha usuário e senha.");
      // Mostra alerta pedindo para preencher
      return;
      // Interrompe a função
    }
    setLoading(true);
    // Ativa indicador de carregamento e desativa botão
    try {
      await AsyncStorage.setItem("@cinegallery:logged", "true");
      // Salva no AsyncStorage que o usuário está logado
      await AsyncStorage.setItem("@cinegallery:username", user);
      // Salva o nome do usuário no AsyncStorage

      // Navega para o MainTabs e reseta histórico de navegação
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar a sessão.");
      // Caso ocorra erro no AsyncStorage, mostra alerta
    } finally {
      setLoading(false);
      // Desativa carregamento independente do resultado
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Ajusta posição dos inputs quando o teclado aparece (somente iOS) */}

      <Text style={styles.title}>CineGallery</Text>
      {/* Título da tela */}
      <Text style={styles.subtitle}>Entre para ver os filmes populares</Text>
      {/* Subtítulo explicativo */}

      <TextInput
        value={user}
        onChangeText={setUser}
        // Atualiza o estado user ao digitar
        placeholder="Usuário"
        placeholderTextColor="#888"
        autoCapitalize="none"
        // Evita capitalização automática
        style={styles.input}
      />
      <TextInput
        value={pass}
        onChangeText={setPass}
        // Atualiza o estado pass ao digitar
        placeholder="Senha"
        placeholderTextColor="#888"
        secureTextEntry
        // Oculta o texto (senha)
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        // Chama função handleLogin ao apertar
        disabled={loading}
        // Desativa botão enquanto estiver carregando
      >
        <Text style={styles.buttonText}>
          {loading ? "Entrando..." : "Entrar"}
          {/* Mostra "Entrando..." enquanto carrega, senão "Entrar" */}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const PRIMARY = "#6C3BF4";
// Cor principal dos botões

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0E10",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1a1a1e",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2a2a30",
  },
  button: {
    backgroundColor: PRIMARY,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});

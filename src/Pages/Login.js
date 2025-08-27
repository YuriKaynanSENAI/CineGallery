// Importa React e hook useState para estados internos do componente
import React, { useState } from "react";

// Importa componentes do React Native para UI e interação
import {
  View, // Container básico
  Text, // Para exibir textos
  TextInput, // Para inputs de usuário e senha
  TouchableOpacity, // Botões clicáveis
  StyleSheet, // Para criar estilos
  Alert, // Para mostrar alertas de erro
  KeyboardAvoidingView, // Ajusta layout quando o teclado aparece
  Platform, // Detecta plataforma (iOS/Android)
} from "react-native";

// AsyncStorage para salvar dados locais (sessão do usuário)
import AsyncStorage from "@react-native-async-storage/async-storage";

// Componente funcional Login
export default function Login({ navigation }) {
  // Estado para armazenar o nome do usuário digitado
  const [user, setUser] = useState("");

  // Estado para armazenar a senha digitada
  const [pass, setPass] = useState("");

  // Estado que indica se o login está em andamento (loading)
  const [loading, setLoading] = useState(false);

  // Função executada quando o usuário clica no botão "Entrar"
  const handleLogin = async () => {
    // Se o usuário ou senha estiverem vazios, mostra alerta
    if (!user || !pass) {
      Alert.alert("Ops", "Preencha usuário e senha.");
      return; // Interrompe a execução da função
    }

    // Ativa o estado de carregamento
    setLoading(true);

    try {
      // Salva no AsyncStorage que o usuário está logado
      await AsyncStorage.setItem("@cinegallery:logged", "true");

      // Salva o nome do usuário no AsyncStorage
      await AsyncStorage.setItem("@cinegallery:username", user);

      // Navega para MainTabs e reseta histórico para não permitir voltar ao login
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (e) {
      // Se ocorrer erro ao salvar a sessão, mostra alerta
      Alert.alert("Erro", "Não foi possível salvar a sessão.");
    } finally {
      // Desativa o carregamento, independente do resultado
      setLoading(false);
    }
  };

  // JSX: layout da tela de login
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Ajusta posição dos inputs quando o teclado aparece (somente iOS) */}

      {/* Título do app */}
      <Text style={styles.title}>CineGallery</Text>

      {/* Subtítulo explicativo */}
      <Text style={styles.subtitle}>Entre para ver os filmes populares</Text>

      {/* Input do usuário */}
      <TextInput
        value={user} // Valor do input
        onChangeText={setUser} // Atualiza estado ao digitar
        placeholder="Usuário" // Texto placeholder
        placeholderTextColor="#888" // Cor do placeholder
        autoCapitalize="none" // Não capitaliza automaticamente
        style={styles.input} // Aplica estilo
      />

      {/* Input da senha */}
      <TextInput
        value={pass} // Valor do input
        onChangeText={setPass} // Atualiza estado ao digitar
        placeholder="Senha" // Placeholder
        placeholderTextColor="#888"
        secureTextEntry // Oculta a senha
        style={styles.input}
      />

      {/* Botão de login */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin} // Chama função ao clicar
        disabled={loading} // Desativa botão se estiver carregando
      >
        <Text style={styles.buttonText}>
          {loading ? "Entrando..." : "Entrar"}{" "}
          {/* Texto muda conforme loading */}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

// Cor primária usada nos botões
const PRIMARY = "#6C3BF4";

// Estilos da tela
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda a tela
    backgroundColor: "#0E0E10",
    padding: 24,
    justifyContent: "center", // Centraliza verticalmente
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
    alignItems: "center", // Centraliza texto horizontalmente
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});

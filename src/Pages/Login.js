import React, { useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!user || !pass) {
      Alert.alert("Ops", "Preencha usuário e senha.");
      return;
    }
    setLoading(true);
    try {
      // Aqui poderia validar em uma API; para o protótipo, qualquer não-vazio entra.
      await AsyncStorage.setItem("@cinegallery:logged", "true");
      await AsyncStorage.setItem("@cinegallery:username", user);
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar a sessão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>CineGallery</Text>
      <Text style={styles.subtitle}>Entre para ver os filmes populares</Text>

      <TextInput
        value={user}
        onChangeText={setUser}
        placeholder="Usuário"
        placeholderTextColor="#888"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        value={pass}
        onChangeText={setPass}
        placeholder="Senha"
        placeholderTextColor="#888"
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Entrando..." : "Entrar"}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const PRIMARY = "#6C3BF4";

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

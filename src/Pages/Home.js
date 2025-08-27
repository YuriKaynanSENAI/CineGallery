import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home({ navigation }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("@cinegallery:username").then(
      (v) => v && setUsername(v)
    );
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "@cinegallery:logged",
        "@cinegallery:username",
      ]);
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (e) {
      // evita quebrar a UI se falhar
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Bem-vindo{username ? `, ${username}` : ""} 👋
      </Text>
      <Text style={styles.subtitle}>Pronto para maratonar?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Gallery")}
      >
        <Text style={styles.buttonText}>Ver Galeria de Filmes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondary]}
        onPress={logout}
      >
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
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
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: PRIMARY,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  secondary: { backgroundColor: "#ef4444" },
});

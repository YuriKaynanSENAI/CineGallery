// Importa React e hooks useState/useEffect
import React, { useEffect, useState } from "react";

// Container de navegação principal
import { NavigationContainer } from "@react-navigation/native";

// Navegação stack (telas empilhadas)
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Navegação por abas inferior
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// AsyncStorage para verificar login
import AsyncStorage from "@react-native-async-storage/async-storage";

// Componentes de loading
import { ActivityIndicator, View } from "react-native";

// Ícones do React Native Vector Icons
import Ionicons from "react-native-vector-icons/Ionicons";

// Importa telas do app
import Onboarding from "./src/Pages/Onboarding";
import Login from "./src/Pages/Login";
import Home from "./src/Pages/Home";
import Gallery from "./src/Pages/Gallery";
import Favoritos from "./src/Pages/Favoritos";

// Criação do stack navigator
const Stack = createNativeStackNavigator();

// Criação do bottom tab navigator
const Tab = createBottomTabNavigator();

// Componente que define as abas principais
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Oculta header padrão
        tabBarStyle: { backgroundColor: "#111", borderTopColor: "#333" }, // Estilo da aba
        tabBarActiveTintColor: "#6C3BF4", // Cor ícone ativo
        tabBarInactiveTintColor: "#999", // Cor ícone inativo

        // Função para definir ícone de cada aba
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home-outline"; // Ícone home
          } else if (route.name === "Favoritos") {
            iconName = "star-outline"; // Ícone favoritos
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Abas do app */}
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Favoritos" component={Favoritos} />
    </Tab.Navigator>
  );
}

// Componente principal do app
export default function App() {
  // Estado para determinar qual tela inicial abrir
  const [initialRoute, setInitialRoute] = useState(null);

  // useEffect para verificar login ao iniciar app
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const logged = await AsyncStorage.getItem("@cinegallery:logged");
        // Se estiver logado, abre MainTabs; se não, abre Onboarding
        setInitialRoute(logged === "true" ? "MainTabs" : "Onboarding");
      } catch (e) {
        console.log("Erro ao verificar login:", e);
        setInitialRoute("Onboarding"); // Caso dê erro, inicia no onboarding
      }
    };
    checkLogin();
  }, []);

  // Enquanto não verifica login, mostra loading
  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6C3BF4" />
      </View>
    );
  }

  // Container de navegação principal
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute} // Tela inicial definida pelo estado
        screenOptions={{ headerShown: false }} // Oculta header padrão
      >
        {/* Telas stack */}
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Gallery" component={Gallery} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

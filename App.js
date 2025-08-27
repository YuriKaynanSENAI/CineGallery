import React, { useEffect, useState } from "react";
// Importa React e hooks: useState para estado, useEffect para efeitos colaterais

import { NavigationContainer } from "@react-navigation/native";
// Container principal da navegação, envolve toda a aplicação

import { createNativeStackNavigator } from "@react-navigation/native-stack";
// Cria uma pilha de navegação (Stack) para telas empilhadas

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// Cria abas inferiores (Bottom Tabs) para navegação principal

import { Ionicons } from "@expo/vector-icons";
// Importa ícones do Ionicons para usar nas abas

import AsyncStorage from "@react-native-async-storage/async-storage";
// Importa AsyncStorage para salvar e recuperar dados locais (ex: se viu onboarding)

// Telas do app
import Onboarding from "./src/Pages/Onboarding";
import Login from "./src/Pages/Login";
import Home from "./src/Pages/Home";
import Favoritos from "./src/Pages/Favoritos";
import Gallery from "./src/Pages/Gallery";

const Stack = createNativeStackNavigator();
// Cria a navegação em pilha (Stack) para telas como Onboarding e Login

const Tab = createBottomTabNavigator();
// Cria a navegação de abas (Bottom Tabs) para Home e Favoritos

// Componente de abas inferiores (Home + Favoritos)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        // Esconde cabeçalho padrão nas abas
        tabBarStyle: { backgroundColor: "#1a1a2e" },
        // Cor de fundo da barra de abas
        tabBarActiveTintColor: "#6c5ce7",
        // Cor do ícone da aba ativa
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
            // Ícone da aba Home
          ),
        }}
      />
      <Tab.Screen
        name="Favoritos"
        component={Favoritos}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" color={color} size={size} />
            // Ícone da aba Favoritos
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  // Componente principal da aplicação

  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(null);
  // Estado que armazena se o usuário já viu a tela de onboarding

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem("hasSeenOnboarding");
      setHasSeenOnboarding(seen === "true");
      // Recupera do AsyncStorage se o usuário já passou pelo onboarding
    };
    checkOnboarding();
  }, []);
  // useEffect vazio executa apenas uma vez ao iniciar o app

  if (hasSeenOnboarding === null) return null;
  // Enquanto AsyncStorage não carrega, não renderiza nada

  return (
    <NavigationContainer>
      {/* Container principal da navegação */}
      <Stack.Navigator
        initialRouteName={hasSeenOnboarding ? "Login" : "Onboarding"}
        // Define a primeira tela: se já viu onboarding, vai direto para Login
        screenOptions={{ headerShown: false }}
        // Esconde cabeçalho das telas de stack
      >
        <Stack.Screen name="Onboarding" component={Onboarding} />
        {/* Tela de onboarding */}
        <Stack.Screen name="Login" component={Login} />
        {/* Tela de login */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
        {/* Navegação de abas (Home + Favoritos) */}
        <Stack.Screen name="Gallery" component={Gallery} />
        {/* Tela de galeria de filmes */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

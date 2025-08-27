import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Telas
import Onboarding from "./src/Pages/Onboarding";
import Login from "./src/Pages/Login";
import Home from "./src/Pages/Home";
import Favoritos from "./src/Pages/Favoritos";
import Gallery from "./src/Pages/Gallery";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs: Home + Favoritos
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#1a1a2e" },
        tabBarActiveTintColor: "#6c5ce7",
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Favoritos"
        component={Favoritos}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(null);
  const [isLogged, setIsLogged] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      // Verifica se já viu o onboarding
      const seen = await AsyncStorage.getItem("hasSeenOnboarding");
      setHasSeenOnboarding(seen === "true");

      // Verifica se já está logado
      const logged = await AsyncStorage.getItem("@cinegallery:logged");
      setIsLogged(logged === "true");
    };
    checkStatus();
  }, []);

  if (hasSeenOnboarding === null || isLogged === null) return null; // espera AsyncStorage carregar

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Se não viu onboarding, mostra Onboarding */}
        {!hasSeenOnboarding && (
          <Stack.Screen name="Onboarding" component={Onboarding} />
        )}

        {/* Se já viu onboarding mas não está logado, mostra Login */}
        {!isLogged && hasSeenOnboarding && (
          <Stack.Screen name="Login" component={Login} />
        )}

        {/* Tela principal com abas (Home + Favoritos) */}
        <Stack.Screen name="MainTabs" component={MainTabs} />

        {/* Galeria */}
        <Stack.Screen name="Gallery" component={Gallery} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

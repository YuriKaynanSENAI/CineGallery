import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./src/Pages/Login";
import Home from "./src/Pages/Home";
import Gallery from "./src/Pages/Gallery";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const flag = await AsyncStorage.getItem("@cinegallery:logged");
        setIsLogged(flag === "true");
      } catch (e) {
        // se falhar, fica deslogado
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLogged ? "Home" : "Login"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Gallery" component={Gallery} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// src/components/AsyncStorage.js
// Wrapper utilitário para @react-native-async-storage/async-storage
// Centraliza as chaves e funções auxiliares usadas pela aplicação.

import AsyncStorage from "@react-native-async-storage/async-storage";
// Importa o AsyncStorage oficial do React Native (armazenamento local assíncrono).

// Chaves padrões
const LOGGED_KEY = "@cinegallery:logged"; // chave para saber se o usuário está logado
const USERNAME_KEY = "@cinegallery:username"; // chave para salvar o nome de usuário
const FAVORITES_KEY = "favorites"; // chave para lista de favoritos

// --- Básicos ---
export const setItem = async (key, value) => {
  // Salva qualquer valor no AsyncStorage
  try {
    const v = typeof value === "string" ? value : JSON.stringify(value);
    // Se o valor for string, salva direto. Senão, converte para JSON.
    await AsyncStorage.setItem(key, v); // salva no armazenamento
    return true;
  } catch (e) {
    console.error("AsyncStorage.setItem error:", e);
    return false;
  }
};

export const getItem = async (key) => {
  // Busca qualquer valor do AsyncStorage
  try {
    const v = await AsyncStorage.getItem(key);
    if (v === null) return null; // se não existir, retorna null

    // tenta parsear JSON, se falhar retorna a string crua
    try {
      return JSON.parse(v); // se for JSON, retorna objeto/array
    } catch {
      return v; // senão retorna como string
    }
  } catch (e) {
    console.error("AsyncStorage.getItem error:", e);
    return null;
  }
};

export const removeItem = async (key) => {
  // Remove uma chave específica
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error("AsyncStorage.removeItem error:", e);
    return false;
  }
};

export const multiRemove = async (keys = []) => {
  // Remove várias chaves ao mesmo tempo
  try {
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (e) {
    console.error("AsyncStorage.multiRemove error:", e);
    return false;
  }
};

// --- Sessão / Username ---
export const setUsername = async (name) => setItem(USERNAME_KEY, name);
// Salva o nome do usuário

export const getUsername = async () => getItem(USERNAME_KEY);
// Busca o nome do usuário

export const setLogged = async (value = true) => setItem(LOGGED_KEY, value);
// Marca se o usuário está logado (true/false)

export const getLogged = async () => getItem(LOGGED_KEY);
// Verifica se o usuário está logado

export const clearSession = async () => {
  // Limpa informações de login (logout)
  return multiRemove([LOGGED_KEY, USERNAME_KEY]);
};

// --- Favoritos (helpers) ---
export const getFavorites = async () => {
  // Busca a lista de favoritos
  const favs = await getItem(FAVORITES_KEY);
  return Array.isArray(favs) ? favs : [];
};

export const saveFavorites = async (favList = []) => {
  // Salva a lista inteira de favoritos
  return setItem(FAVORITES_KEY, favList);
};

export const addFavorite = async (movie) => {
  // Adiciona um filme aos favoritos
  if (!movie || !movie.imdbID) return null; // precisa ter id
  const favs = await getFavorites();
  if (!favs.some((f) => f.imdbID === movie.imdbID)) {
    // só adiciona se ainda não existir
    favs.push(movie);
    await saveFavorites(favs);
  }
  return favs;
};

export const removeFavoriteById = async (id) => {
  // Remove um filme pelo id
  if (!id) return null;
  let favs = await getFavorites();
  favs = favs.filter((f) => f.imdbID !== id); // filtra removendo o id
  await saveFavorites(favs);
  return favs;
};

export const isFavorite = async (id) => {
  // Verifica se um filme já está nos favoritos
  if (!id) return false;
  const favs = await getFavorites();
  return favs.some((f) => f.imdbID === id);
};

export const toggleFavorite = async (movie) => {
  // Alterna: se está nos favoritos, remove. Se não está, adiciona.
  if (!movie || !movie.imdbID) return null;
  const favs = await getFavorites();
  if (favs.some((f) => f.imdbID === movie.imdbID)) {
    return removeFavoriteById(movie.imdbID);
  } else {
    return addFavorite(movie);
  }
};

// Re-export do AsyncStorage original caso precise de alguma API não coberta aqui
export const raw = AsyncStorage;

// Default export com um objeto contendo as funções principais
export default {
  setItem,
  getItem,
  removeItem,
  multiRemove,
  setUsername,
  getUsername,
  setLogged,
  getLogged,
  clearSession,
  getFavorites,
  saveFavorites,
  addFavorite,
  removeFavoriteById,
  isFavorite,
  toggleFavorite,
  raw,
};

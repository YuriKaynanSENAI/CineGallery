// src/__tests__/Home.test.js
import React from "react";
// Importa o React, necessário para renderizar componentes no teste.

import { render, fireEvent, waitFor } from "@testing-library/react-native";
// render → renderiza o componente em um ambiente de teste.
// fireEvent → simula interações do usuário (toques, mudanças de texto, etc).
// waitFor → aguarda a resolução de operações assíncronas antes de continuar o teste.

import Home from "../Pages/Home";
// Importa o componente que será testado (a tela Home).

const mockNavigate = jest.fn();
// Cria uma função "mock" (falsa) para simular a navegação com navigate().

const mockReplace = jest.fn();
// Cria uma função "mock" para simular a navegação com replace().

jest.mock("@react-navigation/native", () => ({
  // Substitui o módulo original de navegação por um mock.
  useNavigation: () => ({
    // Quando o hook useNavigation for chamado, ele retorna um objeto com:
    navigate: mockNavigate, // função falsa de navegação
    replace: mockReplace, // função falsa de substituição de tela
  }),
}));

jest.mock("../components/AsyncStorage.js", () => ({
  // Substitui o módulo de AsyncStorage customizado pelos mocks abaixo:
  getUsername: jest.fn(() => Promise.resolve("Kaynan")),
  // Mock da função getUsername → sempre retorna "Kaynan".
  clearSession: jest.fn(() => Promise.resolve()),
  // Mock da função clearSession → sempre resolve sem erro.
}));

import { clearSession } from "../components/AsyncStorage";
// Importa a função mockada clearSession para ser usada nos testes.

describe("Test Home Screen", () => {
  // Define um grupo de testes para a tela Home.

  beforeEach(() => {
    jest.clearAllMocks();
    // Antes de cada teste, limpa o histórico das funções mockadas.
  });

  it("Renderiza o título corretamente!", async () => {
    // Teste 1: verifica se o título aparece na tela.
    const { findByText } = render(<Home />);
    // Renderiza o componente Home.

    const titulo = await findByText("Bem-vindo, Kaynan!");
    // Procura na tela o texto "Bem-vindo, Kaynan!" (que vem do mock do getUsername).

    expect(titulo).toBeTruthy();
    // Verifica se o elemento realmente existe.
  });

  it("Navega para Gallery ao clicar no botão", () => {
    // Teste 2: verifica se ao clicar no botão, a navegação é chamada.
    const { getByText } = render(<Home />);
    // Renderiza o componente.

    const btn = getByText("Ver Galeria de Filmes");
    // Seleciona o botão pelo texto exibido.

    fireEvent.press(btn);
    // Simula um clique no botão.

    expect(mockNavigate).toHaveBeenCalledWith("Gallery");
    // Verifica se a função de navegação foi chamada com a tela "Gallery".
  });

  it("Chama clearSession e navega para a tela de Login", async () => {
    // Teste 3: verifica se o logout limpa a sessão e leva o usuário para Login.
    const { getByText } = render(<Home />);
    // Renderiza o componente.

    const btnSair = getByText("Sair");
    // Seleciona o botão "Sair".

    fireEvent.press(btnSair);
    // Simula o clique no botão de logout.

    await waitFor(() => {
      // Aguarda que funções assíncronas sejam resolvidas.
      expect(clearSession).toHaveBeenCalled();
      // Verifica se clearSession foi chamada.
      expect(mockReplace).toHaveBeenCalledWith("Login");
      // Verifica se a navegação foi feita para a tela "Login".
    });
  });
});

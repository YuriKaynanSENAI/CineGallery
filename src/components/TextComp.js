// src/components/TextComp.js
// Componente de texto padronizado, que facilita manter consistência tipográfica.

import React from "react";
// Importa React para criar o componente.

import { Text, StyleSheet } from "react-native";
// Text → componente nativo para exibir textos.
// StyleSheet → para definir estilos de forma otimizada.

const TextComp = ({
  children, // conteúdo/texto que será exibido
  style, // estilos adicionais vindos de fora
  variant = "body", // tipo de texto (title, subtitle, body, small)
  color = "#333", // cor padrão do texto
  ...rest // outras props extras que podem ser passadas
}) => {
  return (
    <Text
      style={[styles[variant], { color }, style]}
      // Aplica: estilo do variant escolhido + cor definida + estilos extras.
      {...rest}
      // Repasse de outras props (ex: numberOfLines, ellipsizeMode).
    >
      {children}
      {/* Exibe o texto que for passado dentro do componente */}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24, // tamanho da fonte
    fontWeight: "bold", // negrito
    marginBottom: 8, // espaço inferior
    color: "#111", // cor padrão (sobrescrita se "color" for passado)
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600", // semi-negrito
    marginBottom: 6,
    color: "#222",
  },
  body: {
    fontSize: 16,
    lineHeight: 22, // altura da linha (espaçamento entre linhas)
    color: "#333",
  },
  small: {
    fontSize: 14, // texto menor
    color: "#555",
  },
});

export default TextComp;
// Exporta o componente para ser usado em outras partes da aplicação.

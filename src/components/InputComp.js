// src/components/InputComp.js
// Componente de Input customizado com estilização padrão e suporte a props extras.

import React from "react";
// Importa o React para criar componentes funcionais.

import { TextInput, StyleSheet, View } from "react-native";
// TextInput → campo de texto do React Native.
// StyleSheet → cria objetos de estilo com melhor performance.
// View → container para estruturar o layout.

const InputComp = ({
  value, // valor atual do input
  onChangeText, // função chamada quando o texto muda
  placeholder = "", // texto de placeholder (dica no campo)
  secureTextEntry = false, // se true → esconde o texto (senha)
  keyboardType = "default", // tipo do teclado (numérico, email, etc)
  autoCapitalize = "none", // controla a capitalização automática
  style, // estilo extra que pode ser passado de fora
  ...rest // qualquer outra prop extra é repassada ao TextInput
}) => {
  return (
    <View style={styles.container}>
      {/* Um container para manter margens e largura */}
      <TextInput
        style={[styles.input, style]} // aplica estilos padrão + extras
        value={value} // valor do campo
        onChangeText={onChangeText} // callback ao digitar
        placeholder={placeholder} // placeholder exibido
        placeholderTextColor="#999" // cor do placeholder
        secureTextEntry={secureTextEntry} // modo senha
        keyboardType={keyboardType} // tipo de teclado
        autoCapitalize={autoCapitalize} // auto capitalização
        {...rest} // espalha quaisquer props extras
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%", // ocupa toda a largura disponível
    marginVertical: 8, // margem em cima e embaixo
  },
  input: {
    width: "100%",
    padding: 12, // espaço interno
    borderWidth: 1, // borda de 1px
    borderColor: "#ccc", // cor da borda
    borderRadius: 8, // cantos arredondados
    fontSize: 16, // tamanho do texto
    color: "#333", // cor do texto digitado
    backgroundColor: "#fff", // fundo branco
  },
});

export default InputComp;
// Exporta o componente para ser usado em outras telas.

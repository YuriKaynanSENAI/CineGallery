# **CineGallery – App de Filmes**

## Nome:
Yuri Kaynan  
**Data:** 27/08/2025

---

## Introdução:

O CineGallery é um aplicativo desenvolvido em **React Native** que simula uma galeria de filmes, permitindo ao usuário realizar login persistente, visualizar filmes populares e recomendados, pesquisar filmes e gerenciar favoritos.  
O objetivo é aplicar conhecimentos de programação para dispositivos móveis, integração com APIs externas, navegação entre telas e persistência de dados locais.

---

## Contextualização:

O projeto foi concebido como protótipo funcional para aprendizado da disciplina **Programação para Dispositivos Móveis**, permitindo prática com tecnologias como:

- **React Native** (componentes nativos e hooks)
- **AsyncStorage** (persistência de sessão e favoritos)
- **React Navigation** (Stack Navigator + Bottom Tabs)
- **Consumo da API OMDb** (filmes e imagens)
- **Design responsivo e interação com ícones** (Ionicons)

---

## Necessidades e Expectativas:

Esse projeto foi designado para meu aprendizado em desenvolvimento mobile, sendo necessário que funcione como uma galeria de filmes funcional e intuitiva.  
É esperado que o app proporcione uma experiência agradável ao usuário, permitindo pesquisa, recomendação e gerenciamento de favoritos.

---

## Restrições e Limitações:

- O app depende de conexão à internet para consumir a API OMDb.
- Não possui integração com backend próprio (utiliza apenas API externa).
- A persistência é limitada ao armazenamento local do dispositivo (AsyncStorage).
- Focado em prototipação e prática acadêmica, não em publicação comercial.

---

## Escopo:

O CineGallery é um projeto **mobile** focado em:

- Login persistente
- Onboarding exibido apenas na primeira abertura
- Pesquisa, recomendação e favoritação de filmes
- Interface responsiva com dark mode
- Navegação entre telas via Stack Navigator e Bottom Tabs
- Gerenciamento de favoritos localmente

---

## Expectativa de Design:

O design esperado é intuitivo e responsivo, com navegação clara entre as telas principais (Onboarding, Login, Home, Gallery, Favoritos).  
Utiliza ícones Ionicons para melhorar a experiência visual. O dark mode é implementado para conforto visual.

---

## Comunicação e Colaboração:

O projeto foi acompanhado e revisado por professores da disciplina, com auxílio na correção de bugs e aprimoramento das funcionalidades e boas práticas de programação mobile.

---

## Cronograma e Prazos:

O projeto foi desenvolvido durante o período da disciplina, com tempo suficiente para implementar as funcionalidades principais, realizar testes, correções e aprimoramentos.  
O protótipo está pronto para futuras expansões, como tela de detalhes do filme, busca avançada e integração com backend próprio.

---

## Requisitos do Ambiente:

- **Node.js** e **npm** ou **yarn**
- **Expo CLI** (facilita execução em Android/iOS)
- **Editor de código** (ex: VS Code)
- **Conexão à internet** (instalação de dependências e consumo da API OMDb)

---

## Instalação de Dependências:

```sh
# Criação do projeto com Expo
expo init CineGallery
cd CineGallery

# Instalação dos pacotes de navegação
npm install @react-navigation/native @react-navigation/native-stack
npm install @react-navigation/bottom-tabs

# Dependências necessárias
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install axios
npm install react-native-vector-icons
```
- `@react-navigation/native` e `native-stack`: navegação entre telas
- `bottom-tabs`: navegação por abas na Home
- `async-storage`: salvar dados localmente (sessão e favoritos)
- `axios`: requisições HTTP na API OMDb
- `vector-icons`: ícones de navegação e botões

---

## Estrutura de Pastas:

```
CineGallery/
│
├─ src/
│  ├─ Pages/
│  │  ├─ Onboarding.js
│  │  ├─ Login.js
│  │  ├─ Home.js
│  │  ├─ Gallery.js
│  │  └─ Favoritos.js
│
├─ App.js
└─ package.json
```
Cada tela é um componente React Native.  
**App.js** é o ponto de entrada, responsável pela navegação inicial e verificação de login.

---

## Instruções de Execução:

### 1. Preparação do ambiente

- Instale o [Node.js](https://nodejs.org/) e o [Expo CLI](https://docs.expo.dev/get-started/installation/).
- Clone o repositório e acesse a pasta do projeto:
  ```sh
  git clone https://github.com/YuriKaynanSENAI/CineGallery.git
  cd CineGallery
  ```
- Instale as dependências com npm ou yarn:
  ```sh
  npm install
  # ou
  yarn install
  ```

### 2. Execução do Projeto

- Para rodar o projeto em modo de desenvolvimento:
  ```sh
  expo start
  ```
- O Expo irá abrir um painel no navegador.
- Você pode rodar o app em:
  - **Emulador Android/iOS**: Basta configurar o emulador no seu computador e clicar em "Run on Android device/emulator" ou "Run on iOS simulator".
  - **Celular físico**: Instale o app **Expo Go** na loja de aplicativos, escaneie o QR code que aparece no navegador e o app será aberto no seu dispositivo.

### 3. Observações para Execução

- Mantenha seu celular ou emulador conectado na mesma rede que o computador para uso do Expo Go.
- Certifique-se de estar conectado à internet para consumir a API de filmes.
- Caso queira testar em produção, pode usar `expo build` ou `eas build` para criar pacotes instaláveis.

---

## Explicação das Telas:

### Onboarding.js
**Objetivo:** Apresentar o app ao usuário na primeira execução.
```javascript
const finishOnboarding = async () => {
  await AsyncStorage.setItem("hasSeenOnboarding", "true");
  navigation.replace("Login");
};
```
- Salva que o usuário já passou pelo onboarding
- Impede que o usuário volte para onboarding com o botão de voltar

---

### Login.js
**Objetivo:** Receber credenciais do usuário e salvar sessão.
```javascript
await AsyncStorage.setItem("@cinegallery:logged", "true");
await AsyncStorage.setItem("@cinegallery:username", user);
navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
```
- Controle dos inputs via `useState`
- Validação simples: qualquer usuário/senha não vazios é aceito
- Redireciona para as abas principais e limpa histórico

---

### Home.js
**Objetivo:** Tela principal após login.
```javascript
useEffect(() => {
  AsyncStorage.getItem("@cinegallery:username").then(
    (v) => v && setUsername(v)
  );
}, []);
```
```javascript
const logout = async () => {
  await AsyncStorage.multiRemove(["@cinegallery:logged", "@cinegallery:username"]);
  navigation.getParent()?.replace("Login");
};
```
- Recupera nome do usuário do AsyncStorage
- Botões: "Ver Galeria de Filmes", "Sair"

---

### Gallery.js
**Objetivo:** Exibir filmes populares, pesquisa e favoritos.
```javascript
const fetchMovies = async (q) => {
  const r = await axios.get(`https://www.omdbapi.com/?s=${q}&type=movie&apikey=${API_KEY}`);
  setMovies(r.data.Search || []);
};
```
- Consome a OMDb API
- Exibe filmes em grid responsivo
- Botão de favoritar altera ícone dinamicamente e salva no AsyncStorage

---

### Favoritos.js
**Objetivo:** Listar filmes favoritados.
```javascript
useFocusEffect(
  React.useCallback(() => {
    const loadFavorites = async () => {
      const favs = await AsyncStorage.getItem("favorites");
      setFavorites(favs ? JSON.parse(favs) : []);
    };
    loadFavorites();
  }, [])
);
```
- Atualiza a lista sempre que a tela recebe foco
- Botão "Remover" exclui o filme da lista e atualiza o AsyncStorage

---

### App.js
**Objetivo:** Configura navegação inicial e roteamento principal.
```javascript
const [initialRoute, setInitialRoute] = useState(null);

useEffect(() => {
  const checkLogin = async () => {
    const logged = await AsyncStorage.getItem("@cinegallery:logged");
    setInitialRoute(logged === "true" ? "MainTabs" : "Onboarding");
  };
  checkLogin();
}, []);
```
```jsx
<Stack.Navigator initialRouteName={initialRoute}>
  <Stack.Screen name="Onboarding" component={Onboarding} />
  <Stack.Screen name="Login" component={Login} />
  <Stack.Screen name="MainTabs" component={MainTabs} />
  <Stack.Screen name="Gallery" component={Gallery} />
</Stack.Navigator>
```

---

## Funcionalidades Principais:

- Persistência de login com AsyncStorage
- Onboarding exibido apenas na primeira abertura
- Pesquisa e recomendação de filmes
- Favoritar e remover filmes, atualizando ícones dinamicamente
- Interface dark mode responsiva
- Navegação segura entre Stack e Tabs

---

## Observações Finais:

Este projeto serve como protótipo funcional e material de estudo, demonstrando boas práticas em React Native e integração com serviços web.  
O código é modular, comentado e preparado para futuras expansões, como:

- Tela de detalhes do filme
- Busca avançada
- Integração com backend

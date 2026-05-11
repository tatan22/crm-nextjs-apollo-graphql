// No se implementa apollo server ya que estamos en el cliente
/**
 * ApolloClient: Para interactuar con el servidor GraphQL
 * HttpLink: Conectar con el servidor de Apollo a través de HTTP
 * InMemoryCache: Para almacenar en caché los resultados de las consultas GraphQL
 * fetch: Permite traer los resultados de las consultas a nuestro componentes
 */
import { ApolloClient, HttpLink, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

/** Ese cliente debe estar en el archivo principal, si se utiliza create React App, el archivo principal es index.js, 
pero en este caso no existe index.js */

const client = new ApolloClient({
  connectToDevTools: true,// Para conectar con las herramientas de desarrollo de Apollo
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),// Para concatenar el enlace de autenticación con el enlace HTTP
});

export default client;

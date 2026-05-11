import "../styles/globals.css";
// ApolloProvider: Funciona similar al provider de Context, Podemos envolver toda nuestra aplicación con el ApolloProvider
import { ApolloProvider } from "@apollo/client";
import client from "../config/apollo";
import { Component } from "react";

const myApp = ({ Component, pageProps }) => {
	return (
		<ApolloProvider client={client}>
			<Component {...pageProps} /> {/* Renderiza el componente de la página actual */}
		</ApolloProvider>
	);
};

export default myApp;

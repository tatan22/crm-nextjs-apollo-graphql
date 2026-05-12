import { Component } from "react";
import "../styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import client from "../config/apollo";
import PedidoState from "../context/pedidos/PedidoState";

const myApp = ({ Component, pageProps }) => {
	return (
		<ApolloProvider client={client}>
			<PedidoState>
				<Component {...pageProps} />{" "}
				{/* Renderiza el componente de la página actual */}
			</PedidoState>
		</ApolloProvider>
	);
};

export default myApp;

const { ApolloServer } = require("apollo-server");
const conectarDB = require("./config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// Conectar a la base de datos
conectarDB();

const { typeDefs, resolvers } = require("./db");

// Servidor
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => {
		const token = req.headers["authorization"] || "";

		if (token) {
			try {
				const cleanToken = token.replace("Bearer ", "");
				const usuario = jwt.verify(cleanToken, process.env.SECRET);

				return { usuario };
			} catch (error) {
				console.error("JWT ERROR:", error.message);
				return {};
			}
		}

		return {};
	},
});

//Arrancar el Servidor

server.listen().then(({ url }) => {
	console.log(`Servidor listo en ${url}`);
});

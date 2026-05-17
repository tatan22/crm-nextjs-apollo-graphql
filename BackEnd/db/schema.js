const { gql } = require("apollo-server");

const typeDefs = gql`
	# Usuario
	type Usuario {
		id: ID
		name: String
		lastName: String
		email: String
		# El password no se va a mostrar por seguridad
		createdAt: String
	}
	type Token {
		token: String
	}

	input UsuarioInput {
		name: String!
		lastName: String!
		email: String!
		password: String!
	}
	input AuthInput {
		email: String!
		password: String!
	}

	# Producto
	type Producto {
		id: ID
		nombre: String
		existencia: Int
		precio: Float
		creado: String
	}
	input ProductoInput {
		nombre: String!
		existencia: Int!
		precio: Float!
	}

	# Cliente
	type Cliente {
		id: ID
		nombre: String
		apellido: String
		empresa: String
		email: String
		telefono: String
		vendedor: ID
	}
	input ClienteInput {
		nombre: String!
		apellido: String!
		empresa: String!
		email: String!
		telefono: String
	}
	#Top Cliente
	type TopCliente {
		total: Float
		cliente: [Cliente]
	}
	type TopVendedores {
		total: Float
		vendedor: [Usuario]
	}

	# Pedido
	type Pedido {
		id: ID
		pedido: [PedidoGrupo]
		total: Float
		cliente: Cliente # ya no retorna un ID
		vendedor: ID
		estado: String
		creado: String
	}

	type PedidoGrupo {
		id: ID
		cantidad: Int
		nombre: String
		precio: Float
	}

	input PedidoProductoInput {
		id: ID
		cantidad: Int
		nombre: String
		precio: Float
	}

	input PedidoInput {
		pedido: [PedidoProductoInput]
		total: Float
		cliente: ID!
		#vendedor: ID! el vendedor lo identificamos con el token
		estado: estadoPedido
	}
	enum estadoPedido {
		PENDIENTE
		COMPLETADO
		CANCELADO
	}

	#---------- Queries
	type Query {
		#Usuario
		#obtenerUsuario(token: String!): Usuario
		obtenerUsuario: Usuario

		#Producto
		obtenerProductos: [Producto]
		obtenerProducto(id: ID!): Producto

		#Cliente
		obtenerClientes: [Cliente]
		obtenerClientesVendedor: [Cliente]
		obtenerCliente(id: ID!): Cliente

		#Pedido
		obtenerPedidos: [Pedido]
		obtenerPedidosVendedor: [Pedido]
		obtenerPedido(id: ID!): Pedido
		obtenerPedidosEstado(estado: String!): [Pedido]

		# Búsquedas Avanzadas
		mejoresClientes: [TopCliente]
		mejoresVendedores: [TopVendedores]
		buscarProducto(texto: String!): [Producto]
	}
	

	##-------------------- Mutations

	# Creación de un nuevo usuario
	type Mutation {
		#Usuario
		createUser(input: UsuarioInput): Usuario
		login(input: AuthInput): Token

		#Producto
		nuevoProducto(input: ProductoInput): Producto
		actualizarProducto(id: ID!, input: ProductoInput): Producto
		eliminarProducto(id: ID!): String

		#Cliente
		nuevoCliente(input: ClienteInput): Cliente
		actualizarCliente(id: ID!, input: ClienteInput): Cliente
		eliminarCliente(id: ID!): String

		#Pedido
		nuevoPedido(input: PedidoInput): Pedido
		actualizarPedido(id: ID!, input: PedidoInput): Pedido
		eliminarPedido(id: ID!): String
	}
`;

module.exports = typeDefs;

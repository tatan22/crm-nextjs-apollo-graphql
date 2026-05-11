// Tiene todos los métodos de mongoose para la base de datos
const { Producto, Usuario, Cliente, Pedido } = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Crear el token
const createToken = (user, secret, expiresIn) => {
	console.log(user);
	const { _id, email, name, lastName } = user;
	return jwt.sign({ id: _id, email, name, lastName }, secret, { expiresIn }); //sing es para firmar el token`
};

const resolvers = {
	// =========================================
	// |							Queries                  |
	// =========================================

	Query: {
		// Usuarios

		obtenerUsuario: async (_, {}, ctx) => {
			// const usuarioId = await jwt.verify(token, process.env.SECRET);
			// return usuarioId;
			return ctx.usuario;
		},

		obtenerProductos: async () => {
			try {
				const productos = await Producto.find({});
				return productos;
			} catch (error) {
				console.log(error);
			}
		},

		obtenerProducto: async (_, { id }) => {
			try {
				const producto = await Producto.findById(id);

				if (!producto) {
					throw new Error("Producto no encontrado");
				}

				return producto;
			} catch (error) {
				console.log("ERROR REAL:", error.message);
				throw new Error("ID no válido o error en la consulta");
			}
		},

		// Clientes

		obtenerClientes: async () => {
			try {
				const clientes = await Cliente.find({});
				return clientes;
			} catch (error) {
				console.log(error);
			}
		},

		obtenerClientesVendedor: async (_, __, ctx) => {
			console.log(ctx);
			try {
				if (!ctx.usuario) {
					throw new Error("No autenticado");
				}
				console.log(ctx.usuario);
				const clientes = await Cliente.find({
					vendedor: ctx.usuario.id,
				});

				return clientes;
			} catch (error) {
				console.log(error);
				throw new Error("Error al obtener clientes");
			}
		},

		obtenerCliente: async (_, { id }, ctx) => {
			// revisar si el cliente existe o no
			const cliente = await Cliente.findById(id);
			if (!cliente) {
				throw new Error("El cliente no existe");
			}
			// Quien lo creo puede verlo
			if (cliente.vendedor.toString() !== ctx.usuario.id) {
				throw new Error("No tienes los permisos");
			}
			return cliente;
		},

		// Pedidos
		obtenerPedidos: async () => {
			try {
				const pedidos = await Pedido.find({});
				return pedidos;
			} catch (error) {
				console.log(error);
				throw new Error("Error al obtener los pedidos");
			}
		},

		// obtenerPedidosVendedor: async (_, __, ctx) => {
		obtenerPedidosVendedor: async (_, {}, ctx) => {
			try {
				const pedidos = await Pedido.find({ vendedor: ctx.usuario.id });
				return pedidos;
			} catch (error) {
				console.log(error);
				throw new Error("Error al obtener los pedidos");
			}
		},

		obtenerPedido: async (_, { id }, ctx) => {
			// revisar si el pedido existe o no
			const pedido = await Pedido.findById(id);
			if (!pedido) {
				throw new Error("El pedido no existe");
			}
			// Quien lo creo puede verlo
			if (pedido.vendedor.toString() !== ctx.usuario.id) {
				throw new Error("No tienes los permisos");
			}
			return pedido;
		},
		obtenerPedidosEstado: async (_, { estado }, ctx) => {
			try {
				const pedidos = await Pedido.find({
					vendedor: ctx.usuario.id,
					estado,
				});

				return pedidos;
			} catch (error) {
				console.log(error);
				throw new Error("Error al obtener los pedidos");
			}
		},

		// Búsqueda Avanzadas
		mejoresClientes: async () => {
			const clientes = await Pedido.aggregate([
				// donde aparece $ significa que es código de mongo
				{ $match: { estado: "COMPLETADO" } }, // match en mongo es como un where en sql
				{
					$group: {
						_id: "$cliente",
						total: { $sum: "$total" },
					},
				},
				//En MongoDB, el equivalente a un JOIN de SQL es $lookup
				//En MongoDB, el equivalente a un GROUP BY de SQL es $group
				{
					$lookup: {
						from: "clientes", // colección a unir
						localField: "_id", // campo actual (cliente)
						foreignField: "_id", // campo en la colección clientes
						as: "cliente", // nombre de la colección a unir
					},
				},
				{
					$sort: { total: -1 }, // Ordenar de mayor a menor
				},
			]);

			return clientes;
		},

		mejoresVendedores: async () => {
			const vendedores = await Pedido.aggregate([
				{ $match: { estado: "COMPLETADO" } },
				{
					$group: {
						_id: "$vendedor",
						total: { $sum: "$total" },
					},
				},
				{
					$lookup: {
						from: "usuarios",
						localField: "_id",
						foreignField: "_id",
						as: "vendedor",
					},
				},
				{
					$limit: 3,
				},
				{
					$sort: { total: -1 },
				},
			]);

			return vendedores;
		},
		buscarProducto: async (_, { texto }) => {
			texto = texto.toLowerCase();
			const productos = await Producto.find({
				$text: { $search: texto },
			}).limit(10);
			return productos;
		},
	},

	// =========================================
	// |							Mutaciones                |
	// =========================================

	Mutation: {
		// newUser: () => "Creando nuevo usuario",
		createUser: async (_, { input }) => {
			const { email, password } = input;
			// Revisar si el usuario ya existe
			const exitInUser = await Usuario.findOne({ email });
			if (exitInUser) {
				throw new Error("El usuario ya existe");
			}
			// Hasher su password
			const salt = await bcryptjs.genSalt(10);
			input.password = await bcryptjs.hash(password, salt);

			try {
				// Guardarlo en la base de datos
				const usuario = new Usuario(input);
				await usuario.save(); // Guarda el usuario en la base de datos
				return usuario;
			} catch (error) {
				console.log(error);
				throw new Error("Hubo un error");
			}
		},

		login: async (_, { input }) => {
			const { email, password } = input;

			// Si el usuario existe
			const exitInUser = await Usuario.findOne({ email });
			if (!exitInUser) {
				throw new Error("El usuario no existe");
			}

			// Comprobar si el password es correcto
			const correctPassword = await bcryptjs.compare(
				password,
				exitInUser.password,
			);
			if (!correctPassword) {
				throw new Error("El password es incorrecto");
			}
			return {
				token: createToken(exitInUser, process.env.SECRET, "1d"),
			};
		},

		nuevoProducto: async (_, { input }) => {
			try {
				const producto = new Producto(input);
				// Guardar en la base de datos
				const resultado = await producto.save();
				return resultado;
			} catch (error) {
				console.log("ERROR REAL:", error);
				throw new Error(error.message);
			}
		},

		actualizarProducto: async (_, { id, input }) => {
			let producto = await Producto.findById(id);
			if (!producto) {
				throw new Error("Producto no encontrado");
			}
			// Guardar en la base de datos
			producto = await Producto.findOneAndUpdate({ _id: id }, input, {
				new: true, //Retorna el producto actualizado
				//new: false, //Retorna el producto anterior
			});
			return producto;
		},

		eliminarProducto: async (_, { id }) => {
			const producto = await Producto.findById(id);
			if (!producto) {
				throw new Error("Producto no encontrado");
			}
			await Producto.findOneAndDelete({ _id: id });
			return "Producto Eliminado";
		},

		nuevoCliente: async (_, { input }, ctx) => {
			const { id: usuarioId } = ctx.usuario;
			// Verificar si el cliente ya esta registrado
			const { email } = input;
			const cliente = await Cliente.findOne({ email });
			if (cliente) {
				throw new Error("El cliente ya esta registrado");
			}
			const nuevoCliente = new Cliente(input);
			// Asignar el vendedor
			nuevoCliente.vendedor = usuarioId;

			try {
				// Guardar en la base de datos
				const resultado = await nuevoCliente.save();
				return resultado;
			} catch (error) {
				console.log("ERROR REAL:", error);
				throw new Error(error.message);
			}
		},

		actualizarCliente: async (_, { id, input }, ctx) => {
			// 🔥 Validar autenticación
			if (!ctx.usuario) {
				throw new Error("No autenticado");
			}

			let cliente = await Cliente.findById(id);
			if (!cliente) {
				throw new Error("El cliente no existe");
			}

			if (cliente.vendedor.toString() !== ctx.usuario.id) {
				throw new Error("No tienes los permisos");
			}

			cliente = await Cliente.findOneAndUpdate({ _id: id }, input, {
				new: true,
			});

			return cliente;
		},

		eliminarCliente: async (_, { id }, ctx) => {
			// VaLidar autenticación
			if (!ctx.usuario) {
				throw new Error("No autenticado");
			}
			const { id: usuarioId } = ctx.usuario;
			const cliente = await Cliente.findById(id);
			if (!cliente) {
				throw new Error("El cliente no existe");
			}
			if (cliente.vendedor.toString() !== usuarioId) {
				throw new Error("No tienes los permisos");
			}
			try {
				await Cliente.findOneAndDelete({ _id: id });
				return "Cliente Eliminado";
			} catch (error) {
				console.log(error);
				throw new Error("Hubo un error");
			}
		},

		nuevoPedido: async (_, { input }, ctx) => {
			const { cliente: clienteId, pedido } = input;

			// 1. Verificar cliente
			const clienteExiste = await Cliente.findById(clienteId);
			if (!clienteExiste) {
				throw new Error("El cliente no existe");
			}

			// 2. Verificar que el cliente pertenece al vendedor
			if (clienteExiste.vendedor.toString() !== ctx.usuario.id) {
				throw new Error("No tienes los permisos");
			}

			// 3. Verificar stock de TODOS los productos
			// No recomendado forEach
			// input.pedido.forEach(item => {{}}) | si aparece un error en alguno, y no es asíncrono, se rompe todo
			// for await (const item of input.pedido) {
			for (const item of pedido) {
				const { id, cantidad } = item;
				const producto = await Producto.findById(id);

				if (!producto) {
					throw new Error(`Producto no existe: ${id}`);
				}
				const { existencia: stockDisponible, nombre } = producto;

				if (stockDisponible < cantidad) {
					throw new Error(`Stock insuficiente para ${nombre}`);
				}
				// Actualizar stock
				producto.existencia -= item.cantidad;
				await producto.save();
			}

			// 4. Crear pedido
			const nuevoPedido = new Pedido(input);

			// 5. Asignar relaciones
			nuevoPedido.vendedor = ctx.usuario.id;
			nuevoPedido.cliente = clienteId;

			try {
				const resultado = await nuevoPedido.save();
				return resultado;
			} catch (error) {
				console.log("ERROR REAL:", error);
				throw new Error(error.message);
			}
		},

		//Pedidos
		actualizarPedido: async (_, { id, input }, ctx) => {
			// 🔥 Validar autenticación
			if (!ctx.usuario) {
				throw new Error("No autenticado");
			}
			// Validar si el pedido existe
			let pedido = await Pedido.findById(id);
			if (!pedido) {
				throw new Error("El pedido no existe");
			}

			// validar si el cliente existe
			const { cliente } = pedido;
			const clienteExiste = await Cliente.findById(cliente);
			if (!clienteExiste) {
				throw new Error("El cliente no existe");
			}

			// Validar si el pedido pertenece al vendedor
			if (pedido.vendedor.toString() !== ctx.usuario.id) {
				throw new Error("No tienes los permisos");
			}

			// 3. Verificar stock de TODOS los productos
			if (input.pedido) {
				for (const item of pedido) {
					const { id, cantidad } = item;
					const producto = await Producto.findById(id);

					if (!producto) {
						throw new Error(`Producto no existe: ${id}`);
					}
					const { existencia: stockDisponible, nombre } = producto;

					if (stockDisponible < cantidad) {
						throw new Error(`Stock insuficiente para ${nombre}`);
					}
					// Actualizar stock
					producto.existencia -= item.cantidad;
					await producto.save();
				}
			}

			// Actualizar
			pedido = await Pedido.findOneAndUpdate({ _id: id }, input, {
				new: true,
			});

			return pedido;
		},

		eliminarPedido: async (_, { id }, ctx) => {
			// VaLidar autenticación
			if (!ctx.usuario) {
				throw new Error("No autenticado");
			}
			const { id: usuarioId } = ctx.usuario;
			const pedido = await Pedido.findById(id);
			if (!pedido) {
				throw new Error("El pedido no existe");
			}
			// Recordar que el vendedor se guarda como objetId
			if (pedido.vendedor.toString() !== usuarioId) {
				throw new Error("No tienes los permisos");
			}
			try {
				await Pedido.findOneAndDelete({ _id: id });
				return "Pedido Eliminado";
			} catch (error) {
				console.log(error);
				throw new Error("Hubo un error");
			}
		},
	},
};

module.exports = resolvers;

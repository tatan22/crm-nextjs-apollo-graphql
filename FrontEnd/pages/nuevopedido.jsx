import { useContext, useState } from "react";
import Layout from "../components/Layout";
import AsignarCliente from "../components/pedidos/AsignarCliente";
import AsignarProductos from "../components/pedidos/AsignarProductos";
import ResumenPedido from "../components/pedidos/ResumenPedido";
import Total from "../components/pedidos/Total";
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const NUEVO_PEDIDO = gql`
	mutation nuevoPedido($input: PedidoInput) {
		nuevoPedido(input: $input) {
			id
			pedido {
				id
				cantidad
				nombre
			}
			cliente {
				id
				nombre
				apellido
				email
				telefono
			}
			vendedor
			total
			estado
		}
	}
`;

const OBTENER_PEDIDOS = gql`
	query obtenerPedidosVendedor {
		obtenerPedidosVendedor {
			id
		}
	}
`;

// Context de pedidos
import PedidoContext from "../context/pedidos/PedidoContext";

const NuevoPedido = () => {
	const [mensaje, setMensaje] = useState(null);

	// Utilizar context y extraer sus funciones y valores
	const pedidoContext = useContext(PedidoContext);
	const { cliente, productos, total } = pedidoContext;

	// Mutation
	const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
		update(cache, { data: { nuevoPedido } }) {
			try {
				const data = cache.readQuery({
					query: OBTENER_PEDIDOS,
				});

				if (data?.obtenerPedidosVendedor) {
					cache.writeQuery({
						query: OBTENER_PEDIDOS,
						data: {
							obtenerPedidosVendedor: [
								...data.obtenerPedidosVendedor,
								nuevoPedido,
							],
						},
					});
				}
			} catch (error) {
				console.log(error);
			}
		},
	});

	//Validar Pedido
	const validarPedido = () => {
		// Con every se valida si todos los productos tienen una cantidad mayor a 0
		return !productos.every((producto) => producto.cantidad > 0) ||
			total <= 0 ||
			!cliente
			? " opacity-50 cursor-not-allowed "
			: "";
	};
	const router = useRouter();
	const crearNuevoPedido = async () => {
		// Remover datos innecesarios de pedidos
		// const productos = pedidoContext.productos.map(({ __typename, nombre, precio, existencia, ...producto }) => producto);
		// const productos = pedidoContext.productos.map(({ id, cantidad}) => ({ id, cantidad}));
		const pedido = pedidoContext.productos.map(
			({ __typename, existencia, ...producto }) => producto,
		);

		try {
			const { id: clienteId } = cliente;
			const { data } = await nuevoPedido({
				variables: {
					input: {
						cliente: clienteId,
						total,
						pedido,
					},
				},
			});
			await Swal.fire({
				title: "Correcto",
				text: "El pedido se ha creado correctamente",
				icon: "success",
			});

			// Redireccionar
			router.push("/pedidos");
		} catch (error) {
			const mensajeError =
				error.graphQLErrors?.[0]?.message || error.message || "Hubo un error";

			Swal.fire({
				title: "Error",
				text: mensajeError,
				icon: "error",
			});
		}
	};

	// const mostrarMensaje = () => {
	// 	return (
	// 		<div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
	// 			<p>{mensaje}</p>
	// 		</div>
	// 	);
	// };

	return (
		<Layout>
			<h1 className="text-2xl text-gray-800 font-light">Crear Nuevo Pedido</h1>
			{/* {mensaje && mostrarMensaje()} */}
			<div className="flex justify-center mt-5">
				<div className="w-full max-w-lg">
					<AsignarCliente />
					<AsignarProductos />
					<ResumenPedido />
					<Total />
					<button
						type="button"
						disabled={validarPedido()}
						className={`${validarPedido() ? "opacity-50 cursor-not-allowed " : ""} mt-5 p-2 bg-gray-700 w-full text-white uppercase font-bold hover:bg-gray-900 transition-colors`}
						onClick={() => crearNuevoPedido()}
					>
						Nuevo Pedido
					</button>
				</div>
			</div>
		</Layout>
	);
};

export default NuevoPedido;

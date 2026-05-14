import { useReducer } from "react";
import PedidoContext from "./PedidoContext";
import PedidoReducer from "./PedidoReducer";
import {
	SELECCIONAR_CLIENTE,
	SELECCIONAR_PRODUCTO,
	CANTIDAD_PRODUCTO,
	ACTUALIZAR_TOTAL,
} from "../../types";

const PedidoState = ({ children }) => {
	//State de Pedidos
	const initialState = {
		cliente: {},
		productos: [],
		total: 0,
	};
	const [state, dispatch] = useReducer(PedidoReducer, initialState);
	//Modifica el CLiente

	const agregarCliente = (cliente) => {
		dispatch({
			type: SELECCIONAR_CLIENTE, //action
			payload: cliente, //payload- Lo que se envía
		});
	};

	// Modifica los productos
const agregarProducto = (productosSeleccionados) => {

	const productosState = [...state.productos];

	const nuevoState = productosSeleccionados.map(producto => {

		const productoState = productosState.find(
			prod => prod.id === producto.id
		);

		return {
			...producto,
			cantidad: productoState
				? productoState.cantidad
				: 1
		};
	});

	dispatch({
		type: SELECCIONAR_PRODUCTO,
		payload: nuevoState,
	});
};

	// Modifica la cantidad del producto
	const cantidadProducto = (productos) => {
		dispatch({
			type: CANTIDAD_PRODUCTO,
			payload: productos,
		});
	};

	const actualizarTotal = () => {
		dispatch({
			type: ACTUALIZAR_TOTAL,
		});
	};

	return (
		<PedidoContext.Provider
			value={{
				//State
				cliente: state.cliente,
				productos: state.productos,
				total: state.total,
				//Métodos
				agregarCliente,
				agregarProducto,
				cantidadProducto,
				actualizarTotal,
			}}
		>
			{children}
		</PedidoContext.Provider>
	);
};

export default PedidoState;

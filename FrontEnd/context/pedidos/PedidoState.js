import { useReducer } from "react";
import PedidoContext from "./PedidoContext";
import PedidoReducer from "./PedidoReducer";
import {
	SELECCIONAR_CLIENTE,
	SELECCIONAR_PRODUCTO,
	CANTIDAD_PRODUCTO,
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
	const agregarProducto = (productos) => {
		dispatch({
			type: SELECCIONAR_PRODUCTO,
			payload: productos,
		});
	};

	// Modifica la cantidad del producto
	const cantidadProducto = (nuevoProducto) => {
		dispatch({
			type: CANTIDAD_PRODUCTO,
			payload: nuevoProducto,
		});
	};

	return (
		<PedidoContext.Provider
			value={{
				//State
				productos: state.productos,
				//Métodos
				agregarCliente,
				agregarProducto,
				cantidadProducto,
			}}
		>
			{children}
		</PedidoContext.Provider>
	);
};

export default PedidoState;

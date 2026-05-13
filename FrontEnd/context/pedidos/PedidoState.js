import { useReducer } from "react";
import PedidoContext from "./PedidoContext";
import PedidoReducer from "./PedidoReducer";
import {
	SELECCIONAR_CLIENTE,
	SELECCIONAR_PRODUCTO,
	CANTIDAd_PRODUCTO,
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

	const agregarCliente = cliente => {
		dispatch({
			type: SELECCIONAR_CLIENTE,//action
			payload: cliente,//payload- Lo que se envia
		});
	};

	const agregarProducto = producto => {
		dispatch({
			type: SELECCIONAR_PRODUCTO,
			payload: producto,
		});
	};
		

	return (
		<PedidoContext.Provider value={{
			agregarCliente
		}}>
			{children}
		</PedidoContext.Provider>
	);
};

export default PedidoState;

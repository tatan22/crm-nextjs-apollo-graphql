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
		cliente: [],
		productos: [],
		total: 0,
	};
	const [state, dispatch] = useReducer(PedidoReducer, initialState);

	const holaMundo = () => {
		console.log("hola mundo en useReducer");
	};

	return (
		<PedidoContext.Provider value={{ holaMundo }}>
			{children}
		</PedidoContext.Provider>
	);
};

export default PedidoState;

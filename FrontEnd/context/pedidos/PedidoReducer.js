import {
	SELECCIONAR_CLIENTE,
	SELECCIONAR_PRODUCTO,
	CANTIDAd_PRODUCTO,
} from "../../types";

export default (state, action) => {
	switch (action.type) {
		case SELECCIONAR_CLIENTE:
			return {
				...state,
				cliente: action.payload,
			};
		case SELECCIONAR_PRODUCTO:
			return {
				...state,
				productos: action.payload,
			};
		case CANTIDAd_PRODUCTO:
			return {
				...state,
				productos: state.productos.map((producto) =>
					producto.id === action.payload.id ? action.payload : producto,
				),
			};
		default:
			return state;
	}
};

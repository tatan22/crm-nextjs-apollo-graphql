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
		default:
			return state;
	}
};

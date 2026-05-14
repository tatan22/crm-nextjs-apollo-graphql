import { useContext } from "react";
import PedidoContext from "../../context/pedidos/PedidoContext";
const Total = () => {
	const pedidoContext = useContext(PedidoContext);
	const Total = pedidoContext.total;
	return (
		<div className=" flex items-center mt-5 justify-between bg-white  p-2">
			{" "}
			<h2 className="text-gray-800 text-lg">Total a Pagar</h2>
			<p className="text-gray-800 mt-0">${Total}</p>
		</div>
	);
};

export default Total;

import { useContext } from "react";
import Layout from "../components/Layout";
import AsignarCliente from "../components/pedidos/AsignarCliente";
// Context de pedidos
import PedidoContext from "../context/pedidos/PedidoContext";

const NuevoPedido = () => {
	// Utilizar context y extraer sus funciones y valores
	const pedidoContext = useContext(PedidoContext);
	const { holaMundo } = pedidoContext;
  holaMundo();
	return (
		<Layout>
			<h1 className="text-2xl text-gray-800 font-light">Crear Nuevo Pedido</h1>
			<AsignarCliente />
		</Layout>
	);
};

export default NuevoPedido;

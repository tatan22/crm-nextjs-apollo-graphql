import { useContext } from "react";
import Layout from "../components/Layout";
import AsignarCliente from "../components/pedidos/AsignarCliente";
import AsignarProductos from "../components/pedidos/AsignarProductos";
import ResumenPedido from "../components/pedidos/ResumenPedido";
import Total from "../components/pedidos/Total";
// Context de pedidos
import PedidoContext from "../context/pedidos/PedidoContext";

const NuevoPedido = () => {
	// Utilizar context y extraer sus funciones y valores
	const pedidoContext = useContext(PedidoContext);

	return (
		<Layout>
			<h1 className="text-2xl text-gray-800 font-light">Crear Nuevo Pedido</h1>
			<div className="flex justify-center mt-5">
				<div className="w-full max-w-lg">
					<AsignarCliente />
					<AsignarProductos />
          <ResumenPedido />
          <Total />
          <button
            type="button"
            className={`mt-5 p-2 bg-gray-700 w-full text-white uppercase font-bold hover:bg-gray-900 transition-colors`}
            onClick={() => pedidoContext.nuevoPedido()}
          >
            Nuevo Pedido
          </button>
				</div>
			</div>
		</Layout>
	);
};

export default NuevoPedido;

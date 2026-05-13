import { useContext, useState, useEffect } from "react";
import PedidoContext from "../context/pedidos/PedidoContext";
const ProductoResumen = ({ producto }) => {
	const [cantidad, setCantidad] = useState(0);

	const pedidoContext = useContext(PedidoContext);
	const { cantidadProducto } = pedidoContext;
	
	useEffect(() => {
		actualizarCantidad();
	}, [cantidad]);
	
	const actualizarCantidad = () => {
		const nuevoProducto = { ...producto, cantidad };
		cantidadProducto(nuevoProducto);
	};
	
	const { nombre, precio } = producto;
	return (
		<div className="md:flex md:justify-between md:items-center mt-5">
			<div className="md:w-2/4 mb-2 md:mb-0">
				<p className="text-sm">{nombre}</p>
				<p className="">$ {precio}</p>
			</div>
			<input
				type="number"
				placeholder="Cantidad"
				className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				onChange={(e) => setCantidad(parseInt(e.target.value))}
				value={cantidad}
			/>
		</div>
	);
};

export default ProductoResumen;

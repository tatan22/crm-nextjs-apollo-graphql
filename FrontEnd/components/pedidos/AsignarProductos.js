import { useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import PedidoContext from "../../context/pedidos/PedidoContext";

import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select"), {
	ssr: false,
});

const OBTENER_PRODUCTOS = gql`
	query obtenerProductos {
		obtenerProductos {
			id
			nombre
			precio
			existencia
		}
	}
`;

const AsignarProductos = () => {

	// Context
	const pedidoContext = useContext(PedidoContext);
	const { agregarProducto } = pedidoContext;

	// Query
	const { data, loading } = useQuery(OBTENER_PRODUCTOS);

	// Seleccionar productos
	const seleccionarProductos = (productos) => {
		agregarProducto(productos);
	};

	// Loading
	if (loading) return null;

	// Validar data
	if (!data.obtenerProductos) return null;

	const { obtenerProductos } = data;

	return (
		<>
			<p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">
				2. Selecciona o Busca los Productos
			</p>

			<Select
				isMulti
				options={obtenerProductos}
				onChange={(options) => seleccionarProductos(options)}
				className="mt-3"
				getOptionValue={(options) => options.id}
				getOptionLabel={(options) =>
					`${options.nombre} - ${options.existencia} / Und Disponibles`
				}
				placeholder="Busque o seleccione un producto"
				noOptionsMessage={() => "No hay resultados"}
			/>
		</>
	);
};

export default AsignarProductos;
import { useEffect, useState, useContext } from "react";
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
	// State del componente
	const [productos, setProductos] = useState([]);

  // Context de pedidos
  const pedidoContext = useContext(PedidoContext);
  const { agregarProducto } = pedidoContext;

	// Consulta a la base de datos
	const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

	// Prevenir render antes de tener datos
	useEffect(() => {
		//todo: Funcion para pasar a pedidostate
    agregarProducto(productos);
	}, [productos]);

	const seleccionarProductos = (productos) => {
    setProductos(productos);
	};

	// prevenir render antes de tener datos
	if (loading) return null;

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

import React, { useState, useEffect, useContext } from "react";
// import Select from "react-select";
import {gql, useQuery} from "@apollo/client";
import dynamic from "next/dynamic";
import PedidoContext from "../../context/pedidos/PedidoContext";

const Select = dynamic(() => import("react-select"), {
	ssr: false,
});

// const clientes = [
// 	{ id: 1, nombre: "Jhonatan" },
// 	{ id: 2, nombre: "Mariana" },
// 	{ id: 3, nombre: "Pedro" },
// ];

const OBTENER_CLIENTES_USUARIOS = gql`
	query obtenerClientesVendedor {
		obtenerClientesVendedor {
			id
			nombre
			apellido
			empresa
			email
		}
	}
`;

export default function AsignarCliente() {

	const [cliente, setCliente] = useState([]);
	
	// Context de Pedido
	const pedidoContext = useContext(PedidoContext);
	const { agregarCliente } = pedidoContext;

	const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIOS);

	// prevenir render antes de tener datos
	
	
	useEffect(() => {
		agregarCliente(cliente);
	}, [cliente]);

	if (loading) return <p>Cargando...</p>;
	
	if (!data.obtenerClientesVendedor) return null;

	const seleccionaSabor = (cliente) => {
		setCliente(cliente);
	};
	
	// Resultados de la Consulta
	const { obtenerClientesVendedor } = data;
	return (
		<>
			<p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1. Asignar Cliente al pedido</p>
			<Select
				options={obtenerClientesVendedor} // Solo recibe value y label
				// isMulti
				onChange={(options) => seleccionaSabor(options)}
				className="mt-3"
				// ⬇ Si quiero mostrar valores diferentes a value
				getOptionValue={(options) => options.id}
				// ⬇ Si quiero mostrar valores diferentes a label
				getOptionLabel={(options) => options.nombre}
				placeholder="Busque o seleccione un cliente"
				noOptionsMessage={() => "No hay resultados"}
			/>
		</>
	);
}

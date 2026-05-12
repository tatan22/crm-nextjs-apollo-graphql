import React, { useState, useEffect } from "react";
import Select from "react-select";

// const options = [
// 	{ value: "chocolate", label: "Chocolate" },
// 	{ value: "strawberry", label: "Strawberry" },
// 	{ value: "vanilla", label: "Vanilla" },
// ];
const clientes = [
	{ id: 1, nombre: "Jhonatan" },
	{ id: 2, nombre: "Mariana" },
	{ id: 3, nombre: "Pedro" },
];



export default function AsignarCliente() {
	const [cliente, setCliente] = useState([]);

	useEffect(() => {
		console.log(cliente);
	}, [cliente]);

	const seleccionaSabor = (cliente) => {
		setCliente(cliente);
	};
	return (
		<Select
			options={clientes} // Solo recibe value y label
			isMulti
			onChange={( options) => seleccionaSabor(options)}
			className="mt-5"
			// ⬇ Si quiero mostrar valores diferentes a value
			getOptionValue={(options) => options.id}
			// ⬇ Si quiero mostrar valores diferentes a label
			getOptionLabel={(options) => options.nombre}
			placeholder="Busque o seleccione un cliente"
			noOptionsMessage={() => "No hay resultados"}
		/>
	);
}

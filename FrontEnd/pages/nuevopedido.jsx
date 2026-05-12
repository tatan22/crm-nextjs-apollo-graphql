import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Select from "react-select";

// const options = [
// 	{ value: "chocolate", label: "Chocolate" },
// 	{ value: "strawberry", label: "Strawberry" },
// 	{ value: "vanilla", label: "Vanilla" },
// ];
const options = [
	{ id: "chocolate", nombre: "Chocolate" },
	{ id: "strawberry", nombre: "Strawberry" },
	{ id: "vanilla", nombre: "Vanilla" },
];

const NuevoPedido = () => {
	const [sabores, setSabores] = useState([]);

	useEffect(() => {
		console.log(sabores);
	}, [sabores]);

	const seleccionaSabor = (sabor) => {
		setSabores([...sabores, sabor]);
	};

	return (
		<Layout>
			<h1 className="text-2xl text-gray-800 font-light">Crear Nuevo Pedido</h1>
			{/* Formulario con el uso de React Select */}

			<Select
				options={options} // Solo recibe value y label
				isMulti
				onChange={(options) => seleccionaSabor(options)}
				className="mt-5"
				// ⬇ Si quiero mostrar valores diferentes a value
				getOptionValue={(options) => options.id}
				// ⬇ Si quiero mostrar valores diferentes a label
				getOptionLabel={(options) => options.nombre}
				placeholder="Selecciona sabor"
				noOptionsMessage={() => "No hay resultados"}
			/>
		</Layout>
	);
};

export default NuevoPedido;

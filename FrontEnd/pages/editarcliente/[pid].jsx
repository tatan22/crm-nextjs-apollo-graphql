import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const OBTENER_CLIENTE = gql`
	query obtenerCliente($id: ID!) {
		obtenerCliente(id: $id) {
			nombre
			apellido
			empresa
			email
			telefono
		}
	}
`;

const ACTUALIZAR_CLIENTE = gql`
	mutation actualizarCliente($id: ID!, $input: ClienteInput) {
		actualizarCliente(id: $id, input: $input) {
			nombre
			email
		}
	}
`;

const EditarCliente = () => {
	const router = useRouter();
	const { pid: id } = router.query; // Obtener el ID del cliente desde la URL

	const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
		variables: { id },
		skip: !id, // Evitar ejecutar la consulta si el ID no está disponible
	});

	// Actualizar cliente
	const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE);

	if (!id || loading) return <p>Cargando...</p>;
	if (error) return <p>Error: {error.message}</p>;

	//Schema de validación
	const schemaValidacion = Yup.object({
		nombre: Yup.string()
			.min(3, "El nombre debe tener al menos 3 caracteres")
			.max(20, "El nombre no puede tener más de 20 caracteres")
			.trim()
			.required("El nombre es obligatorio"),
		apellido: Yup.string()
			.min(3, "El apellido debe tener al menos 3 caracteres")
			.max(20, "El apellido no puede tener más de 20 caracteres")
			.trim()
			.required("El apellido es obligatorio"),
		empresa: Yup.string()
			.min(3, "La empresa debe tener al menos 3 caracteres")
			.max(20, "La empresa no puede tener más de 20 caracteres")
			.trim()
			.required("La empresa es obligatoria"),
		email: Yup.string()
			.email("El email no es valido")
			.required("El email es obligatorio"),
		telefono: Yup.string()
			.min(10, "El teléfono debe tener al menos 10 caracteres")
			.max(15, "El teléfono no puede tener más de 15 caracteres")
			.trim(),
	});

	// Modificar el cliente de la BD
	const actualizarInfoCliente = async (values, _actions) => {
		// const { nombre, apellido, empresa, email, telefono } = values;
		try {
			const { data } = await actualizarCliente({
				variables: {
					id,
					input: values,
				},
			});

			Swal.fire({
				title: "Actualizado!",
				text: `El cliente ${data.actualizarCliente.nombre} se actualizó correctamente`,
				icon: "success",
			});
			router.push("/");
		} catch (error) {
			Swal.fire({
				title: "Error!",
				text: error.message.replace("GraphQL error: ", ""),
				icon: "error",
			});

			console.log("Error al actualizar cliente: ", error);
		}
	};

	return (
		<Layout>
			<div>
				<h1 className="text-2xl text-gray-800 font-light">Editar Cliente</h1>
				<div className="flex justify-center mt-10">
					<div className="w-full max-w-lg">
						<Formik
							enableReinitialize
							initialValues={{
								nombre: data?.obtenerCliente?.nombre || "",
								apellido: data?.obtenerCliente?.apellido || "",
								empresa: data?.obtenerCliente?.empresa || "",
								email: data?.obtenerCliente?.email || "",
								telefono: data?.obtenerCliente?.telefono || "",
							}}
							validationSchema={schemaValidacion}
							/**
							 * @values Contiene los valores del formulario
							 * @actions Contiene las acciones de Formik, como resetForm, setSubmitting, etc.
							 */

							onSubmit={async (values, actions) => {
								actualizarInfoCliente(values, actions);
							}}
						>
							{(props) => {
								return (
									<form
										className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
										onSubmit={props.handleSubmit}
									>
										<div className="mb-4">
											<label
												className="block text-gray-700 text-sm font-bold mb-2"
												htmlFor="nombre"
											>
												Nombre
											</label>
											<input
												className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
												type="text"
												placeholder="Nombre Cliente"
												id="nombre"
												value={props.values.nombre}
												onChange={props.handleChange}
												onBlur={props.handleBlur}
											/>
										</div>
										{props.touched.nombre && props.errors.nombre ? (
											<div
												className="bg-red-100 border border-l-4 border-red-00 text-red-700 px-4 py-3 rounded relative mb-4"
												role="alert"
											>
												<strong className="font-bold">Error: </strong>
												<span className="block sm:inline">
													{props.errors.nombre}
												</span>
											</div>
										) : null}

										<div className="mb-4">
											<label
												className="block text-gray-700 text-sm font-bold mb-2"
												htmlFor="apellido"
											>
												Apellido
											</label>
											<input
												className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
												type="text"
												placeholder="Apellido Cliente"
												id="apellido"
												value={props.values.apellido}
												onChange={props.handleChange}
												onBlur={props.handleBlur}
											/>
										</div>
										{props.touched.apellido && props.errors.apellido ? (
											<div
												className="bg-red-100 border border-l-4 border-red-00 text-red-700 px-4 py-3 rounded relative mb-4"
												role="alert"
											>
												<strong className="font-bold">Error: </strong>
												<span className="block sm:inline">
													{props.errors.apellido}
												</span>
											</div>
										) : null}

										<div className="mb-4">
											<label
												className="block text-gray-700 text-sm font-bold mb-2"
												htmlFor="empresa"
											>
												Empresa
											</label>
											<input
												className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
												type="text"
												placeholder="Nombre de la empresa"
												id="empresa"
												value={props.values.empresa}
												onChange={props.handleChange}
												onBlur={props.handleBlur}
											/>
										</div>
										{props.touched.empresa && props.errors.empresa ? (
											<div
												className="bg-red-100 border border-l-4 border-red-00 text-red-700 px-4 py-3 rounded relative mb-4"
												role="alert"
											>
												<strong className="font-bold">Error: </strong>
												<span className="block sm:inline">
													{props.errors.empresa}
												</span>
											</div>
										) : null}

										<div className="mb-4">
											<label
												className="block text-gray-700 text-sm font-bold mb-2"
												htmlFor="email"
											>
												Email
											</label>
											<input
												className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
												type="email"
												placeholder="Email Cliente"
												id="email"
												value={props.values.email}
												onChange={props.handleChange}
												onBlur={props.handleBlur}
											/>
										</div>
										{props.touched.email && props.errors.email ? (
											<div
												className="bg-red-100 border border-l-4 border-red-00 text-red-700 px-4 py-3 rounded relative mb-4"
												role="alert"
											>
												<strong className="font-bold">Error: </strong>
												<span className="block sm:inline">
													{props.errors.email}
												</span>
											</div>
										) : null}

										<div className="mb-4">
											<label
												className="block text-gray-700 text-sm font-bold mb-2"
												htmlFor="telefono"
											>
												Teléfono
											</label>
											<input
												className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
												type="tel"
												placeholder="telefono Cliente"
												id="telefono"
												value={props.values.telefono}
												onChange={props.handleChange}
												onBlur={props.handleBlur}
											/>
										</div>
										{props.touched.telefono && props.errors.telefono ? (
											<div
												className="bg-red-100 border border-l-4 border-red-00 text-red-700 px-4 py-3 rounded relative mb-4"
												role="alert"
											>
												<strong className="font-bold">Error: </strong>
												<span className="block sm:inline">
													{props.errors.telefono}
												</span>
											</div>
										) : null}

										<div className="mt-8">
											<input
												className="bg-gray-800 w-full text-white font-bold py-2 px-4 rounded 
                hover:bg-gray-700 transition-colors duration-200 
                cursor-pointer"
												type="submit"
												value="Editar Cliente"
											/>
										</div>
									</form>
								);
							}}
						</Formik>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default EditarCliente;

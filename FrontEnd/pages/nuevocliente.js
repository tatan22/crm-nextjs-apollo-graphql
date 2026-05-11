import { useState } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

// ✅ QUERY (la puedes exportar)
export const OBTENER_CLIENTES_USUARIOS = gql`
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

// ✅ MUTATION (ESTO TE FALTABA)
const NUEVO_CLIENTE = gql`
	mutation nuevoCliente($input: ClienteInput) {
		nuevoCliente(input: $input) {
			id
			nombre
			apellido
			empresa
			email
		}
	}
`;

const NuevoCliente = () => {
	const router = useRouter();
	const [mensaje, setMensaje] = useState(null);
	const [crearCliente] = useMutation(NUEVO_CLIENTE, {
		update(cache, { data: { nuevoCliente } }) {
			try {
				const data = cache.readQuery({
					query: OBTENER_CLIENTES_USUARIOS,
				});

				if (!data) return;

				cache.writeQuery({
					query: OBTENER_CLIENTES_USUARIOS,
					data: {
						obtenerClientesVendedor: [
							...data.obtenerClientesVendedor,
							nuevoCliente,
						],
					},
				});
			} catch (error) {
				// 🔥 si no existe en cache, no haces nada
				console.log("No estaba en cache");
			}
		},
	});

	const formik = useFormik({
		initialValues: {
			nombre: "",
			apellido: "",
			empresa: "",
			email: "",
			telefono: "",
		},
		validationSchema: Yup.object({
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
		}),
		onSubmit: async (values) => {
			const { nombre, apellido, empresa, email, telefono } = values;
			try {
				const { data } = await crearCliente({
					variables: {
						input: {
							nombre,
							apellido,
							empresa,
							email,
							telefono,
						},
					},
				});
				setMensaje({
					title: "Exito",
					text: "Cliente creado correctamente",
					success: true,
				});
				setTimeout(() => {
					setMensaje(null);
				}, 3000);
				router.push("/");
			} catch (error) {
				console.log(error);
				setMensaje({
					title: "Error",
					text: error.message.replace("GraphQL error: ", ""),
					success: false,
				});
				setTimeout(() => {
					setMensaje(null);
				}, 3000);
			}
		},
	});
	const mostrarMensaje = () => {
		return (
			<div
				className={`max-w-sm text-center mx-auto px-4 py-3 rounded relative mb-4 
					${
						mensaje.success
							? "bg-green-100 border border-l-4 border-green-400 text-green-700"
							: "bg-red-100 border border-l-4 border-red-400 text-red-700"
					}`}
				role="alert"
			>
				<p className="font-bold">{mensaje.title}</p>
				<p>{mensaje.text}</p>
			</div>
		);
	};

	return (
		<Layout>
			<div>
				<h1 className="text-2xl text-gray-800 font-light">Nuevo Cliente</h1>
				{mensaje && mostrarMensaje()}
				<div className="flex justify-center mt-10">
					<div className="w-full max-w-lg">
						<form
							className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
							onSubmit={formik.handleSubmit}
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
									value={formik.values.nombre}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
							</div>
							{formik.touched.nombre && formik.errors.nombre ? (
								<div
									className="bg-red-100 border border-l-4 border-red-00 text-red-700 px-4 py-3 rounded relative mb-4"
									role="alert"
								>
									<strong className="font-bold">Error: </strong>
									<span className="block sm:inline">
										{formik.errors.nombre}
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
									value={formik.values.apellido}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
							</div>
							{formik.touched.apellido && formik.errors.apellido ? (
								<div
									className="bg-red-100 border border-l-4 border-red-00 text-red-700 px-4 py-3 rounded relative mb-4"
									role="alert"
								>
									<strong className="font-bold">Error: </strong>
									<span className="block sm:inline">
										{formik.errors.apellido}
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
									value={formik.values.empresa}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
							</div>
							{formik.touched.empresa && formik.errors.empresa ? (
								<div
									className="bg-red-100 border border-l-4 border-red-00 text-red-700 px-4 py-3 rounded relative mb-4"
									role="alert"
								>
									<strong className="font-bold">Error: </strong>
									<span className="block sm:inline">
										{formik.errors.empresa}
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
									value={formik.values.email}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
							</div>
							{formik.touched.email && formik.errors.email ? (
								<div
									className="bg-red-100 border border-l-4 border-red-00 text-red-700 px-4 py-3 rounded relative mb-4"
									role="alert"
								>
									<strong className="font-bold">Error: </strong>
									<span className="block sm:inline">{formik.errors.email}</span>
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
									value={formik.values.telefono}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								/>
							</div>
							{formik.touched.telefono && formik.errors.telefono ? (
								<div
									className="bg-red-100 border border-l-4 border-red-00 text-red-700 px-4 py-3 rounded relative mb-4"
									role="alert"
								>
									<strong className="font-bold">Error: </strong>
									<span className="block sm:inline">
										{formik.errors.telefono}
									</span>
								</div>
							) : null}

							<div className="mt-8">
								<input
									className="bg-gray-800 w-full text-white font-bold py-2 px-4 rounded 
                hover:bg-gray-700 transition-colors duration-200 
                cursor-pointer"
									type="submit"
									value="Registrar Cliente"
								/>
							</div>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default NuevoCliente;

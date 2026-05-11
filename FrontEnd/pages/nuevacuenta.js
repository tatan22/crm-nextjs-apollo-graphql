import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, gql } from "@apollo/client";

//gql es un template literal tag que convierte una consulta GraphQL en un AST (estructura interna) que Apollo puede interpretar.
const NUEVA_CUENTA = gql`
	mutation createUser($input: UsuarioInput) {
		createUser(input: $input) {
			id
			name
			lastName
			email
		}
	}
`;

const NuevaCuenta = () => {
	//State para el mensaje
	const [mensaje, setMensaje] = useState(null);
	// Mutation para crear nuevos usuarios en la base de datos con array destructuring
	const [crearUsuario, { loading, error, data }] = useMutation(NUEVA_CUENTA);
	// Routing
	const router = useRouter();

	//Validación del formulario
	const formik = useFormik({
		// Initial values
		initialValues: {
			nombre: "",
			apellido: "",
			email: "",
			password: "",
		},
		// Validation schema
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
			email: Yup.string()
				.trim()
				.email("Email no válido")
				.required("El email es obligatorio"),
			password: Yup.string()
				.min(6, "La contraseña debe tener al menos 6 caracteres")
				.required("La contraseña es obligatoria"),
		}),
		// On submit
		onSubmit: async (values) => {
			console.log("Enviando formulario");
			console.log(values);
			try {
				const { data } = await crearUsuario({
					variables: {
						input: {
							name: values.nombre,
							lastName: values.apellido,
							email: values.email,
							password: values.password,
						},
					},
				});
				console.log("Usuario creado:", data);
				setMensaje({
					title: "Exito",
					text: "Usuario creado correctamente",
					success: true,
				});
				setTimeout(() => {
					setMensaje(null);
				}, 3000);
				// Redirigir al usuario a la página de login después de crear la cuenta
				router.push("/login");
			} catch (error) {
				setMensaje({
					title: "Error",
					text: error.message.replace("GraphQL error: ", ""),
					success: false,
				});
				setTimeout(() => {
					setMensaje(null);
				}, 3000);
				console.error("Error al crear usuario:", error);
			}
		},
	});

	const [show, setShow] = useState(false);
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
			<h1 className="text-center text-2xl text-white font-light">
				Crear Nueva Cuenta
			</h1>
			{mensaje && mostrarMensaje()}
			<div className="flex justify-center mt-5">
				<div className="w-full max-w-sm ">
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
								placeholder="Tu nombre"
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
								<span className="block sm:inline">{formik.errors.nombre}</span>
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
								placeholder="Tu apellido"
								id="apellido"
								value={formik.values.apellido}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
							/>
						</div>

						{formik.touched.apellido && formik.errors.apellido ? (
							<div
								className="bg-red-100 border border-l-4 border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
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
								htmlFor="email"
							>
								Email
							</label>
							<input
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
								type="email"
								placeholder="tucorreo@correo.com"
								id="email"
								value={formik.values.email}
								onChange={formik.handleChange}
							/>
						</div>
						<div className="mb-4">
							<label
								className="block text-gray-700 text-sm font-bold mb-2"
								htmlFor="password"
							>
								Password
							</label>

							<div className="relative">
								<input
									className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									type={show ? "text" : "password"}
									placeholder="**********"
									id="password"
									value={formik.values.password}
									onChange={formik.handleChange}
								/>

								<button
									type="button"
									onClick={() => setShow(!show)}
									className="absolute right-3 top-2.5 text-sm"
								>
									{show ? "🙈" : "👁️"}
								</button>
							</div>

							{formik.touched.password && formik.errors.password ? (
								<div
									className="bg-red-100 border border-l-4 border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
									role="alert"
								>
									<strong className="font-bold">Error: </strong>
									<span className="block sm:inline">
										{formik.errors.password}
									</span>
								</div>
							) : null}

							<div className="mt-6">
								<input
									className="bg-gray-800 w-full text-white font-bold py-2 px-4 rounded 
                hover:bg-gray-700 transition-colors duration-200 
                cursor-pointer"
									type="submit"
									value="Crear cuenta"
								/>

								<div className="mt-6 text-center space-y-2">
									<a
										href="/login"
										className="block text-sm text-blue-600 hover:underline"
									>
										¿Ya tienes una cuenta? Inicia sesión
									</a>

									<a
										href="/recuperar"
										className="block text-sm text-gray-500 hover:text-gray-700"
									>
										¿Olvidaste tu contraseña?
									</a>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</Layout>
	);
};

export default NuevaCuenta;

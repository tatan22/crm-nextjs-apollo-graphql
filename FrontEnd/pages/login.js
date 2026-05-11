import Layout from "../components/Layout";
import { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";

const AUTENTICAR_USUARIO = gql`
	mutation login($input: AuthInput!) {
		login(input: $input) {
			token
		}
	}
`;

const Login = () => {
	const router = useRouter();
	const [mensaje, setMensaje] = useState(null);
	// Mutation para autenticar usuarios en la base de datos con array destructuring
	const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);
	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.trim()
				.email("Email no válido")
				.required("El email es obligatorio"),
			password: Yup.string()
				.min(6, "La contraseña debe tener al menos 6 caracteres")
				.required("La contraseña es obligatoria"),
		}),
		onSubmit: async (values) => {
			try {
				const { data } = await autenticarUsuario({
					variables: {
						input: values,
					},
				});
				setMensaje({
					title: "Autenticación exitosa",
					text: "Usuario autenticado correctamente",
					success: true,
				});
				setTimeout(() => {
					setMensaje(null);
				}, 3000);
				// Guardar el token en el localStorage
				localStorage.setItem("token", data.login.token);
				// Redirigir al usuario a la página de clientes después de iniciar sesión
				router.push("/");
			} catch (error) {
				setMensaje({
					title: "Error",
					text: error.message.replace("GraphQL error: ", ""),
					success: false,
				});
				setTimeout(() => {
					setMensaje(null);
				}, 3000);
				console.error("Error al autenticar usuario:", error);
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
			<h1 className="text-center text-2xl text-white font-light">Login</h1>
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
									onBlur={formik.handleBlur}
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
									className="bg-red-100 border border-l-4 border-red-00 text-red-700 px-4 py-3 rounded relative mb-4"
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
									value="Iniciar Sesión"
								/>

								<div className="mt-6 text-center space-y-2">
									<a
										href="/nuevacuenta"
										className="block text-sm text-blue-600 hover:underline"
									>
										¿ No tienes cuenta? Crea una
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

export default Login;

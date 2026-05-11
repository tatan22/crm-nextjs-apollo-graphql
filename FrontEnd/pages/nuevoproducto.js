import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const NUEVO_PRODUCTO = gql`
	mutation nuevoProducto($input: ProductoInput) {
		nuevoProducto(input: $input) {
			id
			nombre
			precio
			existencia
		}
	}
`;

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

const NuevoProducto = () => {
	const router = useRouter();
	const [nuevoProducto] = useMutation(NUEVO_PRODUCTO,
		{
			update(cache, { data: { nuevoProducto } }) {
				//Obtener una copia del objeto de cache
				const { obtenerProductos } = cache.readQuery({
					query: OBTENER_PRODUCTOS, // Query que se encarga de obtener los productos
				});
				//Reescribir el cache
				cache.writeQuery({
					query: OBTENER_PRODUCTOS,
					data: {
						obtenerProductos: [...obtenerProductos, nuevoProducto],
					},
				});
			},
		}
	);
	const formik = useFormik({
		initialValues: {
			nombre: "",
			precio: "",
			existencia: "",
		},
		validationSchema: Yup.object({
			nombre: Yup.string()
				.min(3, "El nombre debe tener al menos 3 caracteres")
				.trim()
				.max(20, "El nombre no puede tener más de 20 caracteres")
				.required("El nombre es obligatorio"),

			precio: Yup.number()
				.typeError("Debe ser un número")
				.min(0, "El precio debe ser mayor a 0")
				.required("El precio es obligatorio"),

			existencia: Yup.number()
				.typeError("Debe ser un número")
				.min(0, "La existencia debe ser mayor a 0")
				.required("La existencia es obligatoria")
				.positive("La existencia debe ser mayor a 0")
				.integer("La existencia debe ser un número entero"),
		}),

		onSubmit: async (valores) => {
			try {
				const { data } = await nuevoProducto({
					variables: {
						input: valores,
					},
				});
				//Mostrar una alerta
				Swal.fire("Correcto", data.nuevoProducto, "success");
				// Redireccionar
				router.push("/productos");
			} catch (error) {
				console.log(error);
				Swal.fire({
					title: "Error",
					text: error.message.replace("GraphQL error: ", ""),
					icon: "error",
				});
			}
		},
	});

	const mostrarValidaciones = (value) =>
		formik.touched?.[value] && formik.errors?.[value] ? (
			<div className="bg-red-100 border border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
				<strong className="font-bold">Error: </strong>
				<span>{formik.errors[value]}</span>
			</div>
		) : null;

	return (
		<div>
			<Layout>
				<div>
					<h1 className="text-2xl text-gray-800 font-light">Nuevo Producto</h1>
					{/* {mensaje && mostrarMensaje()} */}
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
										name="nombre"
										className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
										type="text"
										placeholder="Nombre Cliente"
										id="nombre"
										value={formik.values.nombre}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</div>
								{mostrarValidaciones("nombre")}
								<div className="mb-4">
									<label
										className="block text-gray-700 text-sm font-bold mb-2"
										htmlFor="existencia"
									>
										Cantidad Disponible
									</label>
									<input
										className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
										type="number"
										placeholder="Existencia"
										id="existencia"
										value={formik.values.existencia}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</div>
								{mostrarValidaciones("existencia")}
								<div className="mb-4">
									<label
										className="block text-gray-700 text-sm font-bold mb-2"
										htmlFor="precio"
									>
										Precio
									</label>
									<input
										className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
										type="number"
										placeholder="Precio"
										id="precio"
										value={formik.values.precio}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</div>
								{mostrarValidaciones("precio")}

								<div className="mt-8">
									<input
										className="bg-gray-800 w-full text-white font-bold py-2 px-4 rounded 
                hover:bg-gray-700 transition-colors duration-200 
                cursor-pointer"
										type="submit"
										value="Crear Producto"
									/>
								</div>
							</form>
						</div>
					</div>
				</div>
			</Layout>
		</div>
	);
};

export default NuevoProducto;

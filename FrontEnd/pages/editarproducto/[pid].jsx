import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const OBTENER_PRODUCTO = gql`
	query obtenerProducto($id: ID!) {
		obtenerProducto(id: $id) {
			id
			nombre
			precio
			existencia
		}
	}
`;

const ACTUALIZAR_PRODUCTO = gql`
	mutation actualizarProducto($id: ID!, $input: ProductoInput) {
		actualizarProducto(id: $id, input: $input) {
			id
			nombre
			precio
			existencia
		}
	}
`;

const EditarProducto = () => {
	const router = useRouter();
	const { pid } = router.query;

	const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
		variables: {
			id: pid,
		},
	});
	// Mutation para actualizar el producto
	const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);

	if (!pid || loading) return <p>Cargando...</p>;
	if (!loading && !data?.obtenerProducto) {
		router.push("/notFound");
	}
	if (error) return <p>Error: {error.message}</p>;

	// Schema de validación
	const schemaValidacion = Yup.object({
		nombre: Yup.string()
			.min(3, "El nombre debe tener al menos 3 caracteres")
			.trim()
			.max(50, "El nombre no puede tener más de 50 caracteres")
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
	});

	const actualizarInfoProducto = async (valores) => {
		try {
			const { data } = await actualizarProducto({
				variables: {
					id: pid,
					input: {
						nombre: valores.nombre,
						precio: Number(valores.precio),
						existencia: Number(valores.existencia),
					},
				},
			});
			Swal.fire("Correcto", data.actualizarProducto, "success");
			router.push("/productos");
		} catch (error) {
			console.log(error);
			Swal.fire({
				title: "Error",
				text: error.message.replace("GraphQL error: ", ""),
				icon: "error",
			});
		}
	};

	const mostrarValidaciones = (props, value) =>
		props.touched?.[value] && props.errors?.[value] ? (
			<div className="bg-red-100 border border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
				<strong className="font-bold">Error: </strong>
				<span>{props.errors[value]}</span>
			</div>
		) : null;

	return (
		<Layout>
			<h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>
			<div className="flex justify-center mt-10">
				<div className="w-full max-w-lg">
					<Formik
						enableReinitialize
						initialValues={data.obtenerProducto}
						validationSchema={schemaValidacion}
						onSubmit={(valores, _acciones) => {
							actualizarInfoProducto(valores);
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
											name="nombre"
											className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
											type="text"
											placeholder="Nombre Cliente"
											id="nombre"
											value={props.values.nombre}
											onChange={props.handleChange}
											onBlur={props.handleBlur}
										/>
									</div>
									{mostrarValidaciones(props, "nombre")}
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
											value={props.values.existencia}
											onChange={props.handleChange}
											onBlur={props.handleBlur}
										/>
									</div>
									{mostrarValidaciones(props, "existencia")}
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
											value={props.values.precio}
											onChange={props.handleChange}
											onBlur={props.handleBlur}
										/>
									</div>
									{mostrarValidaciones(props, "precio")}

									<div className="mt-8">
										<input
											className="bg-gray-800 w-full text-white font-bold py-2 px-4 rounded 
                hover:bg-gray-700 transition-colors duration-200 
                cursor-pointer"
											type="submit"
											value="Editar Producto"
										/>
									</div>
								</form>
							);
						}}
					</Formik>
				</div>
			</div>
		</Layout>
	);
};

export default EditarProducto;

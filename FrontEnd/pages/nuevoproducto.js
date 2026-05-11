import Layout from "../components/Layout";
const NuevoProducto = () => {
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
								// onSubmit={formik.handleSubmit}
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
										// value={formik.values.nombre}
										// onChange={formik.handleChange}
										// onBlur={formik.handleBlur}
									/>
								</div>
								{/* {formik.touched.nombre && formik.errors.nombre ? (
									<div
										className="bg-red-100 border border-l-4 border-red-00 text-red-700 px-4 py-3 rounded relative mb-4"
										role="alert"
									>
										<strong className="font-bold">Error: </strong>
										<span className="block sm:inline">
											{formik.errors.nombre}
										</span>
									</div>
								) : null} */}
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
										// value={formik.values.existencia}
										// onChange={formik.handleChange}
										// onBlur={formik.handleBlur}
									/>
								</div>
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
										// value={formik.values.precio}
										// onChange={formik.handleChange}
										// onBlur={formik.handleBlur}
									/>
								</div>

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

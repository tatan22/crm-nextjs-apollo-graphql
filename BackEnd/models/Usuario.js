const mongoose = require("mongoose");

const UsuariosSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	lastName: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		trim: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	// role: {
	//   type: 'user' || 'admin',
	//   default: "user"
	// },
});

module.exports = mongoose.model("Usuario", UsuariosSchema);

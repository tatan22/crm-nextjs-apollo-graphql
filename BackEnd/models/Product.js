const mongoose = require("mongoose");

const ProductSchema =  mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  existencia: {
    type: Number,
    required: true,
    default: 0  
  },
  precio: {
    type: Number,
    required: true,
    default: 0
  },
  creado: {
    type: Date,
    default: Date.now()
  }
  });

  ProductSchema.index({nombre: "text"}); // Para buscar por nombre

module.exports = mongoose.model("Producto", ProductSchema);
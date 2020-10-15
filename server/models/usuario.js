const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let rolesValidos = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol vàlido", //{VALUE} obtengo el valor que escribio la persona
};

let Schema = mongoose.Schema;

//definimos nuestro  esquema

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es necesario"],
  },

  email: {
    type: String,
    unique: true, //que sea unico el correo
    required: [true, "El correo es necesario"],
  },

  password: {
    type: String,
    required: [true, "La clave es obligatoria"],
  },

  img: {
    type: String,
    required: false,
  }, //no es obligatoria
  role: {
    type: String,
    default: "USER_ROLE", //default: es el valo por defecto
    enum: rolesValidos, //permite poner solo los valores permitidos para el usuario
  }, //deafault: 'USER_ROLE'
  estado: {
    type: Boolean,
    default: true,
  }, //boolean
  google: {
    type: Boolean,
    default: false,
  }, //boolean
});

//cuando se imprima en JSON el usuarioSchema que no muestre el password
usuarioSchema.methods.toJSON = function(){
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;
  return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser ùnico" }); //{PATH} es para mostrar el campo que utiliza unique para repeticiones de datos

module.exports = mongoose.model("Usuario", usuarioSchema);

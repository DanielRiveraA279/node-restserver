const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore"); //libreria

const Usuario = require("../models/usuario");

const app = express();

app.get("/usuario", function (req, res) {
  let desde = req.query.desde || 0; //desde donde voy a comenzar
  desde = Number(desde); //transformams a numero

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Usuario.find({estado:true}, "nombre email role estado google img")
    .skip(desde) //salta cada 5 registros para paginaciones
    .limit(limite) //cantidad de registros devueltos
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err: err,
        });
      }

      //devuelve cantidad de usuarios tambien y solo los que en estado tengan true
      Usuario.count({estado:true}, (err, conteo) => {
        res.json({
          ok: true,
          usuarios,
          cuantos: conteo,
        });
      });
    });
});

app.post("/usuario", function (req, res) {
  let body = req.body; //esto va a aparecer cuando ejecute el post

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(
      body.password, //data
      10 //numero de vueltas que quiero aplicar el hash
    ),
    role: body.role,
  });

  //guardo en la bd los datoss
  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err: err,
      });
    }

    // usuarioDB.password = null; //quito de la respuesta al password

    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

app.put("/usuario/:id", function (req, res) {
  let id = req.params.id;
  //con esto digo que es lo que si voy a modificar con un metodo put
  let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  //{new:true} : si es true me devuelve la actualizacion caso contrario el dato viejo
  //runValidators: si es true corre las validaciones que definimos en el esquema si no no
  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err: err,
        });
      }
      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  );
});

//eliminar fisicamente un registro
// app.delete("/usuario/:id", function (req, res) {
//   // res.json("delete usuario");

//   let id = req.params.id; //obtengo el id

//   Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
//     if (err) {
//       return res.status(400).json({
//         ok: false,
//         err: err,
//       });
//     }

//     //si vuelvo a querer eliminar el id que ya fue elimiado disparo el mensaje
//     if(!usuarioBorrado){
//       return res.status(400).json({
//         ok: false,
//         error: {
//           message: 'Usuario no encontrado'
//         }
//       })
//     }

//     res.json({
//       ok: true,
//       usuario: usuarioBorrado,
//     })
//   });
// });

app.delete("/usuario/:id", function (req, res) {
  let id = req.params.id; //obtengo el id
  let cambiaEstado = {
    estado: false,
  };
  Usuario.findByIdAndUpdate(
    id,
    cambiaEstado,
    { new: true },
    (err, usuarioBorrado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err: err,
        });
      }

      //si vuelvo a querer eliminar el id que ya fue elimiado disparo el mensaje
      if (!usuarioBorrado) {
        return res.status(400).json({
          ok: false,
          error: {
            message: "Usuario no encontrado",
          },
        });
      }

      res.json({
        ok: true,
        usuario: usuarioBorrado,
      });
    }
  );
});

module.exports = app; //exportamos para utilizarlo a fuera

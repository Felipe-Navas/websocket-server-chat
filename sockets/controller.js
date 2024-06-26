const { Socket } = require('socket.io')
const { comprobarJWT } = require('../helpers')
const { ChatMensajes } = require('../models')

const chatMensajes = new ChatMensajes()

const socketController = async (socket = new Socket(), io) => {
  // console.log('Cliente conectado', socket.id );
  const token = socket.handshake.headers['x-token']

  const usuario = await comprobarJWT(token)
  if (!usuario) {
    return socket.disconnect()
  }

  // Agregar el usuario conectado
  chatMensajes.conectarUsuario(usuario)
  io.emit('usuarios-activos', chatMensajes.usuariosArr)

  socket.emit('recibir-mensajes', chatMensajes.ultimos10)

  // Cuando se conecta un cliente, lo conecto a una sala privada con el nombre de su propio id
  socket.join(usuario.id)

  // Limpiar cuando alguien se desconecta
  socket.on('disconnect', () => {
    chatMensajes.desconectarUsuario(usuario.id)
    io.emit('usuarios-activos', chatMensajes.usuariosArr)
  })

  socket.on('enviar-mensaje', ({ mensaje, uid }) => {
    if (uid) {
      // Mensaje privado
      chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje)
      socket.to(uid).emit('mensaje-privado', chatMensajes.ultimos10)
    } else {
      // Mensaje para todos
      chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje)
      io.emit('recibir-mensajes', chatMensajes.ultimos10)
    }
  })
}

module.exports = {
  socketController,
}

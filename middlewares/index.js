const validarCampos = require('../middlewares/validar-campos')
const validarJWT = require('../middlewares/validar-jwt')
const validaRoles = require('../middlewares/validar-roles')
const validarArchivoASubir = require('../middlewares/validar-archivo')

module.exports = {
  ...validarCampos,
  ...validarJWT,
  ...validaRoles,
  ...validarArchivoASubir,
}

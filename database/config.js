const mongoose = require('mongoose')

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGOBD_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useCreateIndex: true,
      //useFindAndModify: false,
    })

    console.log('Base de datos conectada!')
  } catch (error) {
    console.log(error)
    throw new Error('Error al iniciar la base de datos mongo')
  }
}

module.exports = {
  dbConnection,
}

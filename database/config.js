const mongoose = require('mongoose');

const dbConexion = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('DB mongo ya corriendo');
  } catch (error) {
    console.log(error);
    throw new Error('Error a la hora de iniciar la base de datos');
  }
};

module.exports = { dbConexion };

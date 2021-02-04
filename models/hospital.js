const { Schema, model } = require('mongoose');

const HospitalSchema = Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Usuario',
    },
  },
  // Usaremos collections para cambiarle el nombre a la colecion y no sea 'hospitals'
  { collection: 'hospitales' }
);

HospitalSchema.method('toJSON', function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model('Hospital', HospitalSchema);

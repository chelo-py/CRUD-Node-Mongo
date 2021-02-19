const mongoose = require('mongoose'); // Llamamos al módulo mongoose para crear nuestra base de datos

mongoose.connect('mongodb://localhost/notes-db-app', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}) //Propiedades de mongo db
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));
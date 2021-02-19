const express = require('express'); // Módulo para crear servidores
const path = require('path'); // módulo para unificar directorios y poder ubicarlos.
const exphbs = require('express-handlebars'); // Módulo para el generador de plantillas html.
const methodOverride = require('method-override'); // Módulo para obtener métodos put y delete
const session = require('express-session'); // Módulo para guardar los datos del usuario en una sesión
const flash = require('connect-flash'); // Módulo para mostrar mensajes en todas las pantallas
const passport = require('passport'); // Módulo que nos ayuda a autenticar
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access'); // Nos permite desactivar los protocolos de seguridad
const Handlebars = require('handlebars');

//Inicializaciones
const app = express();
require('./database')
require('./config/passport')

// Configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views')); // Estamos en index.js, el dirname es src y a este le unimos la carpeta views
app.engine('.hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main', // El layout principal
    layoutsDir: path.join(app.get('views'), 'layouts'), // Dirección del layout
    partialsDir: path.join(app.get('views'), 'partials'), // Dirección del partials
    extname: '.hbs' // Especificamos el nombre de la extensión.
}));
app.set('view engine', '.hbs')

// Middlewares
app.use(express.urlencoded({ extended: false })); // Para recibir información desde los formularios en un formato legible, extended false para no recibir imágenes
app.use(methodOverride('_method')); // Para poder recibir métodos put y delete
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
})); // La sesión nos ayuda a almacenar los datos del usuario de manera temporal.
app.use(passport.initialize()); // Inicializamos passport
app.use(passport.session()); // Utilizamos session
app.use(flash()); // Para mostrar mensajes en todas las pantallas

// Variables Globales
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
// Rutas
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));
// Archivos Estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Servidor Escuchando 
app.listen(app.get('port'), () => {
    console.log('Servidor en puerto', app.get('port'));
})
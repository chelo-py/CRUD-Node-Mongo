const helpers = {}; // Definimos una constante 

helpers.isAuthenticated = (req, res, next) => { // Creamos una función para saber si está autenticado el usuario
    if (req.isAuthenticated()) { // Si está autenticado
        return next(); // retorna next, o sea continua con el resto de ejecuciones
    }
    req.flash('error_msg', 'Not Authorized'); // Si no con flash requerimos de un mensaje y el texto del mismo
    res.redirect('/users/signin'); // y lo redireccionamos a la pantalla de login
};

module.exports = helpers;
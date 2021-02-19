const passport = require('passport'); // Llamamos al módulo passport para autenticar a los usuarios
const LocalStrategy = require('passport-local').Strategy; // Requerimos al módulo passport Local y a Strategy

const User = require('../models/User'); // Requerimos al modelo User para consultar

passport.use(new LocalStrategy({ // Nueva estrategia de autenticación
    usernameField: 'email' // Se autenticará a través del correo
}, async (email, password, done) => { // Parámetros para autenticar email, password y done para el callback
    const user = await User.findOne({ email: email }); // Buscar en la base de datos a un usuario con el correo electrónico del usuario que intenta logearse
    if (!user) { // Si el usuario no existe
        return done(null, false, { message: 'Not user found' }); // Retornar null para el error, false para el usuario y mensaje, done nos permite terminar la utenticación
    } else { // Si existe un usuario
        const match = await user.matchPassword(password); // De la constante user llamamos el método matchPassword para comparar las contraseñas
        if (match) { // Si hay match, o sea son iguales
            return done(null, user) // Retorna null para el error y devuelve el usuario 
        } else { // Si no
            return done(null, false, { message: 'Incorrect Password' }) // Retorna null para error y false para el usuario
        }
    }
}));

// Guarda el id del usuario en una sesión, para no pedirle nuevamente sus datos cuando visite otras páginas
passport.serializeUser((user, done) => { // Requiere un usuario y un call back
    done(null, user.id); // Finaliza el call back, con error null y el usuario con su respectivo id
});

// Mediante un id obtenemos un usuario para poder usar sus datos
passport.deserializeUser((id, done) => { // Requiere un id y un call back
    User.findById(id, (err, user) => { // Busca en la base de datos el id, puede haber un error o un usuario
        done(err, user) // finaliza si hay un error o un usuario lo retorna
    })
})
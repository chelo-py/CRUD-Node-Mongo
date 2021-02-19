const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin', (req, res) => { //la dirección url
    res.render('users/signin') // Directorio donde se encuentra el archivo signin.hbs
});

router.post('/users/signin', passport.authenticate('local', { // Pasamos el nombre de la autenticación, por defecto es local
    successRedirect: '/notes', // Si todo sale bien redirecciona a /notes
    failureRedirect: '/users/signin', // Si hay algún error redirecciona a la pantalla de inicio de sesión
    failureFlash: true // Habilita los mensajes flash
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
})

// Para registrar usuarios
router.post('/users/signup', async (req, res) => {
    const { name, email, password, confirm_password } = req.body; // Hacemos el destructuring de datos
    const errors = []; // Instanciamos un arreglo que contendrá los errores.
    if (name.length <= 0) { // Si la longitud de nombre es menor a cero
        errors.push({ text: 'Please insert your name' }) // agregamos al arreglo de errores el mensaje
    }
    if (password != confirm_password) { // Comparamos si las contraseñas coinciden
        errors.push({ text: 'Password do not match' }) // si no, mostramos el mensaje
    }
    if (password.length < 4) { // condicionamos para que el password sea mayor de 4 caracteres
        errors.push({ text: 'The password must have at least 4 characters' }) // Mostramos mensaje
    }
    if (errors.length > 0) { // Si el arreglo de errores es mayor a cero
        res.render('users/signup', { errors, name, email, password, confirm_password }) // renderizamos la pantalla users/signup junto con los valores
    } else {
        const emailUser = await User.findOne({ email: email }) // Definimos el email del usuario buscando en la base de datos
        if (emailUser) { // Si existe
            req.flash('error_msg', 'The email is already in use'); // mostramos el mensaje
            res.redirect('/users/signup') // y redireccionamos a la pantalla de registro
        } else {
            const newUser = new User({ name, email, password }); // Creamos una constante que tendrá un objeto con los datos del usuario
            newUser.password = await newUser.encryptPassword(password) // Asignamos que la contraseña a guardar es encriptada
            await newUser.save(); // Guardamos el nuevo usuario en la base de datos
            req.flash('success_msg', 'You are registered'); // Mostramos mensaje de éxito
            res.redirect('/users/signin'); // Redireccionamos la pantalla de inicio de sesión   
        }

    }
})

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;
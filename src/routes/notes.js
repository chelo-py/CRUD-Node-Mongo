const express = require('express');
const router = express.Router();
const Note = require('../models/Note')
const { isAuthenticated } = require('../helpers/auth')
// Si va a la dirección /notes/add, renderiza new-note que se encuentra en la carpeta notes
router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note')
})

// Para crear notas
router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const { title, description } = req.body; // Creamos 2 constantes destructurando de req.body
    const errors = []; // Creamos una constante que contendrá el array de los errores
    if (!title) { // Si el título no existe
        errors.push({ text: "Please insert a title" }) // Agrega en el array el texto correspondiente
    }
    if (!description) { // Si la descripción no existe
        errors.push({ text: "Please insert a description" }) // Agrega en el array el texto correspondiente
    }
    if (errors.length > 0) { // Si el array de errores es superior a cero
        res.render('notes/new-note', { //renderizar la pantalla new-note, junto con el array, el titulo y la descripción
            errors,
            title,
            description
        });
    } else { // Si no se cumple ninguna de las anteriores condiciones
        const newNote = new Note({ title, description }); // Creamos una nueva nota con título y descripción
        newNote.user = req.user.id;
        await newNote.save(); // Guardamos en la base de datos
        req.flash('success_msg', 'Note added Successfully'); // Mensaje de éxito
        res.redirect('/notes') // Redireccionamos a la pantalla notes
    }
});

// Para listar todas las notas
router.get('/notes', isAuthenticated, async (req, res) => { // Si obtiene de la dirección notes
    const notes = await Note.find({ user: req.user.id }).lean().sort({ date: 'desc' }); // consulta todos los registros de la colección Note y los ordena por fecha y sólo aquellas que pertenezcan al usuario
    res.render('notes/all-notes', { notes }); // entonces renderiza la pantalla all-notes junto con los valores en {notes}
})

// Cuando opriman el botón editar este renderice a la pantalla edit-note
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => { // Si obtiene desde esta dirección del id de la nota
    const note = await Note.findById(req.params.id).lean(); // Buscamos dicha nota utilizando su id
    res.render('notes/edit-note', { note }) // Renderizamos la pantalla edit-note junto con su valor en {note}
});

// Para actualizar las notas
router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const { title, description } = req.body; // Hacemos destructuring del req.body para obtener por separado el title y la descripción
    await Note.findByIdAndUpdate(req.params.id, { title, description }); // Del modelo Note buscamos por id y actualizamos
    req.flash('success_msg', 'Note updated Successfully') // Mensaje de éxito
    res.redirect('/notes'); // Luego redirigimos a la dirección notes
});

// Para eliminar las notas
router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id); // Buscamos por el Id y eliminamos
    req.flash('success_msg', 'Note deleted successfully'); // Mensaje de éxito
    res.redirect('/notes'); // Redirigimos a la pantalla notes
})

module.exports = router; // Exportamos el módulo router
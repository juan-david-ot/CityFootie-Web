const express = require('express')
const router = express.Router()

const Field = require('../models/Field.model')
const Match = require('../models/Match.model')

router.get('/mapa', (req, res, next)=>{
    res.render('fields/maps')
})

router.get('/campos/detalles/:campo_id', (req, res, next) => {
    const { campo_id } = req.params

    Promise.all(
        [
            Field.findById(campo_id),
            Match.find({ field: campo_id })
        ]
    )
    .then(values => {
        res.render('fields/field-detail', { field: values[0], matches: values[1] })
    })
    .catch(err => next(err))
})

router.get('/campos/crear', (req, res, next) => {
    res.render('fields/create-field')
})

router.post('/campos/crear', (req, res, next) => {
    const { name, latitude, longitude } = req.body
    const location = {
        type: 'Point',
        coordinates: [latitude, longitude]
    }
    Field
        .create({ name, location })
        .then(() => res.redirect('/mapa'))
        .catch(err => next(err))
})

router.get('/campos/editar/:campo_id', (req, res, next) => {
    const { campo_id } = req.params
    Field
        .findById(campo_id)
        .then(field => res.render('fields/edit-field', field))
        .catch(err => next(err))
})

module.exports = router
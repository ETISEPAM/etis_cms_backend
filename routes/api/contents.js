const express = require('express');
const router = express.Router();
const Content= require('../../model/Content');


// List All Contents
router.get('/', (req, res) => {
    Content.find((err, contents) => {
        if (!err) {
            res.status(200).json({
                contents
            })
        } else {
            res.status(404).json({
                msg:  `Content List Not Found!`
            })
        }
    })
})

module.exports = router;

//Show One Content
router.get('/:id', (req, res) => {
    Content.findById(req.params.id, (err, content) => {
        if(!err) {
            res.status(200).json({
                content
            })
        } else {
            res.status(404).json({
                msg: `Content with ID: ${req.params.id} not found! `
            })
        }
    })
})
const express = require('express');
const router = express.Router();
const Content= require('../../model/Content');
const checkAuth = require("../api/middleware/check-auth");


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

//CREATE Content
router.post('/', checkAuth, (req, res) => {
    let {title, body} = req.body;
    Content.findOne({"contentBody.title": title, "contentBody.body":body})
    .then(content => {
        if(content) {
            return res.status(409).json({
                msg: `Content with the title of '${title}' already exists`
            })
        } else {
            const newContent = new Content({contentBody: {title, body}});
            console.log(newContent)
            newContent.save().then(() => {
                return res.status(201).json({
                    success: true,
                    msg: "Content Created",
                    newContent
                })
            })       
        }
    })
})

module.exports = router;
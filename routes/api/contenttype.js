const express = require('express');
const router = express.Router();
const ContentType= require('../../models/ContentType');


router.post('/', (req, res) => {
    let { name, description } = req.body
    ContentType.findOne({name: name})
    .then(contentType => {
        if(contentType) {
            return res.status(400).json({
                msg: "Content Type Already Exists!"
            })
        } else {
            const newContentType = new ContentType({name, description});
            newContentType.save()
            .then(() => {
                return res.status(201).json({
                    success: true,
                    msg: "Content Type Created Successfully"
                })
            })
        }
    })

    
});


//TODO Add fields to content-type
router.post('/fields', (req, res) => {

});



module.exports = router;
const express = require('express');
const router = express.Router();
const ContentType= require('../../model/ContentType');
const checkAuth = require("../api/middleware/check-auth");



//create content type

router.post('/', checkAuth, (req, res) => {
    let { name, description } = req.body
    ContentType.findOne({name: name})
    .then(contentType => {
        if(contentType) {
            return res.status(409).json({
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



//get the content types
    router.get('/', checkAuth, function(req, res, next) {

      
        ContentType.find((err, docs) => {
            if (!err) {
                // console.log(docs)
                let contentTypeNameList = [];
                docs.forEach((item) => {
                    contentTypeNameList.push(item.name);
                })
                return res.status(201).json({
                    contentTypeNameList
                })
            }
             else {
                return res.status(404).json({
                    msg: "Failed to retrieve content type list"
                })
                // console.log('Failed to retrieve the Content Type List: ' + err);
            }
        });
    });
     


// router.post('/fields', )

module.exports = router;
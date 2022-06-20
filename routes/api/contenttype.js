const express = require('express');
const router = express.Router();
const ContentType= require('../../model/ContentType');
const checkAuth = require("../api/middleware/check-auth");


//Create New Content Type
router.post('/', checkAuth, async (req, res) => {
    let { name, description } = req.body
    await ContentType.findOne({name: name})
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
//Get All Content Types
router.get('/', checkAuth, async (req, res, next) => {
    await ContentType.find((err, docs) => {
        if (!err) {
            // console.log(docs)
            let contentTypeNameList = [];
            docs.forEach((item) => {
                contentTypeNameList.push(item.name);
            })
            return res.status(200).json({
                contentTypeNameList
            })
        } else {
            return res.status(404).json({
                msg: "Failed to retrieve content type list"
            })
            // console.log('Failed to retrieve the Content Type List: ' + err);
        }
    });
});

//Add Field to Content Type
router.post('/field', (req, res) => {

});

module.exports = router;
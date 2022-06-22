const express = require("express");
const router = express.Router();
const ContentType = require("../../model/ContentType");
const checkAuth = require("./middleware/checkAuth");

//Create New Content Type
router.post(
    "/",
    /*checkAuth*/ async (req, res) => {
        let { name, description } = req.body;
        await ContentType.findOne({ name: name }).then((contentType) => {
            if (contentType) {
                return res.status(409).json({
                    msg: "Content Type Already Exists!",
                });
            } else {
                const newContentType = new ContentType({ name, description });
                newContentType.save().then(() => {
                    return res.status(201).json({
                        success: true,
                        msg: "Content Type Created Successfully",
                        newContent: newContentType
                    });
                });
            }
        });
    }
);
//Get All Content Types
router.get(
    "/",
    /*checkAuth*/ (req, res, next) => {
       
        


        ContentType.find((err, docs) => {
            if (!err) {
                //pagination
      
                let contentTypeNameList = [];

                // console.log(docs)
             
                docs.forEach((item) => {

                    contentTypeNameList.push({ name: item.name, id: item._id });
                 });
                return res.status(200).json({
                    contentTypeNameList
                    
                });
            } else {
                return res.status(404).json({
                    msg: "Failed to retrieve content type list",
                });
            }
        });
    }
);

//Add Field to Content Type
router.post("/field", (req, res) => {});

//Delete content type according to id
router.delete("/:id", async (req, res, next) => {
    const id = req.params.id;
    ContentType.findByIdAndRemove(id)
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete content type with id =${id}`
                });
            } else {
                res.send({
                    message: "Delete is succeed",
                    deletedData:data
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "could not delete content type with id" + id,
            });
        });
});

//Update content type according to id

router.patch("/:id", async (req, res, next) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty",
        });
    }
    const id = req.params.id;
    ContentType.findByIdAndUpdate(id, req.body,  { useFindAndModify: false ,new:true})
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Can not update the content type with id=${id}`,
                });
            } else {
                res.send({ message: "Updated succesfully" ,data});
                
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: `Error updating content type with id= ${id}`,
            });
        });
});

//Get the content type with specific id
router.get("/:id", async (req, res, next) => {
    const id = req.params.id;
    ContentType.findById(id)
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: "Not found content type with id" + id,
                });
            } else res.send(data);
        })
        .catch((err) => {
            res.status(500).send(
                { message: "Error while retrieving the content type with id" } +
                    id
            );
        });
});
/*function paginate(model){
    return(req,res,next)=>{
        const page = req.query.page;
        const limit = req.query.limit;
        const startIndex = (page-1) * limit;
        const endIndex = page*limit;
        const result = {}

        if(endIndex<model.countDocuments().exec()){
            result.next = {
                page: page+1,
                limit:limit
            };
        }
        if(startIndex>0){
            result.previous = {
                page: page - 1,
                limit:limit
            }
        }

        try{
 //get paginated documents
 this.find().skip(skip).limit(limit).exec(function(err, docs){

    if(err){
        return callback('Error Occured', null);
    }
    else if(!docs){
        return callback('Docs Not Found', null);
    }
    else{
        var result = {
            "totalRecords" : totalCount,
            "page": pageNo,
            "nextPage": pageNo + 1,
            "result": docs
        };
        return callback(null, result);
    }

});
        
        
      } catch(e){
        res.status(500).json({message:e.message})

    }
}
}*/
module.exports = router;


const jwt = require('jsonwebtoken')
module.exports=(req,res,next)=>{

    // If the token is present

        const token = req.body.token;
        console.log(token)


        //  Return response with decode data
        if(token){
             // Verify the token using jwt.verify method
        const decode = jwt.verify(token, process.env.JWT_SECRET);
            res.json({
                msg: "This route is available ",
                data: decode
            });
        }

        else{

            // Return response with error
            return res.status(401).json({
                message:"Restricted"
            })

        //  Return response with decode data

}
} 
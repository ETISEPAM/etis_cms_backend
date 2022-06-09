const router = require("express").Router();
const verify = require("./verifyToken");

router.get("/", verify, (req, res) => {
  // res.send(req.user);

  //will connect the mongodb
  res.json({
    posts: {
      title: "First Post",
      description: "random data you should not access",
    },
  });
});

module.exports = router;

const getUserID = async (user, res) => {
    if (user) {
        let userID = user.id;
        console.log(userID);
        res.cookie("userID", userID);
    }
};

module.exports = { getUserID };

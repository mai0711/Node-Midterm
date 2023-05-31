const User = require("../Models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async(req, res) => { // :id = params.id
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                //generate and update hashed password
                const salt = await bcrypt.genSalt(10);//generate new password
                req.body.password = await bcrypt.hash(req.body.password, salt); //update password
            }catch(err){
                return res.status(500).json(err);
            }
        }
            //update user data
            try{
                const user = await User.findByIdAndUpdate(req.params.id, {
                    $set: req.body,
                });
                res.status(200).json("Account has been updated");
            }catch(err){
                return res.status(500).json(err);
            }
    }else{
        return res.status(403).json("You can update only your account")
    }
});

//delete user
router.delete("/:id", async(req, res) => { // :id = params.id
    if(req.body.userId === req.params.id || req.body.isAdmin){
            //delete user data
            try{
                const user = await User.findByIdAndDelete(req.params.id);
                res.status(200).json("Account has been deleted");
            }catch(err){
                return res.status(500).json(err);
            }
    }else{
        return res.status(403).json("You can delete only your account")
    }
});

//get a user
router.get("/:id", async(req, res) => { // :id = params.id
    try{
        const user = await User.findById(req.params.id);
        const {password, updatedAt, ...other} = user._doc;
        res.status(200).json(other);
    }catch(err){
        res.status(500).json(err)
    }
})

//follow a user
router.put("/:id/follow", async (req, res) => { // :id = params.id
    if(req.body.userId !== req.params.id) { //req.body.userId = my id / req.params.id = someone's id
        try{
            const user = await User.findById(req.params.id); //user = someone that I want follow
            const currentUser = await User.findById(req.body.userId); // currentUser = myself
            if(!user.followers.includes(req.body.userId)){  //if user(someone) doesn't include currentUser(me) as follower,
                await user.updateOne({ $push: {followers: req.body.userId} }); //push my id inside other's followers. update only other's followers array
                await currentUser.updateOne({ $push: {followings: req.params.id} }); //push other's id inside my following . update only my following array
                res.status(200).json("User has been followed")
            }else{
                res.status(403).json("You already followed this user")
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{ // req.body.userId ==== req.params.id = my id
        res.status(403).json("You can't follow yourself")
    }
})

//unfollow a user
router.put("/:id/unfollow", async (req, res) => { // :id = params.id
    if(req.body.userId !== req.params.id) { //req.body.userId = my id / req.params.id = someone's id
        try{
            const user = await User.findById(req.params.id); //user = someone that I want follow
            const currentUser = await User.findById(req.body.userId); // currentUser = myself
            if(user.followers.includes(req.body.userId)){  //if user(someone) includes currentUser(me) as follower,
                await user.updateOne({ $pull: {followers: req.body.userId} }); //remove my id from other's followers. update only other's followers array
                await currentUser.updateOne({ $pull: {followings: req.params.id} }); //remove other's id from my following . update only my following array
                res.status(200).json("User has been unfollowed")
            }else{
                res.status(403).json("You don't follow this user")
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{ // req.body.userId ==== req.params.id = my id
        res.status(403).json("You can't unfollow yourself")
    }
})

module.exports = router;
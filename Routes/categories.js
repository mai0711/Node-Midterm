const Post = require("../Models/Post");
const User = require("../Models/User");
const router = require("express").Router();

//get all of following people's posts and my posts by category
router.get("/:category/all/", async(req, res) => {
    try{
        //get all of following people's posts and my posts
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map(friendId => {
                return Post.find({ userId: friendId });
            })
        );
            const filterByCategories = userPosts.concat(...friendPosts);
            const category = await Promise.all(
            //filter post by category
            filterByCategories.filter((filterByCategory) => {
                return filterByCategory.category == req.params.category
            })
            );
            res.json(category);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;
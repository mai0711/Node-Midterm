const Post = require("../Models/Post");
const User = require("../Models/User");
const router = require("express").Router();

//create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body)
    try{
        const savePost = await newPost.save();
        res.status(200).json(savePost);
    }catch(err){
        res.status(500).json(err);
    }
})

//update a post
router.put("/:id", async(req, res) => { //id = post id
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne( {$set: req.body} );
            res.status(200).json("The post has been updated")
        }else{
            res.status(403).json("You can update only your post")
        }
    }catch(err){
        res.status(500).json(err)
    }
})

//delete a post
router.delete("/:id", async(req, res) => { //id = post id
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne( {$set: req.body} );
            res.status(200).json("The post has been deleted")
        }else{
            res.status(403).json("You can delete only your post")
        }
    }catch(err){
        res.status(500).json(err)
    }
});

//like or dislike a post
router.put("/:id/like", async(req, res) => { //id = post id
    try{
        const post = await Post.findById(req.params.id);
        //like
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("The post has been liked")
        }else{//dislike
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("The post has been disliked")
        }
    }catch(err){
        res.status(500).json(err);
    }
})

//get a post
router.get("/:id", async (req, res) => { //id = post id
    try{
        const post = await Post.findById(req.params.id); //post id
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err);
    }
})

//get all posts
router.get("/api/v1/allPosts", async(req, res) =>{
    try{
        const allPosts = await Post.find({});
        res.status(200).json(allPosts);
    } catch(err) {
        res.status(500).json(err);
    }
})

//get only all of my posts
router.get("/api/v1/allMyPosts", async(req, res) =>{
    try{
        //get all posts
        const allPosts = await Post.find({});
        //get only my posts
        const myPosts = await Promise.all(
            allPosts.filter((allMyPost) => {
                return allMyPost.userId == req.body.userId
            })
            );
            res.status(200).json(myPosts);
    } catch(err) {
        res.status(500).json(err);
    }
})

//get all of following people's posts and my posts
router.get("/timeline/all", async (req, res) => {
    try{
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map(friendId => {
                return Post.find({ userId: friendId });
            })
        );
        res.json(userPosts.concat(...friendPosts));
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;
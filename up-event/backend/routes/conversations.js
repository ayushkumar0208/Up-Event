const router = require("express").Router();
const Conversation = require("../models/Conversation");

//new conv

router.post("/", async (req, res) => {

  Conversation.findOne({members:[req.body.senderId,req.body.receiverId]},(err,conver)=>{
    if(conver){
      console.log("found")
      res.send("Coversation Already Exist")
    }else{
      console.log("not found")
      const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
      });
    
      newConversation.save().then(()=>{
        res.status(201).json({message:"Coversation Added Successfully"})
      }).catch((err)=>{
        res.staus(500).json({message:"Conversation Not Added"})
      })
      // try {
      //   newConversation.save().then();
      //   res.status(200).json(savedConversation);
      // } catch (err) {
      //   res.status(500).json(err);
      // }
    }
  })
  
});

//get conv of a user

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});



router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

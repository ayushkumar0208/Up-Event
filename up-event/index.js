const express = require("express");
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const conversationRoute = require("./api/routes/conversations");
const messageRoute = require("./api/routes/messages");
const router = express.Router();
const path = require("path");
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));

const DB =
  "mongodb+srv://aryaayush0208:20BCS9786@loginregister.qcwkx.mongodb.net/LoginRegister?retryWrites=true&w=majority";

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`connection Successful`);
  })
  .catch(() => {
    console.log(`no connection`);
  });



  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });
 
  const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});



const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);

router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
    console.log(res)
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

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




const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);

router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});
 
 
//   UserSchema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const User = mongoose.model("User", userSchema);

const onGoingEventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  orgBy: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  eventId: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
});
const onGoingEvent = mongoose.model("onGoingEvent", onGoingEventSchema);

app.post("/onGoingEvent", (req, res) => {
  const { eventName, orgBy, desc, eventId, createdBy } = req.body;
  const newEvent = new onGoingEvent({
    eventName,
    orgBy,
    desc,
    eventId,
    createdBy,
  });
  newEvent
        .save()
        .then(() => {
          res.status(201).json({ message: "Record Entered" });
        })
        .catch((err) => {
          res.status(500).json({ message: "Failed to Entered Record" });
        });
  
});


app.get("/onGoingEvent",(req,res)=>{
  // res.send("wirking")
  onGoingEvent.find({},(err,result)=>{
    if(err){
      res.send(err)
    }else{
      res.send(result)
    }
  })
})
//   Routes
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Succesful", user: user });
      } else {
        res.send({ message: "Password didn't match " });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "User Already registered" });
    } else {
      const user = new User({
        name,
        email,
        password,
      });

      user
        .save()
        .then(() => {
          res.status(201).json({ message: "Record Entered" });
        })
        .catch((err) => {
          res.status(500).json({ message: "Failed to Entered Record" });
        });
    }
  });
});


app.get("/users",(err,res)=>{
  User.find({},(err,result)=>{
    if(err){
      res.send(err)
    }else{
      res.send(result)
    }
  })
})

app.listen(8800, () => {
  console.log("Port 8800");
});

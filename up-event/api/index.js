const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const path = require("path");
const router = require("express").Router();
var encode = require( 'hashcode' ).hashCode;

dotenv.config();

mongoose.connect(
  "mongodb+srv://aryaayush0208:20BCS9786@loginregister.qcwkx.mongodb.net/LoginRegister?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);
app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("common"));

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

const ParticipantSchema = new mongoose.Schema({
  eventId:{
    type:String,
    required:true
  },
  hostCode:{
    type:String,
    required:true
  },
  joinCode:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  userId:{
    type:String,
    required:true
  }
})

const Participant = mongoose.model("Participant",ParticipantSchema)

app.post("/participant",(req,res)=>{
  const {eventId,hostCode , joinCode,email,userId}=req.body;
  const newParticipant = new Participant({
    eventId,hostCode,joinCode,email,userId
  })

  newParticipant.save().then(()=>{
    res.status(201).json({message:"Participant added Succesfully"})
  })
  .catch((err)=>{
    res.status(500).json({message:"Failed to add Participant"})
  })
})


app.get("/getParticipants",(req,res)=>{
  Participant.find({},(err,result)=>{
    if(err){
      res.send(err)
    }else{
      console.log(result)
      res.send(result)
    }
  })
})

app.delete("/deleteParticipant/:userId/:eventId", async (req,res)=>{
  // try{
    Participant.find({userId:req.params.userId,eventId:req.params.eventId},async (err,result)=>{
      if(err){
        res.send(err);
      }else{
        try {
          const post = await Participant.findById(result._id);
          if (post) {
            await post.deleteOne();
            res.status(200).json("the event has been deleted");
          } else {
            res.json({
              message: result.eventId
            })
            // res.status(403).json("you can delete only your post");
          }
        } catch (err) {
          res.status(500).send(err)
        }
      }
    })
  // }catch(err){
  //   res.status(500).json(err);
  // }

  
})

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
  hostCode:{
    type:String,
  }
});
const onGoingEvent = mongoose.model("onGoingEvent", onGoingEventSchema);

 
app.post("/onGoingEvent", (req, res) => {
  const { eventName, orgBy, desc, eventId, createdBy,hostCode } = req.body;
  const newEvent = new onGoingEvent({
    eventName,
    orgBy,
    desc,
    eventId,
    createdBy,
    hostCode,
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
  // const post = onGoingEvent.findById("628287f7e1f42202bc6b9162");
  // console.log(post);
  onGoingEvent.find({},(err,result)=>{
    if(err){
      res.send(err)
    }else{
      console.log(result)
      res.send(result)
    }
  })
})

app.delete("/deleteEvent/:id", async (req, res) => {
  try {
    const post = await onGoingEvent.findById(req.params.id);
    if (post) {
      await post.deleteOne();
      res.status(200).json("the event has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password===user.password) {
        res.send({ message: "Login Succesful", user: user });
      } else {
        res.send({ message: "Password didn't match " });
        
      }
    } else {

      res.send({ message: "User not registered" });
    } 
  });
});

app.get("/allusers",(req,res)=>{
  User.find({},(err,result)=>{
    if(err){
      res.send(err);
    }else{ 
      res.send(result)
    }
  }) 
})

app.post("/register",async (req, res) => {
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
 

 
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);


const http = require('http')//

const bodyParser = require('body-parser')//
var xss = require("xss")//

var server = http.createServer(app)//
var io = require('socket.io')(server)//

app.use(cors())//
app.use(bodyParser.json())//
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });

if(process.env.NODE_ENV==='production'){
	app.use(express.static(__dirname+"/build"))
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname+"/build/index.html"))
	})
}
app.set('port', (process.env.PORT || 4001))

sanitizeString = (str) => {
	return xss(str)
}

connections = {}
messages = {}
timeOnline = {}

io.on('connection', (socket) => {

	socket.on('join-call', (path) => {
		if(connections[path] === undefined){
			connections[path] = []
		}
		connections[path].push(socket.id)

		timeOnline[socket.id] = new Date()

		for(let a = 0; a < connections[path].length; ++a){
			io.to(connections[path][a]).emit("user-joined", socket.id, connections[path])
		}

		if(messages[path] !== undefined){
			for(let a = 0; a < messages[path].length; ++a){
				io.to(socket.id).emit("chat-message", messages[path][a]['data'], 
					messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
			}
		}

		console.log(path, connections[path])
	})

	socket.on('signal', (toId, message) => {
		io.to(toId).emit('signal', socket.id, message)
	})

	socket.on('chat-message', (data, sender) => {
		data = sanitizeString(data)
		sender = sanitizeString(sender)

		var key
		var ok = false
		for (const [k, v] of Object.entries(connections)) {
			for(let a = 0; a < v.length; ++a){
				if(v[a] === socket.id){
					key = k
					ok = true
				}
			}
		}

		if(ok === true){
			if(messages[key] === undefined){
				messages[key] = []
			}
			messages[key].push({"sender": sender, "data": data, "socket-id-sender": socket.id})
			console.log("message", key, ":", sender, data)

			for(let a = 0; a < connections[key].length; ++a){
				io.to(connections[key][a]).emit("chat-message", data, sender, socket.id)
			}
		}
	})

	socket.on('disconnect', () => {
		var diffTime = Math.abs(timeOnline[socket.id] - new Date())
		var key
		for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
			for(let a = 0; a < v.length; ++a){
				if(v[a] === socket.id){
					key = k

					for(let a = 0; a < connections[key].length; ++a){
						io.to(connections[key][a]).emit("user-left", socket.id)
					}
			
					var index = connections[key].indexOf(socket.id)
					connections[key].splice(index, 1)

					console.log(key, socket.id, Math.ceil(diffTime / 1000))

					if(connections[key].length === 0){
						delete connections[key]
					}
				}
			}
		}
	})
})


server.listen(app.get('port'), () => {
	console.log("listening on", app.get('port'))
})

app.listen(8800, () => {
  console.log("Backend server is running!");
});

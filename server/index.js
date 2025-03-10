const express = require("express")
const cors=require("cors");
const mongoose=require("mongoose");
const userRoutes=require("./routes/userRoutes")
const messageRoute =require("./routes/messagesRoute");

const app=express();
const socket=require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth",userRoutes);
app.use("/api/messages",messageRoute);

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("DB connected successfully");
}).catch((error)=>{
    console.log(error.message);
});

const server=app.listen(process.env.PORT||10000,()=>{
    console.log(`Server Started on Port ${process.env.PORT}`);
});

const io=socket(server,{
    cors:{
        origin:"https://verdant-parfait-19c001.netlify.app",
        credentials:true
    }
});

global.onlineUsers=new Map();

io.on("connection",(socket)=>{
    global.chatSocket=socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id);
    })

socket.on("send-msg",(data)=>{
    const sendUserSocket=onlineUsers.get(data.to);
if(sendUserSocket){
    socket.to(sendUserSocket).emit("msg-recieve",data.message);
}
    })

})
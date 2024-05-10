import express from 'express';
import {createServer} from "http"
import {Server} from "socket.io"
import { configDotenv } from 'dotenv';

const app = express()
const server = createServer(app)
configDotenv({
    path : "./config.env"
})
const io = new Server(server,{
    cors : {
        origin : process.env.ORIGIN,

    }
})
app.get("/",(req,res)=>{
    res.send("Hello World socket")
})

let connectedUser = []
io.on('connection', (socket) => {
    console.log("user is connected" , socket.id)
    if(connectedUser.length === 0){
        connectedUser.push(socket.id)
    }
    socket.emit("connected", connectedUser)
    socket.on("click",(btn)=>{
        socket.broadcast.emit("btnClicks",(`Button ${btn}`))
    })

    socket.on("position" , (da)=>{
        io.emit("newPos" , da)
    })
      socket.on("clickPos",(data)=>{
        socket.broadcast.emit("newclick" , data)
      })
    socket.on('disconnect', () => {
        console.log('user disconnected');
        if(socket.id === connectedUser[0]){
            connectedUser.pop()
        }
      });
  });

server.listen(process.env.PORT, ()=>{
    console.log("server Is Running At Port ", process.env.PORT);
})
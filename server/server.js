const { v4 } = require('uuid')
const { createRoom, addMessage, addUser, removeUser, getAllRooms } = require('../client/utils')
const bcrypt = require('bcrypt')



const http = require('http')
    .createServer((req, res) => {
        res.end("<h1>If you see this message it means that you are already able to connect to the server, try again through the terminal using the client.js file</h1>")
} )
const io = require('socket.io')(http)
const PORT = process.env.PORT || 3000

// IO => server side
// socket => client side
io.on("connection", (socket) => {
    console.log("A client has connected\n")

    
    
    socket.on("create-room", (roomData, user) => {
    
        bcrypt.hash(roomData.password, 10, (err, hash) => {            
            
            let roomJson = {
                "id": v4(),
                "creator": user.nome,
                "messages": 0,
                "users-online": 0,
                "secure": roomData.secure,
                "password": hash,
                "created": Date()
            }
            createRoom(roomJson)
            
            io.to(socket.id).emit("create-room-confirm", roomJson.id)
            io.to(socket.id).emit("set-rooms", data)

        })
    })
    
    
    socket.on("get-rooms", () => {
        let data = getAllRooms()
    
        io.to(socket.id).emit("set-rooms", data)
    })
    socket.on("connect-room", (data) => {
        try {
            
            socket.join(data.room)
            addUser(data.room)
            let rooms = getAllRooms()
            io.in(data.room).emit("update", data, rooms)
            io.in(data.room).emit("success-connect", data)
        } catch(error) {
            console.log(error)
            io.to(socket.id).emit("connect-error")
        }
    })

    socket.on("message", (messageData) => {
        addMessage(messageData.room)
        let rooms = getAllRooms()
        io.in(messageData.room).emit("update", messageData,rooms)
        io.in(messageData.room).emit("message-send", messageData)
    })
    socket.on("chat-disconnection", (user) => {
        removeUser(user.room)
        let data = getAllRooms()
        io.in(user.room).emit("chat-disconnect", user)
        io.in(user.room).emit("update", user, data)
        
    })  

})


http.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}`)
})


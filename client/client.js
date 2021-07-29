// you want to change this the http://localhost:3000 to the port of your server
const socket = require('socket.io-client')("http://localhost:3000")
const { parseUser, displayRooms, userMenu, getRoomInfo, roomIsSecure, getPassword, passwordCheck, collectARoom } = require("./utils")
const { Chat } = require('./chat')
const chalk = require('chalk')

let chat

socket.on("connect", async () => {
    console.log(chalk.bold.yellow("--------WELCOME--------"))
    let user = await parseUser()
    console.log(chalk.bold.yellowBright("-----------------------"))
    while(true) {

        let menu = await userMenu()
        console.log(chalk.redBright("--------------------"))
        if(menu.menu == "join") {
            let { room } = await displayRooms()
            
            if(roomIsSecure(room)) {
                let userPassword = await getPassword(room)
                
                let match = await passwordCheck(room, userPassword)
                if(match) {
                    
                    chat = new Chat(room, {...user}, socket)
                    chat.init()
                    
                    socket.emit("connect-room", {room, ...user})        
                    break
                } else {
                    console.log(chalk.bold.red("Incorrect Password"))
                }
            } else {
                chat = new Chat(room, {...user}, socket)
                chat.init()
                socket.emit("connect-room", {room, ...user})
                break
            }
            
            
        } else if(menu.menu == "create") {
            let roomData = await getRoomInfo()
            socket.emit("create-room", roomData, user)
            
        } else {
            socket.disconnect()
            break
        }
        
    }

})

socket.on("success-connect", (data) => {
    chat.updateEvents(chalk.hex(data.cor).bold(`${data.nome} has connected\n`))
})

socket.on("message-send", (data) => {

    chat.showMessage(chalk.hex(data.cor).bold(`${data.nome}: ${data.text}`))
})
socket.on("update", (roomInfo) => {
    let result = collectARoom(roomInfo.room)
    chat.updateInfo(result.id, result["users-online"], result.messages, result.creator, result.created)
})

socket.on("chat-disconnect", (user) => {
    chat.updateEvents(chalk.hex(user.cor).bold(`${user.nome} has disconnected\n`))
})

socket.on("connect-error", (error) => {
    console.log(chalk.bold.red("an error happened"))
})

socket.on("create-room-confirm", (id ) => {
    console.log(chalk.bold.green(`Room created!\nID:${id}`))
})






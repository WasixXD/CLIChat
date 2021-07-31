const socket = require('socket.io-client')("http://5aeeefdcb237.ngrok.io")
const { parseUser, displayRooms, userMenu, getRoomInfo, roomIsSecure, getPassword, passwordCheck, collectARoom } = require("./utils")
const { Chat } = require('./chat')
const chalk = require('chalk')

let chat
let rooms

socket.on("connect", async () => {
    socket.emit("get-rooms")
    console.log(chalk.bold.yellow("--------WELCOME--------"))
    let user = await parseUser()
    console.log(chalk.bold.yellowBright("-----------------------"))
    while(true) {

        let menu = await userMenu()
        console.log(chalk.redBright("--------------------"))
        if(menu.menu == "join") {
            let { room } = await displayRooms(rooms)
            
            if(roomIsSecure(room, rooms)) {
                let userPassword = await getPassword(room)
                
                let match = await passwordCheck(room, userPassword, rooms)
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


socket.on("set-rooms" , (data) => {
    
    rooms = data
})

socket.on("success-connect", (data) => {
    chat.updateEvents(chalk.hex(data.cor).bold(`${data.nome} has connected\n`))
})

socket.on("message-send", (data) => {

    chat.showMessage(chalk.hex(data.cor).bold(`${data.nome}: ${data.text}`))
})
socket.on("update", (roomInfo, rooms) => {
    let result = collectARoom(roomInfo.room, rooms)
    chat.updateInfo(result.id, result["users-online"], result.messages, result.creator, result.created)
})

socket.on("chat-disconnect", (user) => {
    chat.updateEvents(chalk.hex(user.cor).bold(`${user.nome} has disconnected\n`))
})

socket.on("connect-error", (error) => {
    console.log(chalk.bold.red("an error happened"))
})

socket.on("create-room-confirm", (id ) => {
    console.log(chalk.bold.green(`\nRoom created!\nID:${id}`))
})






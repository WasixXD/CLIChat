const chalk = require('chalk')
const inquirer = require('inquirer')
const fs = require('fs')
const inquire = require('inquirer')
const bcrypt = require('bcrypt')



let inputs = [{
    type: "input",
    message: "What will be your nickname? >",
    name: "nome",
    default: "anonimous",
    loop: true
},{
    type: "input",
    message: "What will be your color? (Hexadecimal) >",
    name: "cor",
    default: "#FFFFFF",
    loop: true,
    validate: (input) => {

        return new Promise((resolve, reject) => {
            let regex = /^#[0-9A-F]{6}$/
            
            if(input[0] != "#") {
                reject(`\"#\" Its missing`)
            }
            if(!regex.test(input)) {
                
                reject(`${input} Its not a valid hex`)
            }
    
            resolve(true)

        })

        
    }
}]

//await? 
function parseUser() {
    return new Promise((resolve, reject) => {
        inquirer
        .prompt(inputs)   
        .then(( values ) => {
            resolve(values)
        })
        .catch(( error ) => {
            if(error) throw error
            reject(error)
        })
    })
}



function userMenu() {
    console.log(chalk.redBright("\n--------MENU--------"))
    return new Promise((resolve, reject) => {
        let options = [
            {
                name: "menu",
                type: "list",
                default: "exit",
                message: "Choose a option",
                choices: [{name: "Create a room", value: "create"}, {name: "Join a Room", value: "join"}, {name: "Exit", value:"exit"},]
            }
        ]
    
        inquire.prompt(options)
            .then(( values ) => {
                resolve(values)
            })
            .catch(( error ) => {
                reject(error)
            })
       
    })
}



function getAllRooms() {
    const data = JSON.parse(fs.readFileSync(__dirname + "/../server/rooms.json", "utf-8"))
    return data
}


function displayRooms() {
    return new Promise((resolve, reject) => {
        let questions = [
            {
                type: "list",
                name: "room",
                default: "global",
                message: "All rooms availables:",
                choices: []
            }
        ]
        let rooms = getAllRooms()
        for(let room of rooms) {
            questions[0].choices.push({name: `${room.id} ${room.secure? "🔒" : ""}`, value: room.id})
        }
        inquire.prompt(questions)
            .then(( values ) => {
                resolve(values)
            }) 
            .catch(( error ) => {
                reject(error)
            })
    }) 
    
}

function getRoomInfo() {
    return new Promise((resolve, reject) => {

        let options = [
            {
                type:"confirm",
                name: "secure",
                message:"Will be a private room?",
                default: false
            },{
                type: "password",
                name: "password",
                message: "Password (if is a public room the password will be empty)",
                default: "",
                mask: "*"
            }
        ]
    
        inquirer.prompt(options)
            .then(( values ) => {
                resolve(values)
                
            })
    })
       
}

function createRoom(data) {
    let oldJson = getAllRooms()
    oldJson.push(data)
    fs.writeFileSync(__dirname + "/../server/rooms.json", JSON.stringify(oldJson))
}


function roomIsSecure(id) {
    let result = getAllRooms()
    
    let [{ secure }] = result.filter((room) => { 
        if(room.id == id) {
            return room
        }
    })

    return secure
}




function getPassword(id) {
    //pegar a senha que a pessoa digitar
    return new Promise((resolve, reject) => {

        let options = [{
            type: "input",
            message: `CHAT ${id} - Password >`,
            name: "userPassword",
            default: ""
        }]
        inquirer
            .prompt(options)
            .then(( values ) => {
                
                resolve(values.userPassword)
            })
            .catch(( error ) => {
                reject(error)
            })
    })
}



async function passwordCheck(id, password) {
    //pegar a senha da sala
    let result = getAllRooms()
    let [roomPassword] = result.filter((room) => {
        if(room.id == id) {
            return room.password
            
        }
    })
    //ver se elas batem

    let match = await bcrypt.compare(password, roomPassword.password)
    
    return match
}




function addMessage(id) {
    let oldJson = getAllRooms()

    let [myroom] = oldJson.filter((room) => {
        if(room.id == id) {
            return room
        }
    })
  
    myroom.messages++
    
    fs.writeFileSync(__dirname + "/../server/rooms.json", JSON.stringify(oldJson))
    return oldJson[0]
}


function addUser(id) {
    let oldJson = getAllRooms()

    let [myroom] = oldJson.filter((room) => {
        if(room.id == id) {
            return room
        }
    })

    myroom["users-online"]++
    fs.writeFileSync(__dirname + "/../server/rooms.json", JSON.stringify(oldJson))  
}


function collectARoom(id) {
    let result = getAllRooms()

    let [theRoom] = result.filter((room) => {
        if(room.id == id) {
            return room
        }
    })

    return theRoom
}

function removeUser(id) {
    let oldJson = getAllRooms()

    let [myroom] = oldJson.filter((room) => {
        if(room.id == id) {
            return room
        }
    })

    myroom["users-online"] -= 1
    fs.writeFileSync(__dirname + "/../server/rooms.json", JSON.stringify(oldJson))  
}

module.exports = {
    parseUser,
    getAllRooms,
    displayRooms,
    userMenu,
    getRoomInfo,
    createRoom,
    roomIsSecure,
    passwordCheck,
    getPassword,
    addMessage,
    addUser,
    collectARoom,
    removeUser
}
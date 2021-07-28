const blessed = require('blessed')


function filter(message) {
    let result = ""
    for(let i = 0; i < message.length; i+= 2) {
        if(message[i] !=  " ") {
            result += message[i]
        } else {
            result += " "
        }

    }
    return result
}



class Chat {
    constructor(title, user, socket) {
        this.socket = socket
        this.user = user
        this.screen = blessed.screen({
            smartCSR: true,
            cursor: {
                artificial: true,
                blink: true,
                shape: 'underline'
            }
           
        })


        this.chatBox = blessed.list({
           
            width: "75%",
            height: "85%",
            bg: "black",
            border: {
                type: "line"
            },
            scrollbar: {
                style: {
                    bg: "white"
                }
            },
            vi: true,
            keys: true,
            scrollable: true,
            alwaysScroll: true,

            items: []
            
            
        })

        this.eventBox = blessed.text({
            left: "75%",
            width: "26.3%",
            height: "43.5%",
            border: {
                type: "line"
            },
            scrollable: true,
            
        })

        this.screen.title = title

        this.infoBox = blessed.text({
            width: "26.3%",
            height: "45%",
            top: "43%",
            left: "75%",
            border: {
                type: "line"
            },
            align: 'center'
        })


        this.input = blessed.textbox({
            width: "75%",
            parent: this.chatBox,
            top: "90%",
            border: "line",
            height: "12%",
            input: true,
            inputOnFocus: true,
            focused: false,
            vi: true,
           
        })

        


        this.screen.key(["/", "i"], () => [
            this.input.focus()
        ])

        this.screen.key(["s", ";"], () => {
            this.chatBox.focus()
        })

        this.input.key("enter", () => {
            let raw = this.input.getValue()
            
            let text = filter(raw)
            
            socket.send({...this.user, room: this.screen.title, text})
            this.input.clearValue()
        })
        

        this.screen.key(["q"], () => {
            socket.emit("chat-disconnection", {...this.user, room: this.screen.title})
            process.exit(0)
            
        })
        this.screen.render()
    }



    render() {
        this.screen.render()
    }


    updateEvents(nome) {
        this.eventBox.content += nome
    }
    
    updateInfo(id, online, messages, creator, created) {
        let text = `Chat-ID: ${id},\n\nOnline-Users: ${online},\n\nMessages: ${messages},\n\nChat-Creator: ${creator}\n\nCreated: ${created}`
        
        this.infoBox.content = text
        this.render()
    }
    
    showMessage(message) {
        this.chatBox.add(message)
        this.screen.render()
    }
    
    init() {
        this.screen.append(this.chatBox)
        this.screen.append(this.input)
        this.screen.append(this.infoBox)
        this.screen.append(this.eventBox)
        this.screen.render()
    }
    

}

// let chat = new Chat("uga", "user")
// chat.init()

// chat.input.key("C-s", () => {
//     this.input.focus()
// })





module.exports = {
    Chat
}
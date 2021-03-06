# CLIChat
<img src="https://github.com/WasixXD/CLIChat/blob/main/github/chat.png"/>

## A  CLi chat in real time
A app that can connect multiple clients in a server and talk to each other


## Installation
in this project, NodeJS version 16.3 was used

### Clone the repository
```
git clone https://github.com/WasixXD/CLIChat
``` 
### Install the dependencies
```
npm install
``` 

### For running the server
```
npm start
```

## How to use
after the installation, run a server with ngrok or some similar software

<img src="https://github.com/WasixXD/CLIChat/blob/main/github/clientfile.png"/>

and change the port in the client.js file


then make a .zip without the node_modules and send for the people you want 

## Features
* Server-side
	* Server listen for requests
	* Can connect multiple clients
	* Receive and send messages for exclusives rooms
	
* Client-side
	* Can connect to the server
	* User can customize his color and name
	* can see all the rooms and connect to them
	* can see the chat
		* See who goes in and out
		* see how many users are online, how many messages have been sent, etc.

## Dependencies
- [Chalk](https://www.npmjs.com/package/chalk) for the color customization
- [Inquirer](https://www.npmjs.com/package/inquirer)	for initials prompts
- [Socket.io](https://socket.io/) for the real time communication			
- [uuid](https://www.npmjs.com/package/uuid) for the rooms ids
- [bcrypt](https://www.npmjs.com/package/bcrypt) for the password hash

## Quick demo
![Demo](https://github.com/WasixXD/CLIChat/blob/main/github/ezgif.com-gif-maker.gif)

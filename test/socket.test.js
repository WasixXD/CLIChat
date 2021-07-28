
const { createServer } = require('http')

const { Server }= require('socket.io')
const Client = require('socket.io-client')




describe("Server-side", () => {
    let io, serverSocket, clientSocket, httpServer
    beforeAll((done) => {
        httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
            const port = httpServer.address().port;

            clientSocket = new Client(`http://localhost:${port}`);
            io.on("connection", (socket) => {
                serverSocket = socket;
            });
            clientSocket.on("connect", done);
            
        });
    });

    afterAll(() => {
        
        io.close()
        clientSocket.close()
        httpServer.close()
    })

    test("server is listening", (done) => {
        const expected = "yes"
        clientSocket.on("its running?", (args) => {
            expect(args).toBe(expected)
        })
        serverSocket.emit("its running?", "yes")
        done()
        
    })
})
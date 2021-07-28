const { getAllRooms, displayRooms, roomIsSecure, passwordCheck, addMessage } = require("../client/utils")


const DEFAULT_ROOM_JSON = {
    "id": "123",
    "creator": "lucas",
    "messages": 0,
    "users-online": 0,
    "secure": true,
    "password": "ugauga"
}


describe("Suite Tests for Utils.js", () => {
    test("Should return a json with rooms info", () => {
        let [result] = getAllRooms()
        
        expect(result).toStrictEqual(DEFAULT_ROOM_JSON)
    })


    test("should return a json with room id",  async () => {
        let expected = {room: "123"}
        let result = await displayRooms()

        expect(result).toStrictEqual(expected)
    })

    test("Should return a bool if the room has a password" ,()=> {
        const expected = true
        const result = roomIsSecure("123")

        expect(result).toBe(expected)
    })

    test("Should return a bool if the room-passwod match the user given password", () => {
        const expected = true
        const result = passwordCheck("123", "ugauga")
        expect(result).toBe(expected)
    })

    test("Should increase the message key when a user send a message", () => {
        const expected = {
            "id": "123",
            "creator": "lucas",
            "messages": 1,
            "users-online": 0,
            "secure": true,
            "password": "ugauga"
        }

        const result = addMessage("123")

        expect(result).toStrictEqual(expected)
    })
})
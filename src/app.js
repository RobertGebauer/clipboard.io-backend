const server = require('http').createServer();
const io = require('socket.io')(server, {})
const _ = require("lodash")

io.on('connection', client => {
    client.on('hello', (data) => {
        if (_.has(data, "room")) {
            client.join(data.room)
            client.to(data.room).emit("hello", {
                id: client.id,
                name: data.name,
                platform: data.platform
            })
        }
    })

    client.on('hello-back', (data) => {
        if (_.has(data, "source") && _.has(data, "target")) {
            client.to(data.target).emit("hello", {
                id: data.source,
                name: data.name,
                platform: data.platform,
                acceptedByPartner: true
            })
        }
    })

    client.on('clipboard', (data) => {
        if (_.has(data, "to")) {
            _.each(data.to, (id) => {
                client.to(id).emit("clipboard", {
                    clipboard: data.clipboard
                })

            })
        }
    })

    client.on('disconnecting', () => {
        const rooms = Object.keys(client.rooms)
        _.each(rooms, (room) => {
            client.to(room).emit("goodbye", {
                id: client.id
            })
        })
    })
});

server.listen(3000);
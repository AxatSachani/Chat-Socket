const socketio = require('socket.io')
const express = require('express')
const path = require('path')
const http = require('http')
require('./database/database')
const User = require('./models/User')
const { GroupName } = require('./models/GroupName')



const { generateMessage, adduser, getUser } = require('./function')
const Admin = require('./models/Admin')



const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT

app.post('/', async (req,res) => {
    res.send('done')
    io.on('connection', (socket) => {
        console.log('new websocket connected');

        socket.on('join', async (data) => {   //data => id(userId), username, room
            // adduser(data)
            socket.join(data.room)
            socket.emit('join', 'user added')
        })

        socket.on('messages', async (data) => {   //data => id(userId), username, room
            const Group = GroupName(data.group)  // group name (Card,Rummy...)
            const groupData = await Group.findOne({})
            socket.emit('messages', groupData)
        })

        socket.on('message', async (data) => {  //message => id(userId), username, room, text(message)
            // const user = getUser(data.id)
            var client
            var createAt = new Date().getTime()
            var Group = GroupName(data.group)  // group name (Card,Rummy...)
            var groupData = await Group.findOne({})

            if (data.isAdmin) {
                client = await Admin.findById(data.id)
                io.to(data.room).emit('message', generateMessage(client.id, client.name, data.room, data.message, data.isAdmin, createAt))
                const data1 = { userId: client.id, username: client.name, message: data.message, profile: "", time: createAt }
                groupData.message.push(data1)
                await groupData.save()
            } else {
                console.log("found user");
                client = await User.findById(data.id)
                io.to(data.room).emit('message', generateMessage(client.id, client.name, data.room, data.message, data.isAdmin, createAt, profile = client.user_profile))
                const data1 = { userId: client.id, username: client.name, message: data.message, profile: client.user_profile, time: createAt }
                groupData.message.push(data1)
                await groupData.save()
            }
        })
        socket.on('diconnect', () => {
            console.log('close');
        })

    })
})


server.listen(port, () => {
    console.log(`Server on ${port}`);
})
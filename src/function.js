var users = []
const adduser = (data) => {
    id = data.id
    username = data.username
    const user = { id, username }
    users.push(user)
    return user
}

//getUser
const getUser = (id) => {
    return users.find((user) => user.id == id)
}

const generateMessage = (id, username, room, message, isAdmin, createAt, profile = "") => { // data => id(userId), username, room, text
    console.log(id, username, room, message, profile, isAdmin);
    console.log("admin=" + isAdmin);
    return {
        id,
        username,
        room,
        message,
        isAdmin,
        createAt,
        profile
    }
}
// console.log(generateMessage());

module.exports = {
    adduser,
    getUser,
    generateMessage
}
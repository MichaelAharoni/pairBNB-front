import { storageService } from './async-storage.service'
import { httpService } from './http.service'
import { socketService } from './socket.service'

// import userSvg from "../styles/svg/user.svg";

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const STORAGE_KEY = 'userDB'
var gWatchedUser = null;

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    setLoggedinUser,
    getUsers,
    getById,
    update,
    updateNotification
}

function getUsers() {
    return httpService.get(`user`)
    // return JSON.parse(localStorage.getItem(STORAGE_KEY))
}

async function getById(userId) {
    const user = await httpService.get(`user/${userId}`)
    gWatchedUser = user;
    return user;
    // gWatchedUser = userId;
    // return userId;
}
function remove(userId) {
    return httpService.delete(`user/${userId}`)
    // return userId
}

async function update(user) {
    user = await httpService.put(`user`, user)
    return user;
    // if (getLoggedinUser()._id === user._id) _saveLocalUser(user)
}
async function updateNotification(id, notification) {

    const user = await httpService.put(`user/notification`, { id, notification })
    return user;
    // if (getLoggedinUser()._id === user._id) _saveLocalUser(user)
}

async function login(userCred) {
    const users = await getUsers();
    return new Promise(async (resolve, reject) => {
        const currUser = users.find(user => user.email === userCred.email)
        if (!currUser) return reject({ reason: 'User doesn\'t exists', unsolved: 'email' });
        // else if (currUser.password !== userCred.password) {
        //     if (!userCred.isSocial) return reject({ reason: 'Incorrect user password', unsolved: 'password' });
        // }
        if (currUser) {
            _saveLocalUser(currUser);
            try {
                const user = await httpService.post('auth/login', userCred)
                if (user) _saveLocalUser(user);
                socketService.emit('join-room', user._id)
                return resolve(user);
            }
            catch (err) {
                return reject({ reason: 'Wrong email or password', unsolved: 'password' })
            }
        }
        else return reject({ reason: 'User doesn\'t exists', unsolved: 'email' });
    })
}
async function signup(userCred) {
    const users = await getUsers()
    return new Promise(async (resolve, reject) => {
        let currUser = users.find(user => user.email === userCred?.email)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (currUser === -1) currUser = null;
        else if (currUser) {
            return reject({ reason: 'Email already exists', unsolved: 'email' });
        }
        else if (!emailRegex.test(userCred?.email)) return reject({ reason: 'Invalid email pattern : ' + userCred.email, unsolved: 'email' });
        else if (!userCred.isSocial && userCred.password?.length < 5) return reject({ reason: 'password should have at list 6 digits / letters', unsolved: 'password' });

        _saveLocalUser(userCred);
        const user = await httpService.post('auth/signup', userCred)
        _saveLocalUser(user)
        return resolve(user);
        // socketService.emit('set-user-socket', user._id);
    })
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    await httpService.post('auth/logout')
    return socketService.off('join-room')
}


function _saveLocalUser(user) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER) || 'null')
}
function setLoggedinUser(newUser) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(newUser))
}


// addDemoData()
// function addDemoData() {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify([
//         {
//             _id: 124,
//             email: "koren",
//             fullName: "koren aharon",
//             password: "123",
//             imgUrl: 'https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876792/koren_xp3iwz.jpg',
//             likedStays: [
//                 {
//                     "_id": "mongo001",
//                     "name": "House Of Uncle My"
//                 }
//             ]

//         },
//         {
//             _id: 125,
//             email: "michael",
//             fullName: "michael aharoni",
//             password: "123",
//             imgUrl: 'https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876794/michael_c38spz.jpg',
//             likedStays: [
//                 {
//                     "_id": "mongo001",
//                     "name": "Jaklino Riso"
//                 }
//             ]
//         },
//         {
//             _id: 126,
//             email: "idan",
//             fullName: "idan gez",
//             password: "123",
//             imgUrl: 'https://res.cloudinary.com/dqj9g5gso/image/upload/v1642876792/idan_pdyaio.jpg',
//             likedStays: [
//                 {
//                     "_id": "mongo001",
//                     "name": "Jaklino Riso"
//                 }
//             ]
//         },
//         {
//             _id: 127,
//             email: "tal",
//             fullName: "tal ekroni",
//             password: "123",
//             imgUrl: 'https://res.cloudinary.com/dqj9g5gso/image/upload/v1642926094/T02BJ4W8H45-U02KBCD8V4N-f8aebf3e2faa-512_douxlg.png',
//             likedStays: [
//                 {
//                     "_id": "mongo001",
//                     "name": "Jaklino Riso"
//                 }
//             ]
//         }
//     ]))




// }


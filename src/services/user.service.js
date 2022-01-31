import { httpService } from './http.service'
import { socketService } from './socket.service'


const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
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
}

async function getById(userId) {
    const user = await httpService.get(`user/${userId}`)
    // gWatchedUser = user;
    return user;
}

async function update(user) {
    user = await httpService.put(`user`, user)
    return user;
}
async function updateNotification(id, notification) {
    const user = await httpService.put(`user/notification`, { id, notification })
    return user;
}

async function login(userCred) {
    const users = await getUsers();
    return new Promise(async (resolve, reject) => {
        const currUser = users.find(user => user.email === userCred.email)
        if (!currUser) return reject({ reason: 'User doesn\'t exists', unsolved: 'email' });
        if (currUser) {
            _saveLocalUser(currUser);
            try {
                const user = await httpService.post('auth/login', userCred)
                if (user) _saveLocalUser(user);
                socketService.emit('socket-by-userId', user._id)
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
    })
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    await httpService.post('auth/logout')
    return socketService.off('socket-by-userId')
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

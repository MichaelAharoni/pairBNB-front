import { userService } from "../services/user.service";
import { socketService } from '../services/socket.service'
import { openMsg } from "../store/msg.action";


export function signingUp(user) {
    return async (dispatch) => {
        const currUser = await userService.signup(user)
        const action = { type: 'SET_USER', user: currUser };
        dispatch(action)
    }
}

export function signingIn(user) {
    return async (dispatch) => {
        const currUser = await userService.login(user)
        const action = { type: 'SET_USER', user: currUser };
        dispatch(action)
        // dispatch({ type: 'SET_MSG', msg: { txt: `Welcome ${currUser.fullName}`, type: 'success' } })
    }
}

export function signOut() {
    return async (dispatch) => {
        await userService.logout()
        const action = { type: 'SET_USER', user: null };
        dispatch(action)
    }
}

export function updateInputsErrorInfo(error) {
    return async (dispatch) => {
        const action = { type: 'UPDATE_INPUTS_ERROR', key: error.unsolved, content: error.reason };
        dispatch(action)

    }
}

export function updateUserNotifications(notifications) {
    return async (dispatch) => {
        const action = { type: 'SET_USER_NOTIFICATIONS', notifications };
        dispatch(action)
    }
}

export function updateUser(user) {
    return async (dispatch) => {
        userService.update(user)
        const action = { type: 'UPDATE_USER', user };
        dispatch(action)
    }
}
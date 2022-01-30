

export function closeMsg() {
    return (dispatch) => {
        dispatch({ type: 'SET_MSG', msg: { txt: '', type: '' } })
    }

}

export function openMsg(msg) {
    return (dispatch) => {
        dispatch({ type: 'SET_MSG', msg })
    }

}

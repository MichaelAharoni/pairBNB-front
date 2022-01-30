import { userService } from '../services/user.service'

const initialState = {
	user: userService.getLoggedinUser() || {},
	connectionError: {
		fullName: '',
		email: '',
		password: ''
	},
};

export function userReducer(state = initialState, action) {
	let newState = state;
	switch (action.type) {
		case 'SET_USER':
			newState = { ...state, user: action.user }
			break;
		case 'UPDATE_USER':
			newState = { ...state, user: action.user }
			break;
		case 'SET_USER_NOTIFICATIONS':
			newState = { ...state, user:{...state.user,notifications:action.notifications} }
			break;
		case 'UPDATE_INPUTS_ERROR':
			const { key } = action;
			newState = { ...state, connectionError: { ...state.connectionError, [key]: action.content } }
			console.log(state)
			break;
		default:
	}
	return newState;
}
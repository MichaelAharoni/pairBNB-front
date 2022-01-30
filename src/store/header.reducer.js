const initialState = {
    headerMode: {
        headerLayoutSmall: false,
        isTop: true,
        isActive: true,
        isExplore: false
    }
};

export function headerReducer(state = initialState, action) {
    let newState = state;
    switch (action.type) {
        case 'TOGGLE_HEADER_LAYOUT':
            newState = { headerMode: { ...state.headerMode, headerLayoutSmall: action.set } }
            break;
        case 'TOGGLE_HEADER_ISTOP':
            newState = { headerMode: { ...state.headerMode, isTop: action.set } }
            break;
        case 'TOGGLE_HEADER_ISACTIVE':
            newState = { headerMode: { ...state.headerMode, isActive: action.set } }
            break;
        case 'SET_EXPLORE_MODE':
            newState = { headerMode: { ...state.headerMode, isExplore: action.set } }
            break;
        default:
    }
    return newState;
}

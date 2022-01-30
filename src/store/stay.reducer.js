const initialState = {
    stays: [],
    staysToShow: [],
    filterBy: null,
    stayType: {
        "Entire place": false,
        "Hotel room": false,
        "Private room": false,
        "Shared room": false,
    },
    stayPrice: {
        minPrice: 0,
        maxPrice: 1000,
    },
    searchParams:
    {
        adults: 1,
        checkIn: null,
        checkOut: null,
        children: 0,
        guestsCount: 1,
        infants: 0,
        location: ""
    },
};

export function stayReducer(state = initialState, action) {
    let newState = state;
    switch (action.type) {
        case 'SET_STAYS':
            newState = { ...state, stays: [...action.stays] }
            break;
        case 'SET_STAYS_TO_SHOW':
            newState = { ...state, staysToShow: [...action.staysToShow] }
            break;
        case 'ADD_STAY':
            newState = { ...state, stays: [action.newstay, ...state.stays] }
            break;
        case 'UPDATE_STAY':
            newState = {
                ...state, stays: state.stays.map(stay => (stay._id === action.updatedSTAY._id) ? action.updatedSTAY : stay)
            }
            break;
        case 'REMOVE_STAY':
            let stays = state.stays.filter(stay => stay._id !== action.stayId)
            newState = { ...state, stays }
            break;
        case 'SET_PARAMS':
            newState = { ...state, searchParams: (action.searchParams) }
            break;
        case 'SET_FILTER':
            newState = { ...state, filterBy: { ...action.filterBy } }
            break;
        case 'SET_STAY_TYPE':
            newState = { ...state, stayType: { ...action.stayType } }
            break;
        case 'SET_STAY_RANGE':
            newState = { ...state, stayPrice: { ...action.stayPrice } }
            break;
        case 'TOGGLE_HEADER_LAYOUT':
            newState = { ...state, headerLayoutSmall: action.set }
            break;
        default:
    }
    return newState;
}

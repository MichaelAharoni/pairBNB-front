import { stayService } from '../services/stay.service.js'

export function loadStays(params) {
    return async (dispatch) => {
        try {
            const stays = await stayService.query(params)
            dispatch({ type: 'SET_STAYS', stays });
            dispatch({ type: 'SET_STAYS_TO_SHOW', staysToShow: stays });
        } catch {
            console.log('could not get stays ');
        }
    };
}

export function sortByType(stays, filterBy, stayType, stayPrice) {
    return (dispatch) => {
        try {
            const sortedStays = stayService.sortStays(stays, filterBy, stayType, stayPrice)
            dispatch({ type: 'SET_STAY_TYPE', stayType });
            dispatch({ type: 'SET_STAYS_TO_SHOW', staysToShow: sortedStays });
        }
        catch {
            console.log('cannot filter stays')
        }
    }
}

export function sortByPrice(stays, filterBy, stayType, stayPrice, searchParams) {
    return (dispatch) => {
        try {
            const sortedStays = stayService.sortStays(stays, filterBy, stayType, stayPrice, searchParams)
            dispatch({ type: 'SET_STAY_RANGE', stayPrice });
            dispatch({ type: 'SET_STAYS_TO_SHOW', staysToShow: sortedStays });
        }
        catch {
            console.log('cannot filter stays')
        }
    }
}

export function sortByAmenities(stays, filterBy, stayType, stayPrice) {
    return (dispatch) => {
        try {
            const sortedStays = stayService.sortStays(stays, filterBy, stayType, stayPrice)
            dispatch({ type: 'SET_FILTER', filterBy });
            dispatch({ type: 'SET_STAYS_TO_SHOW', staysToShow: sortedStays });
        }
        catch {
            console.log('cannot filter stays')
        }
    }
}

export function setParams(searchParams) {
    return async (dispatch) => {
        try {
            dispatch({ type: 'SET_PARAMS', searchParams });

        } catch {
            console.log('could not set params ');
        }
    };
}

export function addStay(stay) {
    return async (dispatch) => {
        try {
            const savedStay = await stayService.save(stay)
            const action = { type: 'ADD_STAY', stay: savedStay }
            dispatch(action)
        }
        catch {
            console.error('canot add stay')
        }
    }
}


// export function loadSearchedStays(searchParams) {
//     return async (dispatch) => {
//         try {
//             const stays = await stayService.searchStays(searchParams)
//             dispatch({ type: 'SET_STAYS', stays });
//             dispatch({ type: 'SET_PARAMS', searchParams });

//         } catch {
//             console.log('could not get stays ');
//         }
//     };
// }

//consider use
// export function removeStay(stayId) {
//     return async (dispatch) => {
//         await stayService.remove(stayId)
//         console.log('Deleted Succesfully!');
//         dispatch({ type: 'REMOVE_TOY', stayId })
//     }
// }


//consider use
// export function updateStay(stay) {
//     return async (dispatch) => {
//         try {
//             const savedStay = await stayService.save(stay)
//             console.log('Updated Stay:', savedStay);
//             dispatch({ type: 'UPDATE_STAY', stay: savedStay })
//         }
//         catch {
//             console.log('cannot update stay')
//         }
//     }
// }

//for futre consider make dynamic dispach *******

// export function setStayType(stayType,) {
//     return (dispatch) => {
//         try {
//             dispatch({ type: 'SET_STAY_TYPE', stayType });
//         }
//         catch {
//             console.log('cannot filter stays')
//         }
//     }
// }


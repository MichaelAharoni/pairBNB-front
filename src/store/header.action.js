export function toggleDetailsLayout(set) {
    return (dispatch) => {
        try {
            dispatch({ type: 'TOGGLE_HEADER_LAYOUT', set });
        } catch {
            console.log('could not toggle ');
        }
    };
}

export function toggleHeaderIsTop(set) {
    return (dispatch) => {
        try {
            dispatch({ type: 'TOGGLE_HEADER_ISTOP', set });
        } catch {
            console.log('could not toggle ');
        }
    };
}

export function toggleHeaderIsActive(set) {
    return (dispatch) => {
        try {
            dispatch({ type: 'TOGGLE_HEADER_ISACTIVE', set });
        } catch {
            console.log('could not toggle ');
        }
    };
}


export function toggleIsExplore(set) {
    return (dispatch) => {
        try {
            dispatch({ type: 'SET_EXPLORE_MODE', set });
        } catch {
            console.log('could not toggle ');
        }
    };
}


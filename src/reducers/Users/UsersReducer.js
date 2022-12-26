import {
    GET_USERS
} from '../../actions/UserAction'

let defaultState = {
    users: []
}

export default function (state = defaultState, action) {
    switch (action.type) {
        case GET_USERS:
            return {
                ...state,
                users: action.users
            }

        default:
            return state;
    }
}
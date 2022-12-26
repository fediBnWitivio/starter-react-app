/**
 * Future fedi, be careful. This doesn't contain the actions of the AUTH. Those are in services.
 * We use this mainly for collaborators actions in invitations etc.
 * BTW: We must add a space for teams. They would be included here. Expl: getMyCollaborators() etc
 */
import axios from "axios";
import authHeader from "../services/auth-header";
export const GET_USERS = 'GET_USERS';
const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

export function usersFetched(users) {
    return {
        type: GET_USERS,
        users: users,
    }
}

export const getAllUsers = () => {
    return dispatch => {
        axios.get(`${ REACT_APP_BASE_URL }/user/`, { headers: authHeader() })
        .then(response => {
            if (response.data !== null) {
                return dispatch(usersFetched(response.data))
            }
        })
    }
}

export const searchUser = (searchInput) => {
    return dispatch => {
        axios.post(`${ REACT_APP_BASE_URL }/user/search`, {searchInput}, { headers: authHeader() })
        .then(response => {
            if (response.data !== null) {
                return dispatch(usersFetched(response.data))
            }
        })
    }
}

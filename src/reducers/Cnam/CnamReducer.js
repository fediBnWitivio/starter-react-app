import {
    GET_FILE,
    GET_FILES,
    ADD_FILE,
    SEARCH_MEDECINS,
    SEARCH_PATIENTS
} from '../../actions/CnamAction'

let defaultState = {
    file: [],
    files: [],
    patient: {},
    medecins: [],
    patients: []
}

export default function (state = defaultState, action) {
    switch (action.type) {
        case GET_FILE:
            return {
                ...state,
                file: action.file
            }

        case GET_FILES:
            return {
                ...state,
                files: action.files
            }

        case ADD_FILE:
            return {
                ...state,
                files: [...state.files, action.file]
            }

        case SEARCH_MEDECINS:
            return {
                ...state,
                medecins: action.medecins
            }

        case SEARCH_PATIENTS:
            return {
                ...state,
                patients: action.patients
            }

        default:
            return state;
    }
}

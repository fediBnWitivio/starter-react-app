import axios from "axios";
import authHeader from "../services/auth-header";
export const GET_FILE = 'GET_FILE';
export const GET_FILES = 'GET_FILES';
export const ADD_FILE = 'ADD_FILE';
export const SEARCH_MEDECINS = 'SEARCH_MEDECINS';
export const SEARCH_PATIENTS = 'SEARCH_PATIENTS';
const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

export function fileFetched(file) {
    return {
        type: GET_FILE,
        file: file,
    }
}

export function filesFetched(files) {
    return {
        type: GET_FILES,
        files: files,
    }
}

export function fileAdded(file) {
    return {
        type: ADD_FILE,
        file: file,
    }
}

export function medecinSearched(medecins) {
    return {
        type: SEARCH_MEDECINS,
        medecins: medecins,
    }
}

export function patientSearched(patients) {
    return {
        type: SEARCH_PATIENTS,
        patients: patients,
    }
}

export const getFile = (fileId) => {
    return dispatch => {
        axios.get(`${REACT_APP_BASE_URL}/file/${fileId}`)
            .then(response => {
                if (response.data) {
                    return dispatch(fileFetched(response.data))
                } else {
                    alert("Fichier introuvable. Réessayez de l'ouvrir de nouveau depuis l'accueil")
                }
            })
    }
}

export const getAllFiles = () => {
    return dispatch => {
        axios.get(`${REACT_APP_BASE_URL}/file/`)
            .then(response => {
                if (response.data) {
                    return dispatch(filesFetched(response.data))
                }
            })
    }
}

export const addFile = (name) => {
    return dispatch => {
        axios.post(`${REACT_APP_BASE_URL}/file/`, {name})
            .then(response => {
                if (response.data) {
                    return dispatch(fileAdded(response.data))
                }
            })
    }
}

export const addLine = (line, medecin, fileId) => {
    return dispatch => {
        axios.post(`${REACT_APP_BASE_URL}/file/line/${fileId}`, {line, medecin})
            .then(response => {
                if (response.data) {
                    window.location.reload()
                }
            })
    }
}

export const updateLine = (line, medecin, fileId, lineId) => {
    return dispatch => {
        axios.put(`${REACT_APP_BASE_URL}/file/line/${fileId}/${lineId}`, {line, medecin})
            .then(response => {
                if (response.data) {
                    window.location.reload()
                }
            })
    }
}

export const searchMedecin = (searchInput) => {
    return dispatch => {
        axios.post(`${REACT_APP_BASE_URL}/medecin/search/`, {searchInput})
            .then(response => {
                if (response.data)
                    return dispatch(medecinSearched(response.data))
            })
    }
}

export const searchPatient = (searchInput) => {
    return dispatch => {
        axios.post(`${REACT_APP_BASE_URL}/file/patient/search/`, {searchInput})
            .then(response => {
                if (response.data)
                    return dispatch(patientSearched(response.data))
            })
    }
}

export const deleteFile = (fileId) => {
    return dispatch => {
        axios.delete(`${REACT_APP_BASE_URL}/file/${fileId}`)
            .then(response => {
                if (response.data)
                    window.location.reload()
            })
    }
}

export const deleteLine = (id) => {
    return dispatch => {
        axios.delete(`${REACT_APP_BASE_URL}/file/line/${id}`)
            .then(response => {
                if (response.data)
                    window.location.reload()
            })
    }
}

import axios from "axios";
import authHeader from './auth-header';
import {log} from "three";

const API_URL = process.env.REACT_APP_BASE_URL;


class AuthService {
    login(login, password) {
        return axios
            .post(API_URL + "/user/authenticate", {
                login,
                password
            })
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    loginFacebook(data) {
        return axios
            .post(API_URL + "/user/facebookAuth", data)
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    loginGoogle(data) {
        return axios
            .post(API_URL + "/user/googleAuth", data)
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(login, fullName, userName, password) {
        return axios.post(API_URL + "/user/", {
            login,
            password,
            fullName,
            userName
        }).then(response => {
            return response.data.message;
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    getUserIp = () => {
        fetch('https://api.ipify.org?format=json').then(response => {
            return response.json();
        }).then((res) => {
            console.log(res.ip)
        }).catch((err) => console.error('Problem fetching my IP', err))
    }

    checkToken() {
        return axios.get(API_URL + '/user/checkToken', {headers: authHeader()}).then(
            response => {
                console.log(response)
                return true
            },
            error => {
                return false
            }
        )
    }

    getCurrentToken = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.accessToken)
            return user.accessToken;
    }

    checkValidationToken = (token) => {
        return axios.post(API_URL + "/user/email-activate", {token : token }).then(response => {
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response;
        }).catch(error => {
            return null;
        });

    }

    resetPassword = (login) => {
        return axios.post(API_URL + "/user/reset-password", {login : login }).then(response => {
            if (response.data) {
                return response.data;
            }
        }).catch((err) => {
            return null;
        })
    }

    changePassword = (token,newPassword) => {
        return axios.post(API_URL + "/user/change-password", {token:token, newPassword : newPassword }).then(response => {
            if (response.data) {
                return response.data;
            }
        }).catch((err) => {
            return null;
        })
    }

    updateUser = (userEntity) => {
        return axios.post(API_URL + "/user/update", userEntity).then(response => {
            if (response.data) {
                let user = JSON.parse(localStorage.getItem('user'));
                const token = user.accessToken;
                let newUser = response.data;
                newUser.accessToken = token;
                localStorage.setItem("user", JSON.stringify(newUser));
            }
            return response.data;
        }).catch((err) => {
            return null;
        })
    }

    deleteCategory = (login,newCategories) => {
        return axios.post(API_URL + "/user/delete-category", {login : login, newCategories :newCategories }).then(response => {
            if (response.data) {
                let user = JSON.parse(localStorage.getItem('user'));
                const token = user.accessToken;
                let newUser = response.data;
                newUser.accessToken = token;
                localStorage.setItem("user", JSON.stringify(newUser));
            }
            return response;
        }).catch(error => {
            return null;
        });
    }

    selectTeamToUser = (teamId) => {
        return axios.post(API_URL + "/user/select-team", {teamId}, {headers: authHeader()}).then(response => {
            if (response.data) {
                let user = JSON.parse(localStorage.getItem('user'));
                const token = user.accessToken;
                let newUser = response.data;
                newUser.accessToken = token;
                localStorage.setItem("user", JSON.stringify(newUser));
            }
            return response;
        }).catch(error => {
            return null;
        });
    }
}

export default new AuthService();

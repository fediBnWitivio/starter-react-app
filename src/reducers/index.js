import { combineReducers } from "redux"
import users from './Users/UsersReducer'
import cnam from './Cnam/CnamReducer'

export default combineReducers({
    users,
    cnam
})

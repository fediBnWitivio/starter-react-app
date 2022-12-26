import { applyMiddleware, createStore, compose } from "redux"
import thunk from "redux-thunk"
import combineReducers from "./reducers/index"

const middleware = [thunk];

const initialState = {}

const store = createStore(
    combineReducers,
    initialState,
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (a) => a
    ));

export default store;
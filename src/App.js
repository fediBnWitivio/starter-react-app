import React from 'react';
import {Router, Route, browserHistory, IndexRoute, Redirect} from 'react-router'
import CnamFormContainer from './containers/Cnam/CnamFormContainer';
import HomeCnamContainer from './containers/Cnam/HomeCnamContainer';
import Honoraires from './containers/Cnam/Honoraires';
import './App.scss';

function App() {
    return (
        <div className="App">
            <Router history={browserHistory}>
                <Route name="home" path="/" component={HomeCnamContainer}/>
                <Route name="cnam" path="/cnam/:fileId(/:patient)" component={CnamFormContainer}/>
                <Route name="table" path="/honoraires(/:fileId)" component={Honoraires}/>
            </Router>
        </div>
    );
}

export default App;

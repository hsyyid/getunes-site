import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route, withRouter} from 'react-router-dom';
import {Switch} from 'react-router-dom';

import {NotificationContainer} from 'react-notifications';

import App from './pages/app';
import Login from './pages/login';
import NotFound from './pages/notfound';

import registerServiceWorker from './registerServiceWorker';
import store from './store';

import "./css/style.css";
import 'react-notifications/lib/notifications.css';

ReactDOM.render(<Provider store={store}>
  <Router>
    <div>
      <Switch>
        <Route exact={true} path="/" component={App}/>
        <Route path="/auth" component={Login}/>

        <Route component={NotFound}/>
      </Switch>

      <NotificationContainer/>
    </div>
  </Router>
</Provider>, document.getElementById('root'));
registerServiceWorker();

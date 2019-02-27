import React from 'react';
import { Route, Switch } from 'react-router-dom';

import App from './components/App';
import TopMovies from './components/pages/TopMovies'
import Movie from './components/pages/Movie'

const routes = (
    <Switch>
        <Route exact
            path="/"
            render={() => <App><TopMovies /></App>}
        />
        <Route exact
            path="/movies/:id"
            render={() => <App><Movie /></App>}
        />
    </Switch>
);

export default routes;
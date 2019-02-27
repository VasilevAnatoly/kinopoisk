import {
  combineReducers
} from 'redux';
import {
  routerReducer as router
} from 'react-router-redux/lib';

// import alertStore from './alertStore';
import apiStore from './apiStore';


export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // alertStore,
    apiStore,
    router,
    ...asyncReducers
  })
}

export const injectReducer = (store, {
  key,
  reducer
}) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
}

export default makeRootReducer
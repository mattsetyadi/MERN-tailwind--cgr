// root reducer for combine all reducers in app
import { combineReducers } from 'redux';
import auth from './auth';
import product from './product';

export default combineReducers({
  auth,
  product,
});

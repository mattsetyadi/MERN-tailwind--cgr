import axios from 'axios';
import { toast } from 'react-toastify';
import setAuthToken from '../../helpers/setAuthToken';
import { URLDevelopment } from '../../helpers/URL';

// Types
const REGISTER_SUCCESS = 'REGISTER_SUCCESSS';
const REGISTER_FAIL = 'REGISTER_FAIL';
const LOGIN_SUCCESS = 'LOGIN_SUCCESSS';
const LOGIN_FAIL = 'LOGIN_FAIL';
const USER_LOADED = 'USER_LOADED';
const AUTH_ERROR = 'AUTH_ERROR';
const LOG_OUT = 'LOG_OUT';
const SET_LOADING = 'SET_LOADING';

// initial states
const initialStates = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

// Reducers, I like to call it key to data layer
export default function foo(state = initialStates, action) {
  const { type, payload } = action;
  switch (type) {
    // Loa user
    case USER_LOADED:
      return {
        ...state,
        user: payload,
        isAuthenticated: true,
        loading: false,
      };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      // Set token in local storage
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };

    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };

    case AUTH_ERROR:
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case LOG_OUT:
      // Remove token from local storage
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };

    default:
      return state;
  }
}

// Action - Load user info from db
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get(`${URLDevelopment}/api/user`);
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    console.log(error.response);
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Action - Register
export const register = ({ name, email, password }) => async (dispatch) => {
  // Config header to axios
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Set Body
  const body = JSON.stringify({ name, email, password });

  // setLoading
  dispatch({
    type: SET_LOADING,
  });

  try {
    // response
    const res = await axios.post(
      `${URLDevelopment}/api/user/register`,
      body,
      config,
    );

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => toast.error(error.msg));
    }

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Action - Login
export const login = ({ email, password }) => async (dispatch) => {
  // Config header to axios
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Set Body
  const body = JSON.stringify({ email, password });

  // setLoading
  dispatch({
    type: SET_LOADING,
  });

  try {
    // response
    const res = await axios.post(
      `${URLDevelopment}/api/user/login`,
      body,
      config,
    );

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => toast.error(error.msg));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

export const logout = () => (dispatch) => {
  dispatch({
    type: LOG_OUT,
  });
};

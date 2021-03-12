import { URLDevelopment } from '../../helpers/URL';
import axios from 'axios';

// Types
const GET_PRODUCTS = 'GET_PRODUCTS';
const NO_PRODUCTS = 'NO_PRODUCTS';

const initialStates = {
  products: [],
  loading: true,
};

// reducers
export default function foo(state = initialStates, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: payload,
        loading: false,
      };

    case NO_PRODUCTS:
      return {
        ...state,
        products: [],
        loading: false,
      };

    default:
      return state;
  }
}

// Action get product
export const getProducts = () => async (dispatch) => {
  try {
    const res = await axios.get(`${URLDevelopment}/api/product/list`);

    dispatch({
      type: GET_PRODUCTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: NO_PRODUCTS,
    });
  }
};

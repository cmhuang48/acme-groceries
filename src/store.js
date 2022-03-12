import { createStore, combineReducers, applyMiddleware } from 'redux';
import axios from 'axios';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

// const initialState = {
//   groceries: [],
//   view: ''
// };

// const store = createStore((state = initialState, action)=> {
//   if(action.type === 'LOAD'){
//     state = {...state, groceries: action.groceries };
//   }
//   if(action.type === 'UPDATE'){
//     state = {...state, groceries: state.groceries.map(grocery => grocery.id === action.grocery.id ? action.grocery : grocery )};
//   }
//   if(action.type === 'CREATE'){
//     state = {...state, groceries: [...state.groceries, action.grocery ]}
//   }
//   if(action.type === 'SET_VIEW'){
//     state = {...state, view: action.view};
//   }
//   return state;
// });

const LOAD = 'LOAD';
const UPDATE = 'UPDATE';
const CREATE = 'CREATE';
const SET_VIEW = 'SET_VIEW';

const groceriesReducer = (state = [], action) => {
  if (action.type === LOAD) {
    return action.groceries;
  }
  if (action.type === UPDATE) {
    return state.map(grocery => grocery.id === action.grocery.id ? action.grocery : grocery);
  }
  if (action.type === CREATE) {
    return [...state, action.grocery];
  }
  return state;
}

const viewReducer = (state = '', action) => {
  if (action.type === SET_VIEW) {
    return action.view;
  }
  return state;
}

const load = () => {
  return async (dispatch) => {
    const groceries = (await axios.get('/api/groceries')).data;
    dispatch({type: LOAD, groceries});
  }
}

const update = (grocery) => {
  return async (dispatch) => {
    const updated = (await axios.put(`/api/groceries/${grocery.id}`, { purchased: !grocery.purchased })).data;
    dispatch({type: UPDATE, grocery: updated});
  }
}

const createNew = (name) => {
  return async (dispatch) => {
    const grocery = (await axios.post('/api/groceries', { name })).data;
    dispatch({type: CREATE, grocery});
  }
}

const createRandom = () => {
  return async (dispatch) => {
    const grocery = (await axios.post('/api/groceries/random')).data;
    dispatch({type: CREATE, grocery});
  }
}

const setView = (view) => {
  return {
    type: SET_VIEW,
    view
  }
}

const reducer = combineReducers({
  groceries: groceriesReducer, 
  view: viewReducer
});

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;
export { load, update, createNew, createRandom, setView };
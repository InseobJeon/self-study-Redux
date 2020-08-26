import React from 'react';
import { ADD_TODO,
         TOGGLE_TODO,
         VisibilityFilters, 
         SET_VISIBILITY_FILTER
        } from './actions'

const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
}

function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
      })
    default:
        return state;
  }
}

function App() {
  return (
    <div>
      hello world
    </div>
  );
}

export default App;

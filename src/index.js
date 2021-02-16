import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import store from './store'
import {Provider} from 'react-redux'

import './api/server'

// console.log('Initial state: ', store.getState())
//
// const unsubscribe = store.subscribe(()=>{
//     console.log('Store after dispatch: ' + store.getState())
// })
//
// console.log('Dispatching action')
// store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about actions' })
// console.log('Dispatch complete')
//
// store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about reducers' })
// store.dispatch({ type: 'todos/todoAdded', payload: 'Learn about stores' })
//
// store.dispatch({ type: 'todos/todoToggled', payload: 0 })
// store.dispatch({ type: 'todos/todoToggled', payload: 1 })
//
// store.dispatch({ type: 'filters/statusFilterChanged', payload: 'Active' })
//
// store.dispatch({
//     type: 'filters/colorFilterChanged',
//     payload: { color: 'red', changeType: 'selected' }
// })
//
// unsubscribe();
//
// store.dispatch({ type: 'todos/todoAdded', payload: 'Try creating a store' })

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

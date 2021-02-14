import { createStore, compose, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducer'
import { print1, print2, print3 } from './exampleAddons/middleware'
import {
    sayHiOnDispatch,
    includeMeaningOfLife
} from './exampleAddons/enhancers'

// const composedEnhancer = compose( sayHiOnDispatch, includeMeaningOfLife )
const composedEnhancer = composeWithDevTools(applyMiddleware(print1, print2, print3))

// const middlewareEnhancer = applyMiddleware(print1, print2, print3)

// const store = createStore(rootReducer, undefined, composedEnhancer)
const store = createStore(rootReducer, composedEnhancer)

export default store

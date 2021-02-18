import {client} from '../../api/client'
import { createSelector } from 'reselect'
import {StatusFilters} from '../filters/filtersSlice'

const initialState = {
    status: 'idle',
    entities: {}
}

function nextTodoId(todos) {
    const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
    return maxId + 1
}

export default function todosReducer(state = initialState, action) {
    switch (action.type) {

        case 'todos/todoAdded': {
            const todo = action.payload
            // Can return just the new todos array - no extra object around it
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [todo.id]: todo
                }
            }

        }
        case 'todos/todoToggled': {
            const todoId = action.payload
            const todo = state.entities[todoId]
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [todoid]: {
                        ...todo,
                        completed: !todo.completed
                    }
                }
            }
        }
        case 'todos/colorSelected': {
            const { color, todoId } = action.payload
            const todo = state.entities[todoId]
            return {
                ...state,
                entities: {
                    ...state.entities,
                    [todoId]: {
                        ...todo,
                        color
                    }
                }
            }
        }
        case 'todos/todoDeleted': {
            const newEntities = {...state.entites}
            delete newEntities[action.payload]
            return {
                ...state,
                entities: newEntities
            }
        }
        case 'todos/allCompleted': {
            const newEntities = {...state.entities}
            Object.values(newEntities).forEach(todo => {
                newEntities[todo.id] = {
                    ...todo,
                    completed: true
                }
            })
            return {
                ...state,
                entities: newEntities
            }
        }
        case 'todos/completedCleared': {
            const newEntities ={...state.entities}
            Object.values(newEntities).forEach(todo => {
                if(todo.completed)
                    delete newEntites[todo.id]
            })
            return {
                ...state,
                entities: newEntities
            }
        }
        case 'todos/todosLoaded': {
            const newEntities ={}
            action.payload.forEach(todo => {
                newEntities[todo.id] = todo
            })
            return {
                ...state,
                status: 'idle',
                entities: newEntities
            }
        }
        case 'todos/todosLoading': {
            return {
                ...state,
                status: 'loading'
            }
        }
        default:
            return state
    }
}

export const todosLoaded = todos => {
    return {
        type: 'todos/todosLoaded',
        payload: todos
    }
}
export const todosLoading = ()=> {
    return {
        type: 'todos/todosLoading',
        payload:null
    }
}

// define a thunk function
export const fetchTodos = () => async (dispatch, getState) => {
    dispatch(todosLoading())
    const response = await client.get('/fakeApi/todos')

    dispatch(todosLoaded(response.todos))


    // const stateBefore = getState()
    // console.log('Todos before dispatch: ', stateBefore.todos.length)


    // const stateAfter = getState()
    // console.log('Todos after dispatch: ', stateAfter.todos.length)
}

export const todoAdded = todo => {
    return {
        type: 'todos/todoAdded',
        payload: todo
    }
}

// 外层函数，是一个同步函数，接受其他参数，如text
export const saveNewTodo = (text) =>{
    // 创建并返回内层的thunk函数，是一个异步函数
    const saveNewTodoThunk = async (dispatch, getState) => {
        const initialTodo = { text }
        const response = await client.post('/fakeApi/todos', {
            todo: initialTodo
        })

        dispatch(todoAdded(response.todo))
    }

    return saveNewTodoThunk
}

export const selectTodoIds = createSelector(
    // 传入一个或多个selector函数
    state => state.todos,
    // 传入要返回的selector函数，这个函数接受它前面所有的selector的结果作为参数
    todos => todos.map(todo => todo.id)
)

export const selectTodoEntities = state => state.todos.entities
export const selectTodos = createSelector(selectTodoEntities, entities => Object.values(entities))

export const selectFilteredTodos = createSelector(
    selectTodos,
    state => state.filters,
    (todos, filters) => {
        const { status, colors } = filters
        const showAllCompletions = status === StatusFilters.All
        if(showAllCompletions && colors.length === 0)
            return todos

        const completedStatus = status === StatusFilters.Completed
        return todos.filter( todo => {
            const statusMatches = showAllCompletions || todo.completed ===  completedStatus
            const colorMatches = colors.length === 0 || colors.includes(todo.color)
            return statusMatches && colorMatches
        })
    }
)

export const selectFilteredTdoIds = createSelector(
    selectFilteredTodos,
    filteredTodos => filteredTodos.map(todo => todo.id)
)
export const selectTodoById = (state, todoId) => {
    return selectTodoEntities(state)[todoId]
}

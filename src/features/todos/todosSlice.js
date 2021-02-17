import {client} from '../../api/client'
const initialState = []

function nextTodoId(todos) {
    const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1)
    return maxId + 1
}

export default function todosReducer(state = initialState, action) {
    switch (action.type) {
        case 'todos/todoAdded': {
            // Can return just the new todos array - no extra object around it
            return [
                ...state,
                action.payload
            ]
        }
        case 'todos/todoToggled': {
            return state.map((todo) => {
                if (todo.id !== action.payload) {
                    return todo
                }

                return {
                    ...todo,
                    completed: !todo.completed,
                }
            })
        }
        case 'todos/colorSelected': {
            const { color, todoId } = action.payload
            return state.map((todo) => {
                if (todo.id !== todoId) {
                    return todo
                }

                return {
                    ...todo,
                    color,
                }
            })
        }
        case 'todos/todoDeleted': {
            return state.filter((todo) => todo.id !== action.payload)
        }
        case 'todos/allCompleted': {
            return state.map((todo) => {
                return { ...todo, completed: true }
            })
        }
        case 'todos/completedCleared': {
            return state.filter((todo) => !todo.completed)
        }
        case 'todos/todosLoaded': {
            return action.payload
        }
        default:
            return state
    }
}

// define a thunk function
export const fetchTodos = async (dispatch, getState) => {
    const response = await client.get('/fakeApi/todos')

    const stateBefore = getState()
    console.log('Todos before dispatch: ', stateBefore.todos.length)

    dispatch({type: 'todos/todosLoaded', payload:response.todos})

    const stateAfter = getState()
    console.log('Todos after dispatch: ', stateAfter.todos.length)
}

// 外层函数，是一个同步函数，接受其他参数，如text
export const saveNewTodo = (text) =>{
    // 创建并返回内层的thunk函数，是一个异步函数
    const saveNewTodoThunk = async (dispatch, getState) => {
        const initialTodo = { text }
        const response = await client.post('/fakeApi/todos', {
            todo: initialTodo
        })

        dispatch({type: 'todos/todoAdded', payload:response.todo})
    }

    return saveNewTodoThunk
}

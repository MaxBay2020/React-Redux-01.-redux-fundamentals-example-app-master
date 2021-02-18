import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import TodoListItem from './TodoListItem'
import { selectFilteredTdoIds } from './todosSlice'

// const selectTodoIds = (state) => state.todos.map((todo) => todo.id)

const TodoList = () => {
    const todoIds = useSelector(selectFilteredTdoIds)
    const loadingStatus = useSelector(state => state.todos.status)

    if(loadingStatus==='loading'){
        return (
            <div className="todo-list">
                <div className="loader" />
            </div>
        )
    }

    const renderedListItems = todoIds.map((todoId) => {
        return <TodoListItem key={todoId} id={todoId} />
    })

    return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList

import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { saveNewTodo } from '../todos/todosSlice'

const Header = () => {
    const [text, setText] = useState('')
    const [status, setStatus] = useState('idle')
    const dispatch = useDispatch()

    const handleChange = (e) => setText(e.target.value)

    const handleKeyDown = async (e) => {
        // If the user pressed the Enter key:
        const trimmedText = text.trim()
        if (e.which === 13 && trimmedText) {
            // // Dispatch the "todo added" action with this text
            // dispatch({ type: 'todos/todoAdded', payload: trimmedText })
            // // And clear out the text input
            setStatus('loading')
            await dispatch(saveNewTodo(trimmedText))
            setText('')
            setStatus('idle')
        }
    }

    let isLoading = status ==='loading'
    let placeholder = isLoading ? '':'What needs to be done?'
    let loader = isLoading ? <div className="loader" /> : null

    return (
        <header className="header">
            <input
                className="new-todo"
                placeholder="What needs to be done?"
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
            />
            {loader}
        </header>
    )
}

export default Header

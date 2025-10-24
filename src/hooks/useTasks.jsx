import { useState } from "react"

export function useTasks() {
  const [tasks, setTasks] = useState([])

  const addTask = (task) => {
    setTasks((prev) => [...prev, { id: Date.now(), ...task }])
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return { tasks, addTask, deleteTask }
}

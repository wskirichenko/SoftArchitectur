'use strict'

const { ipcRenderer } = require('electron')

// delete todo by its text value ( used below in event listener)
const deleteTodo = (e) => {
  ipcRenderer.send('delete-todo', e.target.textContent)
}

// create add todo window button
document.getElementById('createTodoBtn').addEventListener('click', () => {
  ipcRenderer.send('add-todo-window')
})

// ------ my -------------
document.getElementById('openBtn').addEventListener('click', () => {
	ipcRenderer.send('open-dialog')
})
document.getElementById('sendBtn').addEventListener('click', () => {
	ipcRenderer.send('send1')
})

// on receive todos
ipcRenderer.on('todos', (event, todos) => {
  // get the todoList ul
  const todoList = document.getElementById('todoList')

  // create html string
  const todoItems = todos.reduce((html, todo) => {
    html += `<li class="todo-item">${todo}</li>`

    return html
  }, '')

  // set list html to the todo items
  todoList.innerHTML = todoItems

  // add click handlers to delete the clicked todo
  todoList.querySelectorAll('.todo-item').forEach(item => {
    item.addEventListener('click', deleteTodo)
	})
	
	// ----- по нажатию на Send ---------------------
	ipcRenderer.on('myData', function (event, xmlData) {
		document.getElementById('textFile').innerHTML = xmlData
	})

})

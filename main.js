'use strict'

const path = require('path')
const { app, ipcMain } = require('electron')

const Window = require('./Window')
const DataStore = require('./DataStore')
var 	xmlData		= "Нет данных" //Для записи данных из файла
// var puty = path.join(__dirname)

require('electron-reload')(__dirname)

// create a new todo store name "Todos Main"
const todosData = new DataStore({ name: 'Todos Main' })

function main () {
  // todo list window
  let mainWindow = new Window({
    file: path.join('renderer', 'index.html')
  })

  // add todo window
  let addTodoWin

  // TODO: put these events into their own file

  // initialize with todos
  mainWindow.once('show', () => {
		mainWindow.webContents.send('todos', todosData.todos)
  })

  // create add todo window
  ipcMain.on('add-todo-window', () => {
    // if addTodoWin does not already exist
    if (!addTodoWin) {
      // create a new add todo window
      addTodoWin = new Window({
        file: path.join('renderer', 'add.html'),
        width: 400,
        height: 400,
        // close with the main window
        parent: mainWindow
      })
      // cleanup
      addTodoWin.on('closed', () => {
        addTodoWin = null
      })
    }
  })

  // add-todo from add todo window
  ipcMain.on('add-todo', (event, todo) => {
    const updatedTodos = todosData.addTodo(todo).todos
    mainWindow.send('todos', updatedTodos)
  })

  // delete-todo from todo list window
  ipcMain.on('delete-todo', (event, todo) => {
    const updatedTodos = todosData.deleteTodo(todo).todos
    mainWindow.send('todos', updatedTodos)
	})

	// ----- Открытие диалогового окна ------------------------
	const { dialog } = require('electron')

	ipcMain.on('open-dialog', () => {
		dialog.showOpenDialog({ 
			properties: ['openFile', 'openDirectory', 'multiSelections']  // три параметра, чтобы откравать и файлы и каталоги
		}, function (files) {
			if (files !== undefined) {		// Если файл выбран то
				console.log('Массив путей к выбраным файлам', files)
				var fs = require('fs');
				fs.readFile(files[0], 'utf8', function (err, data) {
					if (err) return console.log(err);
					// data is the contents of the text file we just read
					xmlData = data
					// console.log(xmlData)
				});
			} else {
				console.log('Файл не выбран')
			}
		})
	})

	// ---- Вывод на форму данных из файла -------------
	ipcMain.on('send1', () => {
		// const dataSend = `<p>My data 123</p>`
		mainWindow.send('myData', xmlData)
		// console.log('Нажата send, data =', xmlData)
	})
	

}

app.on('browser-window-created', function (event, window) {
	console.log('Открылось новое окно')
})

app.on('ready', main)

app.on('window-all-closed', function () {
	console.log('Приложение остановлено')
  app.quit()
})



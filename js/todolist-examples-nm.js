/*! RoomTest-nm v1.1.0 | (c) GreenerSoft | https://roomjs.fr | MIT License */


var TodoListExamples = (() => {
	"use strict";

	const {elements, createData, getData, setData, map} = Room;


	function TodoList({todos}) {
		const {div, form, input, button} = elements();
		
		const deleteTodo = i => (todos.splice(i, 1), false);
		const todoElement = (todo, i) => form({onSubmit: e => deleteTodo(i)},
			input({
				type: "checkbox",
				checked: () => todo.done,
				onChange: e => todo.done = e.target.checked
			}),
			input({
				type: "text",
				value: () => todo.text,
				disabled: () => todo.done,
				onInput: e => todo.text = e.target.value
			}),
			button({disabled: () => !todo.done}, "Supprimer")
		);
		const addTodo = todo => (todos.push(todo), false);
		
		return div({class: "todoListBlock"},
			form({onSubmit: e => addTodo({text: e.target.text.value, done: false})},
				input({type: "text", name: "text", required: true}),
				button("Ajouter")
			),
			map(div({class: "todoList"}), todos, todoElement)
		);
	}

	function TodoListExample() {
		const {div} = elements();
		const todos = createData([]);
		const name = "TodoList";
		try {
			setData(todos, JSON.parse(localStorage.getItem(name)) || todos);
		} catch(e) {};
		const save = () => {
			try {
				localStorage.setItem(name, JSON.stringify(getData(todos)));
			} catch(e) {}
		};
		return div({onUnmount: save, onPageHide: save},
			TodoList({todos})
		);
	}

	function TodoListObject({todos, index}) {
		const {div, span, form, input, button, label} = elements();
		
		const addTodo = todo => (todos["k" + ++index.value] = todo, false);
		const deleteTodo = i => (delete todos[i], false);
		const todoElement = (todo, i) => form({onSubmit: () => deleteTodo(i)},
			label(
				input({
					type: "checkbox",
					checked: () => todo.done,
					onChange: e => todo.done = e.target.checked
				}),
				span(todo.text, " [", i, "] ")
			),
			button("Supprimer")
		);

		return div({class: "todoListBlock"},
			form({onSubmit: e => addTodo({text: e.target[0].value, done: false})},
				input({type: "text", required: true}),
				button("Ajouter")
			),
			map(div({class: "todoList"}), todos, todoElement)
		);
	}

	function TodoListObjectExample() {
		const {div} = elements();
		const index = createData(0);
		const todos = createData({});
		const nameIndex = "TodoListObjectIndex";
		const nameTodos = "TodoListObject";
		try {
			setData(index, JSON.parse(localStorage.getItem(nameIndex)));
			setData(todos, JSON.parse(localStorage.getItem(nameTodos)));
		} catch(e) {};
		const save = () => {
			try {
				localStorage.setItem(nameIndex, JSON.stringify(getData(index)));
				localStorage.setItem(nameTodos, JSON.stringify(getData(todos)));
			} catch(e) {}
		};
		return div({onUnmount: save, onPageHide: save},
			TodoListObject({todos, index})
		);
	}

	function TodoListArrayDelete({todos}) {
		const {div, span, form, input, button, label} = elements();
		
		const addTodo = todo => (todos.push(todo), false);
		const deleteTodo = i => (delete todos[i], false);
		const todoElement = (todo, i) => todo ? form({onSubmit: () => deleteTodo(i)},
			label(
				input({
					type: "checkbox",
					checked: () => todo.done,
					onChange: e => todo.done = e.target.checked
				}),
				span(todo.text, " [", i, "] ")
			),
			button("Supprimer")
		) : span("");

		return div({class: "todoListBlock"},
			form({onSubmit: e => addTodo({text: e.target[0].value, done: false})},
				input({type: "text", required: true}),
				button("Ajouter")
			),
			map(div({class: "todoList"}), todos, todoElement)
		);
	}

	function TodoListArrayDeleteExample() {
		const {div} = elements();
		const todos = createData([]);
		const name = "TodoListArrayDelete";
		try {
			setData(todos, JSON.parse(localStorage.getItem(name)) || todos);
		} catch(e) {};
		const save = () => {
			try {
				localStorage.setItem(name, JSON.stringify(getData(todos)));
			} catch(e) {}
		};
		return div({onUnmount: save, onPageHide: save},
			TodoListArrayDelete({todos})
		);
	}

	return {TodoListExample, TodoListObjectExample, TodoListArrayDeleteExample};

})();

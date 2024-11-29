/*! RoomTest v1.0.0 | (c) GreenerSoft | https://roomjs.fr | MIT License */


import {elements, createData, setData, createEffect, map} from "Room";


function DoubleCount1() {
	const {div, p, strong, br, button} = elements();
	const count1 = createData(0);
	const count2 = createData(0);
	return div(
		p(
			strong("Compte1 = "), count1, br(), 
			strong("Compte2 = "), count2, br(),
			strong("Somme = "), () => count1 + count2
		),
		p({style: {backgroundColor: "pink"}},
			button({onClick: () => count1.value++}, "Compte1 + 1"),
			button({onClick: () => count1.value--}, "Compte1 - 1"),
			button({onClick: () => count2.value++}, "Compte2 + 1"),
			button({onClick: () => count2.value--}, "Compte2 - 1"),
			button({onClick: () => (count1.value++, count2.value++)}, "Compte1 et 2 + 1"),
			button({onClick: () => (count1.value--, count2.value--)}, "Compte1 et 2 - 1")
		)
	);
}

function DoubleCount2() {
	const {div, p, strong, br, label, input, button} = elements();
	const count1 = createData(0);
	const count2 = createData(0);
	const operation = createData(1);
	const operationString = createData("");
	createEffect(() => setData(operationString, operation.value == 1 ? "+ 1" : "- 1"));
	return div(
		p(
			strong("Compte1 = "), count1, br(), 
			strong("Compte2 = "), count2, br(),
			strong("Somme = "), () => count1 + count2
		),
		p(
			label(input({type: "checkbox", checked: () => operation.value == 1, onChange: e => operation.value = e.target.checked ? 1 : -1}), "Addition"),
			button({onclick: () => count1.value += operation}, "Compte1 ", operationString),
			button({onclick: () => count2.value += operation}, "Compte2 ", operationString),
			button({onclick: () => (count1.value += operation, count2.value += operation)}, "Compte1 et 2 ", operationString)
		)
	)
}

function SymbolToPrimitive() {
	const {div, input, button, i} = elements();
	const user = createData({
		[Symbol.toPrimitive]() {
			return (this.firstname + " " + this.lastname).trim();
		},
		firstname: "Room",
		lastname: "GreenerSoft"
	});

	return div(
		div(
			input({type: "text", value: () => user.firstname, onInput: e => user.firstname = e.target.value}),
			input({type: "text", value: () => user.lastname, onInput: e => user.lastname = e.target.value}),
			button({onClick: () => setData(user, {firstname: "", lastname: "", test: {a: 1, b: 2}})}, "Reset"),
			user, " - ", i(() => user.test ? "Somme de test = " + (user.test.a + user.test.b) : "Pas de propriété test")
		)
	);
}

function ArrayManipulation() {
	const {div, button, ul, li} = elements();
	const getRandomArray = () => [...Array(10)].map(e => Math.random() * 10 | 0);
	const data = createData(getRandomArray());
	return div(
		div(
			button({onClick: () => data.reverse()}, "Reverse"),
			button({onClick: () => data.sort((a, b) => a > b)}, "Sort"),
			button({onClick: () => data.splice(5, 0, 9999)}, "Add"),
			button({onClick: () => data.splice(3, 0, data.splice(5, 1)[0])}, "Move 5 to 3"),
			button({onClick: () => setData(data, getRandomArray())}, "Reset")
		),
		map(ul(li("test")), data, (e, i) => li(e, " [", i, "]"))
	);
}

export {DoubleCount1, DoubleCount2, SymbolToPrimitive, ArrayManipulation}

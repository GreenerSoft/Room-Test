/*! RoomTest v1.1.0 | (c) GreenerSoft | https://roomjs.fr | MIT License */


import {elements, append, createData, setData, getData, untrack} from "Room";
import {DoubleCount1, DoubleCount2, SymbolToPrimitive, ArrayManipulation, StyleExample, SuspenseExample} from "SimpleExamples";
import {MapReactive, MapIPGeolocation, MapGeoJSON, MapNexrad, MapNexradAnimated, MapWorldRadarAnimated} from "MapExamples";
import {TodoListExample, TodoListObjectExample, TodoListArrayDeleteExample} from "TodoListExamples";


function App() {
	const {header, main, select, option} = elements();
	const components = [
		{name: "DoubleCount1", component: DoubleCount1},
		{name: "DoubleCount2", component: DoubleCount2},
		{name: "SymbolToPrimitive", component: SymbolToPrimitive},
		{name: "ArrayManipulation", component: ArrayManipulation},
		{name: "Style", component: StyleExample},
		{name: "Suspense", component: SuspenseExample},
		{name: "ToDolist", component: TodoListExample},
		{name: "TodoListObject", component: TodoListObjectExample},
		{name: "TodoListArrayDelete", component: TodoListArrayDeleteExample},
		{name: "MapReactive", component: MapReactive},
		{name: "MapIPGeolocation", component: MapIPGeolocation},
		{name: "MapGeoJSON", component: MapGeoJSON},
		{name: "MapNexrad", component: MapNexrad},
		{name: "MapNexradAnimated", component: MapNexradAnimated},
		{name: "MapWorldRadarAnimated", component: MapWorldRadarAnimated}
	]
	const index = createData(0);
	const name = "ComponentIndex";
	try {
		setData(index, JSON.parse(localStorage.getItem(name)) || index);
	} catch(e) {};
	const save = () => {
		try {
			localStorage.setItem(name, JSON.stringify(getData(index)));
		} catch(e) {}
	};
	
	return [
		header(
			select({onChange: e => index.value = e.target.value},
				components.map((c, i) => option({value: i, selected: i == index.value}, c.name))
			)
		),
		main({onUnmount: save, onPageHide: save},
			() => untrack(components[index].component)
		)
	];
}

append(document.body, App());

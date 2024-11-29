/*! RoomTest-nm v1.0.0 | (c) GreenerSoft | https://roomjs.fr | MIT License */


(() => {
	"use strict";

	const {elements, append, createData, setData, getData, createEffect, untrack} = Room;
	const {DoubleCount1, DoubleCount2, SymbolToPrimitive, ArrayManipulation} = SimpleExamples;
	const {MapReactive, MapIPGeolocation, MapGeoJSON, MapNexrad, MapNexradAnimated, MapWorldRadarAnimated} = MapExamples;
	const {TodoListExample, TodoListObjectExample, TodoListArrayDeleteExample} = TodoListExamples;
	

	function App() {
		const {header, main, select, option} = elements();
		const components = [
			{name: "DoubleCount1", component: DoubleCount1},
			{name: "DoubleCount2", component: DoubleCount2},
			{name: "SymbolToPrimitive", component: SymbolToPrimitive},
			{name: "ArrayManipulation", component: ArrayManipulation},
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
		const container = main({onUnmount: save, onPageHide: save});
		createEffect(async () => container.replaceChildren(await untrack(components[index].component)));
		return [
			header(
				select({onChange: e => index.value = e.target.value},
					components.map((c, i) => option({value: i, selected: i == index.value}, c.name))
				)
			),
			container
		];
	}
	
	append(document.body, App());
	
})();

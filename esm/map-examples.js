/*! RoomTest v1.0.0 | (c) GreenerSoft | https://roomjs.fr | MIT License */


import {elements, createData, setData, createEffect} from "Room";
import {EUCenter, FranceCenter, USACenter, OpenStreetMapProvider, L, MapContainer, addTileLayer} from "RoomLeaflet";


/* Source : https://mesonet.agron.iastate.edu/ogc/ */
const NexradProvider = () => ({
	wms: true,
	url: "https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0q.cgi",
	options: {
		layers: "nexrad-n0q-900913",
		format: "image/png",
		transparent: true,
		attribution: "Weather data © 2012 IEM Nexrad"
	}
});

/* Source : https://www.rainviewer.com/api/legacy.html */
const RainViewerProvider = (time, color, smooth, snow) => ({
	wms: false,
	url: "https://tilecache.rainviewer.com/v2/radar/" + time + "/256/{z}/{x}/{y}/" + color + "/" + smooth + "_" + snow + ".png",
	options: {
		tileSize: 256,
		opacity: 0,
		transparent: true,
		attribution: '<a href="https://rainviewer.com" target="_blank">rainnviewer.com</a>',
		zIndex: time
	}
});

async function MapReactive() {
	const {div, p, label, input, ul, li, strong} = elements();

	const center = createData(FranceCenter());
	const zoom = createData(6);

	const provider = OpenStreetMapProvider();

	const mount = map => {
		// Création du marqueur et de sa popup avec un contenu réactif sur le centre et le zoom
		const content = ul(
			li(strong("Latitude : "), () => center[0]), 
			li(strong("Longitude : "), () => center[1]),
			li(strong("Zoom : "), zoom)
		);
		const marker = L.marker(center).addTo(map).bindPopup(content, {className: "mapPopup", minWidth: 240}).openPopup();

		// Mise à jour du centre et du zoom par Leaflet
		map.on("move", () => setData(center, Object.values(map.getCenter())));
		map.on("zoom", () => setData(zoom, map.getZoom()));

		// Mise à jour du centre et du zoom de la carte ainsi que le centre du marqueur
		createEffect(() => {
			map.setView(center, zoom, {animate: false});
			marker.setLatLng(center);
		});
	};

	return div(
		p(
			label(strong("Latitude : "), input({
				type: "number",
				style: "width: 200px",
				min: -90,
				max: 90,
				step: 0.1,
				value: () => center[0],
				onInput: e => center[0] = parseFloat(e.target.value)
			})),
			label(strong("Longitude : "), input({
				type: "number",
				style: "width: 200px",
				value: () => center[1],
				onInput: e => center[1] = parseFloat(e.target.value)
			})),
			label(strong("Zoom : "), input({
				type: "number",
				min: 0,
				max: provider.options.maxZoom,
				value: zoom,
				onInput: e => zoom.value = parseFloat(e.target.value)
			}))
		),
		await MapContainer({provider, mount, center, scrollWheelZoom: false, zoom, minZoom: 4})
	);
}

async function MapIPGeolocation() {
	const {div, form, input, ul, li, strong} = elements();

	const address = createData("");
	const data = createData({});

	const mount = map => {
		// Création du marqueur et de sa popup avec un contenu réactif sur les données reçues de l'API
		const labels = ["IP", "Continent", "Pays", "Région", "Ville", "Latitude", "Longitude", "ISP", "Zone horaire", "Précision"];
		const keys = ['ip', "continent_code", "country", "region", "city", "latitude", "longitude", "organization_name", "timezone", "accuracy"];
		const content = ul(labels.map((label, i) => li(strong(label), " : ", () => data[keys[i]] || "")));
		const marker = L.marker(FranceCenter()).bindPopup(content, {className: "mapPopup"});

		// Mise à jour du centre et du zoom de la carte ainsi que le centre du marqueur et l’ouverture de sa popup
		createEffect(() => {
			if (data.ip) {
				const center = [
					parseFloat(data.latitude) || 0,
					parseFloat(data.longitude) || 0
				];
				map.flyTo(center, 12);
				marker.setLatLng(center).addTo(map).openPopup();
			}
		});
	};

	const readData = async () => {
		try {
			/* Autre : https://api.ipquery.io/ */
			const a = (address.value ? "/" + address : "").replace(/ /g, "");
			const response = await fetch(`https://get.geojs.io/v1/ip/geo${a}.json`);
			setData(data, await response.json());
		} catch (error) {
			console.error(error);
		}
	};

	const onSubmit = e => {
		address.value = e.target.address.value;
		e.target.address.select();
		return false;
	};
	
	return div({onMount: () => createEffect(readData)},
		form({onSubmit},
			input({
				type: "search",
				name: "address",
				value: address,
				required: true,
				spellcheck: "false",
				autocomplete: "off",
				placeholder: "Adresse IP (V4 ou V6)"
			})
		),
		await MapContainer({provider: OpenStreetMapProvider(), mount, center: FranceCenter(), scrollWheelZoom: false, zoom: 5})
	);
}

async function MapGeoJSON() {
	const {a, ul, li, strong} = elements();

	const options = () => {
		const blueMarker = L.divIcon({className: "marker blue", iconSize: [24, 24]});
		const redMarker = L.divIcon({className: "marker red", iconSize: [24, 24]});
		return {
			pointToLayer: (feature, latlng) => L.marker(latlng, {icon: feature.properties.type == "Sous-préfecture" ? redMarker : blueMarker}).bindTooltip(feature.properties.nom_commune)
		};
	};

	const popup = layer => ul(
		li(strong(a({
			href: encodeURI("https://fr.wikipedia.org/wiki/" + layer.feature.properties.nom_commune),
			target: "_blank",
			rel: "noopener"
		}, layer.feature.properties.nom_commune))),
		li(strong("Type : "), layer.feature.properties.type),
		li(strong("Code INSEE : "), layer.feature.properties.insee_commune)
	);

	let mount;
	try {
		const response = await fetch("/data/dreal.geojson");
		mount = async map => L.geoJSON(await response.json(), options()).bindPopup(popup, {className: "mapPopup"}).addTo(map);
	} catch (e) {
		console.error(e);
	}

	return await MapContainer({provider: OpenStreetMapProvider(), mount, center: FranceCenter(), scrollWheelZoom: false, zoom: 6});
}

async function MapNexrad() {
	const mount = map => addTileLayer(map, NexradProvider());
	return await MapContainer({provider: OpenStreetMapProvider(), mount, center: USACenter(), scrollWheelZoom: false, zoom: 4});
}

async function MapNexradAnimated() {
	const {div, p, label, span, strong, input} = elements();

	const timeStep = 5; // 5 minutes
	const index = createData(0);
	const speed = createData(0);
	const layers = [];
	let currentLayer;
	let timer = null;

	const mount = map => {
		let i = 11 * timeStep;
		while (i >= 0) {
			const provider = NexradProvider();
			provider.options.layers += i == 0 ? "" : "-m" + String(i).padStart(2, "0") + "m";
			layers.push(addTileLayer(map, provider).setOpacity(0));
			i -= timeStep;
		}
		index.value = layers.length - 1;

		// Changement de layer au montage de la carte ou si la donnée observable index change
		createEffect(() => {
			currentLayer?.setOpacity(0);
			currentLayer = layers[index.value]?.setOpacity(1);
		});

		// Arrêt ou création du timer de l'animation au montage de la carte ou si la donnée observable speed change
		createEffect(() => {
			clearInterval(timer);
			if (speed.value > 0) {
				timer = setInterval(() => index.value < layers.length - 1 ? index.value++ : (index.value = 0), 1000 * speed.value);
			}
		});
	};

	// Indispensable pour arrêter le timer
	const unmount = () => clearInterval(timer);

	return div(
		p(
			strong("Temps : "), () => index.value * 5 - 55, " minute", () => index.value < layers.length - 1 ? "s" : "",
			label(
				strong("Vitesse de l’animation : "), 
				input({type: "range", min: 0, max: 5, step: 0.25, value: 0, onInput: e => speed.value = e.target.value}),
				span(" ", speed, " s")
			)
		),
		await MapContainer({provider: OpenStreetMapProvider(), mount, unmount, center: USACenter(), scrollWheelZoom: false, zoom: 4})
	);
}

async function MapWorldRadarAnimated() {
	const {div, p, label, span, strong, input, select, option} = elements();

	const timeStep = 10; // 10 minutes
	const timeCountByHour = 60 / timeStep;
	const maxHours = 12;
	const times = createData([]);
	const index = createData(0);
	const speed = createData(0);
	const layers = [];
	let currentLayer;
	let timer = null;

	const setDuration = duration => {
		if (duration > 0 && duration <= maxHours) {
			const count = duration * timeCountByHour + 1;
			while (times.length < count) {
				times.unshift(times[0] - 60 * timeStep);
				layers.unshift(null);
				index.value++;
			}
			while (times.length > count) {
				times.shift();
				let layer = layers.shift();
				layer && layer.remove();
				index.value--;
			}
			index.value <= 0 && (index.value = 0);
		}
	};

	try {
		const response = await fetch("https://api.rainviewer.com/public/maps.json");
		times.push(...await response.json());
		layers.length = times.length;
		layers.fill(null);
		setDuration(2);
		index.value = times.length - 1;
	} catch (e) {
		console.error(e);
	}

	const mount = map => {
		// Ajout des layers au montage de la carte ou si la donnée observable times change
		createEffect(() => {
			layers.forEach((layer, i) => !layer && (layers[i] = addTileLayer(map, RainViewerProvider(times[i], 4, 1, 1))));
		});

		// Changement de layer au montage de la carte ou si la donnée observable index change
		createEffect(() => {
			currentLayer?.setOpacity(0);
			currentLayer = layers[index]?.setOpacity(0.83);
		});

		// Arrêt ou création du timer de l'animation au montage de la carte ou si la donnée observable speed change
		createEffect(() => {
			clearInterval(timer);
			if (speed.value > 0) {
				timer = setInterval(() => index.value < times.length - 1 ? index.value++ : (index.value = 0), 1000 * speed);
			}
		});
	};

	// Indispensable pour arrêter le timer
	const unmount = () => clearInterval(timer);

	const getLocalDate = index => (new Date(times[index] * 1000)).toLocaleString(undefined, {dateStyle: "short", timeStyle: "short"});

	return div(
		p(
			label(
				strong("Période : "),
				select({onChange: e => setDuration(e.target.value)}, [...Array(maxHours)].map((v, i) => option({value: i + 1, selected: i + 1 == 2}, (i + 1) + " heure" + (i ? "s" : "")))),
				span(() => getLocalDate(0)),
				input({type: "range", min: 0, max: () => times.length - 1, value: index, onInput: e => index.value = e.target.value}),
				span(() => getLocalDate(index))
			),
			label(
				strong("Animation : "),
				input({type: "range", min: 0, max: 5, step: 0.25, value: 0, onInput: e => speed.value = e.target.value}),
				span(() => speed.value == 0 ? "Arrêt" : speed + " s pour 1 heure")
			)
		),
		await MapContainer({provider: OpenStreetMapProvider(), mount, unmount, center: EUCenter(), scrollWheelZoom: false, zoom: 5})
	);
}

export {MapReactive, MapIPGeolocation, MapGeoJSON, MapNexrad, MapNexradAnimated, MapWorldRadarAnimated}

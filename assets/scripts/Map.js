import { EPSG4326, LayerGroup, LeafletMap, ScaleControl } from "leaflet";
import Layer from "./Layer.js";
import PlaceNames from "./PlaceNames.js";

export default class MartianMap {
    /**
     * @param {Array<Layer>} layers
     */
    constructor(layers) {
        this.layers = layers;

        /** @type {LeafletMap} */ // @ts-ignore
        this.map = null;
    }

    async load() {
        await Promise.all(this.layers.map(layer => layer.load(this)));

        let map = new LeafletMap("map", {
            crs: EPSG4326,

            zoomControl: false,
            attributionControl: false,

            dragging: true,
            // touchZoom: true, // pinch to zoom
            pinchZoom: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            boxZoom: true, // shift+drag
            keyboard: true,

            center: [0, 0],
            zoom: 2,
            minZoom: 1,
            zoomSnap: 0,
            maxBounds: [
                [-90, -180],
                [90, 180],
            ],
            maxBoundsViscosity: 1.0,
        }).setView([-17.6, 50.82], 5);

        new ScaleControl({
            position: "bottomright",
            maxWidth: 300,
        }).addTo(map);

        // this.layers.forEach(layer => layer.add(map));
        this.map = map;

        let layers = document.querySelector("#layer-info");
        for (let layer of this.layers) {
            layers?.append(layer.generateHTML());
        }

        let names = new PlaceNames();
        await names.load();
        names.add(this.map);
    }
}

import { LeafletMap, TileLayer, LatLngBounds } from "leaflet";
import { $ } from "./dt.js";
import MartianMap from "./Map.js";

let kids = (/** @type {{ children: any; }} */ el, /** @type {string} */ name) =>
    Array.from(el?.children ?? []).filter(c => c.localName === name);
let kid = (/** @type {HTMLElement} */ el, /** @type {string} */ name) => kids(el, name)[0] ?? null;
let text = (/** @type {any} */ el, /** @type {string} */ name) => kid(el, name)?.textContent?.trim() ?? "";

export default class Layer {
    /**
     * @param {string} xml
     * @param {string} label
     */
    constructor(xml, label) {
        this.xml = xml;
        this.label = label;

        /** @type {MartianMap} */ // @ts-ignore
        this.map = null;

        /** @type {TileLayer} */ // @ts-ignore
        this.tileLayer = null;

        /** @type {HTMLInputElement} */ // @ts-ignore
        this.input = null;
    }

    /**
     * @param {MartianMap} map
     */
    async load(map) {
        this.map = map;

        let res = await fetch(this.xml);

        let doc = new DOMParser().parseFromString(await res.text(), "text/xml");
        if (doc.querySelector("parsererror")) throw new Error(`Invalid XML from ${this.xml}`);

        let contents = kid(doc.documentElement, "Contents");
        let layer = kid(contents, "Layer");
        if (!layer) throw new Error("No <Layer> in capabilities");

        let style = text(kid(layer, "Style"), "Identifier") || "default";
        let tmsId = text(kid(layer, "TileMatrixSetLink"), "TileMatrixSet");
        let tms = kids(contents, "TileMatrixSet").find(t => text(t, "Identifier") === tmsId);
        if (!tms) throw new Error(`TileMatrixSet "${tmsId}" not found`);

        let template = kids(layer, "ResourceURL")
            .find(r => r.getAttribute("resourceType") === "tile")
            ?.getAttribute("template");
        if (!template) throw new Error("No tile ResourceURL template");

        // e.g. "https://trek.nasa.gov/tiles/Mars/EQ/TES_Thermal_Inertia/1.0.0//{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"
        let url = template
            .replace("{Style}", style)
            .replace("{TileMatrixSet}", tmsId)
            .replace("{TileMatrix}", "{z}")
            .replace("{TileRow}", "{y}")
            .replace("{TileCol}", "{x}");

        let matrices = kids(tms, "TileMatrix");
        let first = matrices[0];
        let tileW = Number(text(first, "TileWidth"));
        let cols = Number(text(first, "MatrixWidth"));
        let firstZoom = Math.log2((cols * tileW) / 512); // leaflet zoom level of the first zoom level
        let maxNativeZoom = matrices.length - 1 + firstZoom;

        let bbox = kid(layer, "WGS84BoundingBox");
        let [w, s] = text(bbox, "LowerCorner").split(/\s+/).map(Number);
        let [e, n] = text(bbox, "UpperCorner").split(/\s+/).map(Number);
        let bounds = new LatLngBounds([s, w], [n, e]);

        this.tileLayer = new TileLayer(url, {
            tileSize: tileW,
            minZoom: firstZoom,
            maxZoom: maxNativeZoom + 5,
            maxNativeZoom,
            zoomOffset: -firstZoom,
            noWrap: true,
            attribution: "",
            errorTileUrl: "/assets/no_image.png",
            bounds,
        });
    }

    generateHTML() {
        let id = btoa(this.label).substring(0, 7);
        this.input = $`input`().$({ type: "radio", id, name: "layer" });
        this.input.addEventListener("input", () => {
            this.map.layers.forEach(layer => this.map.map.removeLayer(layer.tileLayer));
            this.map.map.addLayer(this.tileLayer);
        });

        let label = $`label`(this.label);
        label.setAttribute("for", id);

        return $`span`(this.input, label);
    }

    select() {
        this.input.click();
    }

    /** @param {LeafletMap} map */
    add(map) {
        if (!this.tileLayer) return;
        map.addLayer(this.tileLayer);
    }

    /** @param {LeafletMap} map */
    remove(map) {
        if (this.tileLayer && map.hasLayer(this.tileLayer)) map.removeLayer(this.tileLayer);
    }
}

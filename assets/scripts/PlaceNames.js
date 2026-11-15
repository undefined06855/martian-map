import { LayerGroup, Marker, DivIcon, LeafletMap } from "leaflet";
import { $ } from "./dt.js";

export default class PlaceNames {
    constructor() {
        this.group = new LayerGroup();

        /** @type {LeafletMap} */ // @ts-ignore
        this.map = null;

        /** @type {Array<any>} */
        this.features = [];
    }

    async load() {
        this.features = [];
        for (let offset = 0; ; offset += 1000) {
            const params = new URLSearchParams();
            params.set("where", "1=1");
            params.set("outFields", "name,type,diameter,center_lat,center_lon");
            params.set("returnGeometry", "false");
            params.set("orderByFields", "OBJECTID");
            params.set("resultOffset", offset.toString());
            params.set("resultRecordCount", "1000");
            params.set("f", "json");

            const res = await fetch(
                `${"https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/MARS_names/FeatureServer/0/query"}?${params}`,
            );
            if (!res.ok) throw new Error(`HTTP ${res.status} fetching place names`);
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);

            for (const feature of data.features) {
                let a = feature.attributes;
                if (!a.name || a.center_lat == null || a.center_lon == null) continue;
                this.features.push({
                    name: a.name,
                    type: a.type,
                    diameter: a.diameter ?? 0, // km
                    lat: a.center_lat,
                    lng: a.center_lon > 180 ? a.center_lon - 360 : a.center_lon,
                });
            }

            if (!data.exceededTransferLimit) break;
        }
    }

    /**
     * @param {LeafletMap} map
     */
    async add(map) {
        this.map = map;
        this.group.addTo(this.map);
        this.map.on("moveend zoomend", this.refresh);
        this.refresh();
    }

    /**
     * @param {LeafletMap} map
     */
    remove(map) {
        map.off("moveend zoomend", this.refresh);
        this.group.clearLayers();
        map.removeLayer(this.group);
    }

    refresh() {
        if (!this.map || !this.features) return;
        const minDiameter = 4000 / 2 ** this.map.getZoom();
        const bounds = this.map.getBounds().pad(0.1);

        this.group.clearLayers();
        let shown = 0;
        for (const f of this.features) {
            if (shown >= 400) break;
            if (f.diameter < minDiameter) continue;
            if (!bounds.contains([f.lat, f.lng])) continue;

            let html = $`span`(f.name);
            html.setAttribute("data-shadow", f.name);
            html.setAttribute("class", "has-shadow");

            new Marker([f.lat, f.lng], {
                icon: new DivIcon({
                    className: "place-label",
                    html,
                    iconSize: [0, 0],
                }),
                interactive: false,
                keyboard: false,
            }).addTo(this.group);
            shown++;
        }
    }
}

import { LayerGroup, Marker, DivIcon } from "leaflet";

const URL =
    "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/MARS_names/FeatureServer/0/query";
const PAGE = 1000;
const MAX_LABELS = 300;

const escapeHtml = (s) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export default class PlaceNames {
    /**
     * @param {{ exclude?: string[] }} [options] feature types to hide, e.g. ["Crater"]
     */
    constructor(options = {}) {
        this.exclude = new Set(options.exclude ?? []);
        this.group = new LayerGroup();
        this.map = null;
        this._features = null;
        this._loading = null;
        this._refresh = this._refresh.bind(this);
    }

    load() {
        this._loading ??= this._load().catch((err) => {
            this._loading = null;
            throw err;
        });
        return this._loading;
    }

    async _load() {
        const features = [];
        for (let offset = 0; ; offset += PAGE) {
            const params = new URLSearchParams({
                where: "1=1",
                outFields: "name,type,diameter,center_lat,center_lon",
                returnGeometry: "false",
                orderByFields: "OBJECTID",
                resultOffset: offset,
                resultRecordCount: PAGE,
                f: "json",
            });
            const res = await fetch(`${URL}?${params}`);
            if (!res.ok) throw new Error(`HTTP ${res.status} fetching place names`);
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);

            for (const { attributes: a } of data.features) {
                if (!a.name || a.center_lat == null || a.center_lon == null) continue;
                features.push({
                    name: a.name,
                    type: a.type,
                    diameter: a.diameter ?? 0, // km
                    lat: a.center_lat,
                    lng: a.center_lon > 180 ? a.center_lon - 360 : a.center_lon,
                });
            }
            if (!data.exceededTransferLimit) break;
        }
        this._features = features;
    }

    /** @param {import("leaflet").Map} map */
    async add(map) {
        try {
            await this.load();
        } catch (err) {
            console.error("Failed to load place names:", err);
            return;
        }
        this.map = map;
        this.group.addTo(map);
        map.on("moveend zoomend", this._refresh);
        this._refresh();
    }

    /** @param {import("leaflet").Map} map */
    remove(map) {
        map.off("moveend zoomend", this._refresh);
        this.group.clearLayers();
        map.removeLayer(this.group);
        this.map = null;
    }

    _refresh() {
        if (!this.map || !this._features) return;
        const minDiameter = 4000 / 2 ** this.map.getZoom(); // km; tune to taste
        const bounds = this.map.getBounds().pad(0.1);

        this.group.clearLayers();
        let shown = 0;
        for (const f of this._features) {
            if (shown >= MAX_LABELS) break;
            if (this.exclude.has(f.type)) continue;
            if (f.diameter < minDiameter) continue;
            if (!bounds.contains([f.lat, f.lng])) continue;

            new Marker([f.lat, f.lng], {
                icon: new DivIcon({
                    className: "place-label",
                    html: `<span>${escapeHtml(f.name)}</span>`,
                    iconSize: [0, 0],
                }),
                interactive: false,
                keyboard: false,
            }).addTo(this.group);
            shown++;
        }
    }
}

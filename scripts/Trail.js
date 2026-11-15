import { Icon, LeafletMap, Marker } from "leaflet";

export class Point {
    /**
     * @param {string} line
     */
    constructor(line) {
        let split = line.split(",");
        this.lon = Number(split[0]);
        this.lat = Number(split[1]);

        this.invalid = isNaN(this.lat) || isNaN(this.lon);
    }
}

export default class Trail {
    /**
     * @param {Array<Point>} points
     */
    constructor(points) {
        this.points = points.filter(point => !point.invalid);

        /** @type {LeafletMap} */ // @ts-ignore
        this.map = null;

        this.icon = new Icon({
            iconUrl: "assets/pin.png",
            iconSize: [5, 5],
        });

        this.keypointIcon = new Icon({
            iconUrl: "assets/pin-blue.png",
            iconSize: [15, 15],
        });
    }

    /**
     * @param {LeafletMap} map
     */
    add(map) {
        this.map = map;

        for (let [i, point] of Object.entries(this.points)) {
            if (i == "0" || i == (this.points.length - 1).toString()) continue;
            new Marker([point.lat, point.lon], {
                interactive: false,
                keyboard: false,
                icon: this.icon,
            }).addTo(map);
        }

        let pointA = this.points[0];
        let pointB = this.points[this.points.length - 1];
        if (!pointA || !pointB) return;
        new Marker([pointA.lat, pointA.lon], {
            interactive: false,
            keyboard: false,
            icon: this.keypointIcon,
        }).addTo(map);

        new Marker([pointB.lat, pointB.lon], {
            interactive: false,
            keyboard: false,
            icon: this.keypointIcon,
        }).addTo(map);
    }
}

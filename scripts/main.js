import { MARS_LAYERS } from "./layers.js";
import MartianMap from "./Map.js";
import Timer from "./Timer.js";
import Trail, { Point } from "./Trail.js";

let map = new MartianMap(Object.values(MARS_LAYERS));
await map.load();
MARS_LAYERS.color.select();

let res = await fetch("path_lonlat.csv");
let text = await res.text();
let trail = new Trail(text.split("\n").map(line => new Point(line)));
trail.add(map.map);

(() => {
    let zoomIn = document.querySelector("#zoom-in");
    let zoomOut = document.querySelector("#zoom-out");
    if (!zoomIn || !zoomOut) return;
    zoomIn.addEventListener("click", () => map.map.zoomIn(1));
    zoomOut.addEventListener("click", () => map.map.zoomOut(1));
})();

let timer = new Timer();
document.querySelector("#time-spent")?.addEventListener("click", () => {
    timer.start();
});

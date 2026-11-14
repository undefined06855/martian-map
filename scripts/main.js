import { MARS_LAYERS } from "./layers.js";
import MartianMap from "./Map.js";

let map = new MartianMap(Object.values(MARS_LAYERS));
await map.load();
MARS_LAYERS.color.select();

(() => {
    let zoomIn = document.querySelector("#zoom-in");
    let zoomOut = document.querySelector("#zoom-out");
    if (!zoomIn || !zoomOut) return;
    zoomIn.addEventListener("click", () => map.map.zoomIn(1));
    zoomOut.addEventListener("click", () => map.map.zoomOut(1));
})();

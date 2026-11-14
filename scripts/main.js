import { MARS_LAYERS } from "./layers.js";
import MartianMap from "./Map.js";
import PlaceNames from "./PlaceNames.js";

let map = new MartianMap(Object.values(MARS_LAYERS));
let names = new PlaceNames();
await names.load();
await map.load();
names.add(map.map);
MARS_LAYERS.color.select();

document.querySelector("#zoom-in").addEventListener("click", () => map.map.zoomIn(1));
document.querySelector("#zoom-out").addEventListener("click", () => map.map.zoomOut(1));

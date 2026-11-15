// thanks dt
// still using this 3 years later
let template = function (/** @type {any[]} */ strings, /** @type {Array<} */ ...values) {
    return strings.reduce(
        (/** @type {any} */ out, /** @type {any} */ str, /** @type {string | number} */ i) =>
            out + str + (values[i] ?? ""),
        "",
    );
};

/**
 * @param {any[]} args
 */
export function $(...args) {
    let a = template(...args);
    let tag = a
        .replace(/[#.][^#.]+/gm, "")
        .trimEnd()
        .trimStart();
    let id = a.match(/[#][^#.]+/gm);
    let classes = a.match(/[.][^#.]+/gm);
    let elem = document.createElement(tag);
    if (id) elem.id = id.join(" ").replaceAll("#", "");
    if (classes) elem.className = classes.join(" ").replaceAll(".", "");
    elem.$ = function (/** @type {ArrayLike<any> | { [s: string]: any; }} */ props) {
        for (const [k, v] of Object.entries(props)) {
            elem[k] = v;
        }
        return elem;
    };

    return function (/** @type {any} */ ...e) {
        elem.append(...e);
        return elem;
    };
}

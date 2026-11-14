/**
 * A class that stores the WMTS service information about a style, e.g. the capabilities it supports.
 */
class Style {
    constructor() {
        // TODO: set stuff here
    }

    /**
     * Fetches the capabilities for a certain style and stores it.
     */
    async fetchCapabilities() {
        // ...
    }

    toJSON() {
        // TODO: this
    }
}

/**
 * Class that handles fetching and server-side caching the TREK API images.
 * See https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars
 *
 * All functions prefixed with get- are fetched from the server and all functions prefixed with fetch- are internal
 * functions.
 */
class Trek {
    /**
     * @param {string} endpoint
     */
    constructor(endpoint) {
        this.endpoint = endpoint;
        this.styles = []; // array of Styles
    }

    /**
     * Returns the WMTS styles that this supports. This can be a hard-coded list in the server.
     * @returns {Array<Style>}
     */
    async getStyles() {
        return [];
    }

    /**
     * Returns URLs for the local images for the WMTS image data for the styles in a certain geographical region.
     * Note that URLs are only the path, e.g. /api/map/<style>/id, and returns them with the location of the bottom left
     * corner of that tile. Should calculate the zoom level and gets an appropriate image for the zoom level. Returns a
     * JSON object.
     *
     * It should save the image to the storage of the server in a data/ directory, with subfolders for each style name.
     * Bun.serve will serve the files.
     * @param {Array<string>} styles
     * @param {string} from
     * @param {string} to
     * @returns {any}
     */
    async getTiles(styles, from, to) {
        // ...
    }

    /**
     * Fetches the tiles for a certain geographical region  from the API and stores them.
     * @param {Array<Style>} styles
     * @param {string} from
     * @param {string} to
     */
    async fetchTiles(styles, from, to) {}
}

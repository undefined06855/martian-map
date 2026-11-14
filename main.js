const server = Bun.serve({
    routes: {
        "/": Bun.file("public/index.html"),
        "/style.css": Bun.file("public/style.css"),
        "/leaflet.css": Bun.file("node_modules/leaflet/dist/leaflet.css"),
        "/leaflet.js": Bun.file("node_modules/leaflet/dist/leaflet.js"),
    },

    port: process.env["PORT"],
    development: process.env["DEVELOPMENT"] == "true"
});

console.log(`Server started on port ${server.port}`);

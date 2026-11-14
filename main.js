let server = Bun.serve({
    routes: {
        "/api/"

        "/": Bun.file("public/index.html"),
        "/*": async req => {
            let file = Bun.file(`public/${new URL(req.url).pathname}`);
            if (!(await file.exists())) return new Response("404 Not Found", { status: 404 });
            return new Response(file);
        },
    },

    port: process.env["PORT"],
    development: process.env["DEVELOPMENT"] == "true"
});

console.log(`Server started on port ${server.port}`);

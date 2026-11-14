Bun.serve({
    routes: {
        "/*": req => {
            return new Response(Bun.file("public/index.html"));
        },
    },
});

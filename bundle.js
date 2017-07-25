const { rollup } = require("rollup");
const tsp = require("rollup-plugin-typescript");
const typescript = require("typescript");

const path = require("path");


rollup({
    entry: path.resolve("./src/index.ts"),
    plugins: [
        tsp({ typescript })
    ]
}).then(val => {
    val.write({
        dest: path.resolve("./dist/soboku.js"),
        sourceMap: true,
        format: "cjs"
    });

    val.write({
        dest: path.resolve("./dist/soboku.mjs"),
        format: "es"
    });
});
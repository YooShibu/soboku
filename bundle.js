const { rollup } = require("rollup");
const tsp = require("rollup-plugin-typescript");
const uglify = require("rollup-plugin-uglify");
const typescript = require("typescript");

const path = require("path");
const entry = path.resolve("./src/index.ts");


rollup({
    entry,
    plugins: [
        tsp({ typescript })
    ]
}).then(val => {
    val.write({
        dest: path.resolve("./dist/state/state.js"),
        sourceMap: true,
        format: "cjs"
    });
    val.write({
        dest: path.resolve("./dist/state/state.mjs"),
        format: "es"
    });
});


rollup({
    entry,
    plugins: [
        tsp({ typescript, target: "ES3" }),
        uglify()
    ],
}).then(val => {
    val.write({
        dest: path.resolve("./dist/state/state.browser.min.js"),
        format: "iife",
        moduleName: "soboku",
        sourceMap: true
    });
})
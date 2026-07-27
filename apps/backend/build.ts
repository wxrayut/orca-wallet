import { Options, build as tsupBuild } from "tsup";

const external = Object.keys(require("./package.json").dependencies || {});

const tsupOptions: Options = {
    entry: ["src/server.ts", "src/**/*.ts"],
    outDir: "dist",
    tsconfig: "tsconfig.json",
    target: "es2020",
    platform: "node",
    format: ["cjs"],
    dts: true,
    sourcemap: false,
    clean: true,
    bundle: false,
    splitting: false,
    keepNames: true,
    treeshake: true,
    external: [/^node:/, ...external],
    minify: true,
};

export default async function build() {
    await tsupBuild(tsupOptions);
}

build();

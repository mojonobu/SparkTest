import { readFileSync, writeFileSync } from "fs";
import { transcodeSpz } from "@sparkjsdev/spark";

const plyBytes = readFileSync("splats/nijojo.ply");
console.log(`Input PLY: ${(plyBytes.byteLength / 1024 / 1024).toFixed(1)} MB`);

const result = await transcodeSpz({
  inputs: [{ fileBytes: new Uint8Array(plyBytes) }],
});

const spzBytes = new Uint8Array(result.fileBytes);
console.log(`Output SPZ: ${(spzBytes.byteLength / 1024 / 1024).toFixed(1)} MB`);

writeFileSync("splats/nijojo.spz", spzBytes);
console.log("Saved to splats/nijojo.spz");

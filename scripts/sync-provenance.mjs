import { copyFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const mode = process.argv[2] === "public" ? "public" : "full";
const provenanceSource = join(root, "src", `provenance.${mode}.ts`);
const provenanceTarget = join(root, "src", "provenance.ts");
const contentSource = join(root, "src", `content-source.${mode}.ts`);
const contentTarget = join(root, "src", "content.generated.ts");

copyFileSync(provenanceSource, provenanceTarget);
copyFileSync(contentSource, contentTarget);
console.log(`Synced ${mode} content and provenance metadata.`);

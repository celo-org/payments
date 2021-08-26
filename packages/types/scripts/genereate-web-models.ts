import { generate } from "openapi-typescript-codegen";
import { v4 as uuidv4 } from "uuid";
import {
  removeSync,
  mkdirpSync,
  moveSync,
  readdirSync,
  writeFileSync,
} from "fs-extra";
import { join, basename } from "path";

async function generateWebSchemas() {
  const schemasDestinationPath = "./src/schemas/";
  const openApiPath = "./src/payment-protocol.yaml";

  removeSync(schemasDestinationPath);
  mkdirpSync(schemasDestinationPath);
  const tempFolderPath = `./${uuidv4()}`;
  mkdirpSync(tempFolderPath);
  await generate({
    input: openApiPath,
    output: tempFolderPath,
  });
  const modelFiles = readdirSync(join(tempFolderPath, "models"));
  let indexFileContent = "";
  for (const modelFile of modelFiles) {
    moveSync(
      join(tempFolderPath, "models", modelFile),
      join(schemasDestinationPath, modelFile)
    );
    indexFileContent += `export * from "./${basename(modelFile, ".ts")}";\n`;
  }
  writeFileSync(join(schemasDestinationPath, "index.ts"), indexFileContent);
  removeSync(tempFolderPath);
}

generateWebSchemas()
  .then(() => console.log("Schemas generated successfully"))
  .catch((e) => console.log("Error!", e));

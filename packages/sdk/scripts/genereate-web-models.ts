import { generate } from 'openapi-typescript-codegen';
import { v4 as uuidv4 } from 'uuid';
import { removeSync, mkdirpSync, moveSync, readdirSync } from 'fs-extra';
import { join } from 'path';

async function generateWebModels() {
  const modelsDestinationPath = './src/offchain-protocol/models/';
  const openApiPath = './src/offchain-protocol/payment-protocol.yaml';

  removeSync(modelsDestinationPath);
  mkdirpSync(modelsDestinationPath);
  const tempFolderPath = `./${uuidv4()}`;
  mkdirpSync(tempFolderPath);
  await generate({
    input: openApiPath,
    output: tempFolderPath,
  });
  const modelFiles = readdirSync(join(tempFolderPath, 'models'));
  for (const modelFile of modelFiles) {
    moveSync(
      join(tempFolderPath, 'models', modelFile),
      join(modelsDestinationPath, modelFile)
    );
  }
  removeSync(tempFolderPath);
}

generateWebModels()
  .then(() => console.log('Models generated successfully'))
  .catch((e) => console.log('Error!', e));

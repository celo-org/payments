import { EnumDeclaration, Project, SourceFile } from "ts-morph";
import * as fs from "fs";
import { generate } from "openapi-typescript-codegen";
import { v4 as uuidv4 } from "uuid";
import {
  mkdirpSync,
  moveSync,
  readdirSync,
  removeSync,
  writeFileSync,
} from "fs-extra";
import { basename, join } from "path";

const tsConfig = JSON.parse(
  fs
    .readFileSync("tsconfig.json")
    .toString()
    .replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) =>
      g ? "" : m
    )
);

function findSingleMemberEnum(
  sourceFile: SourceFile
): EnumDeclaration | undefined {
  const modules = sourceFile.getModules();
  if (modules.length === 1) {
    const enums = modules[0].getEnums();
    if (enums.length === 1) {
      const theEnum = enums[0];
      if (theEnum.getMembers().length === 1) {
        return theEnum;
      }
    }
  }
  return undefined;
}

function changeEnumMemberName(anEnum: EnumDeclaration, name: string) {
  const theMember = anEnum.getMembers()[0];
  const value = theMember.getValue();
  anEnum.addMember({ name, value });
  theMember.remove();
}

function saveManipulatedFile(
  project: Project,
  sourceFile: SourceFile,
  modelFilename: string,
  modelFilePath: string
) {
  sourceFile.saveSync();
  const memFs = project.getFileSystem();
  const output = memFs.readFileSync(modelFilename);
  writeFileSync(join(modelFilePath, modelFilename), output);
}

function initTsProject(
  sourceFilePath: string,
  sourceFileName: string
): [Project, SourceFile] {
  const project = new Project({
    compilerOptions: {
      ...tsConfig,
      declaration: true,
    },
    useInMemoryFileSystem: true,
  });

  const sourceFile = project.createSourceFile(
    sourceFileName,
    fs.readFileSync(join(sourceFilePath, sourceFileName)).toString()
  );
  sourceFile.saveSync();

  return [project, sourceFile];
}

function manipulateEnums(modelFilePath: string, modelFilename: string) {
  const [project, sourceFile] = initTsProject(modelFilePath, modelFilename);

  const enumDeclaration = findSingleMemberEnum(sourceFile);

  if (enumDeclaration) {
    console.log(
      `Changing enum declaration @ ${join(modelFilePath, modelFilename)}`
    );
    changeEnumMemberName(enumDeclaration, "value");
    saveManipulatedFile(project, sourceFile, modelFilename, modelFilePath);
  }
}

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
    manipulateEnums(schemasDestinationPath, modelFile);
  }
  writeFileSync(join(schemasDestinationPath, "index.ts"), indexFileContent);
  removeSync(tempFolderPath);
}

generateWebSchemas()
  .then(() => console.log("Schemas generated successfully"))
  .catch((e) => console.log("Error!", e));

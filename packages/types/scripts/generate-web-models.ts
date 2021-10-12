import {
  EnumDeclaration,
  Project,
  PropertySignature,
  SourceFile,
} from "ts-morph";
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
import * as jsYaml from "js-yaml";
import { readFileSync } from "fs";

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

function generateEip712Schemas(modelFilePath: string, modelFiles: string[]) {
  const project = new Project({
    compilerOptions: {
      ...tsConfig,
      declaration: true,
    },
    useInMemoryFileSystem: true,
  });
  const sources: SourceFile[] = [];
  for (const f of modelFiles) {
    const sf = project.createSourceFile(
      f,
      fs.readFileSync(join(modelFilePath, f)).toString()
    );
    sf.saveSync();
    // if (f.endsWith("Params.ts")) sources.push(sf);
    sources.push(sf);
  }
  const allTypes = {};
  for (const sourceFile of sources) {
    const typeAlias = sourceFile.getTypeAliases()[0];
    if (typeAlias) {
      const typeName = typeAlias.getName();
      if (typeName.startsWith("JsonRpc")) {
        continue;
      }

      const type = typeAlias.getType();

      if (type.isString()) {
        continue;
      }

      allTypes[typeName] = [];

      for (let p of type.getProperties()) {
        const valueDeclaration = p.getValueDeclaration();
        if (!valueDeclaration) {
          console.log(`{"name": "${p.getName()}", "type": "string"}`);
        } else {
          const signature = valueDeclaration
            .getSymbol()
            .getDeclarations()[0] as PropertySignature;

          const underlineType = p.getValueDeclaration().getType();
          let valueTypeName = signature.getStructure().type as string;
          if (underlineType.isEnum()) {
            const enumDec = underlineType
              .getSymbol()
              .getDeclarations()[0] as EnumDeclaration;
            if (enumDec.getType().isNumber()) {
              valueTypeName = "number";
            } else {
              valueTypeName = "string";
            }
          } else if (!underlineType.getText().startsWith("import")) {
            valueTypeName = underlineType.getText();
          }
          if (valueTypeName.includes(".")) {
            const baseType = underlineType
              .getSymbol()
              .getDeclaredType()
              .getBaseTypeOfLiteralType();
            if (baseType.isNumberLiteral()) {
              valueTypeName = "number";
            }
            if (baseType.isStringLiteral()) {
              valueTypeName = "string";
            }
          }
          allTypes[typeName].push({ name: p.getName(), type: valueTypeName });
        }
      }
    }
  }
  const prettier = require("prettier");
  const formatted = prettier.format(
    `// Temporary solution (definitions aren't exposed yet) - copy definitions from @celo/utils/lib/sign-typed-data-utils
    export interface EIP712Parameter {
      name: string;
      type: string;
    }
    export interface EIP712Types {
      [key: string]: EIP712Parameter[];
    }
    export type EIP712ObjectValue = string | number | EIP712Object;
    export interface EIP712Object {
      [key: string]: EIP712ObjectValue;
    }
    export interface EIP712TypedData {
      types: EIP712Types;
      domain: EIP712Object;
      message: EIP712Object;
      primaryType: string;
    }

    export const EIP712Schemas: EIP712Types = ${JSON.stringify(allTypes)};
    `,
    { parser: "babel" }
  );
  writeFileSync(join(modelFilePath, "eip712schemas.ts"), formatted);
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
  generateEip712Schemas(schemasDestinationPath, modelFiles);
  const yaml = jsYaml.load(readFileSync(openApiPath).toString());
  writeFileSync(
    join(schemasDestinationPath, "jsonSchemaComponents.json"),
    JSON.stringify({ components: yaml["components"] })
  );
  indexFileContent += `export * from "./eip712schemas";\n`;
  indexFileContent += `export { default as OffchainJsonSchema } from "./jsonSchemaComponents.json";\n`;

  writeFileSync(join(schemasDestinationPath, "index.ts"), indexFileContent);

  removeSync(tempFolderPath);
}

generateWebSchemas()
  .then(() => console.log("Schemas generated successfully"))
  .catch((e) => console.log("Error!", e));

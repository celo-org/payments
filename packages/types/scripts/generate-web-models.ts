import {
  EnumDeclaration,
  Project,
  PropertySignature,
  SourceFile,
  Symbol,
  Type,
  TypeAliasDeclaration,
  TypeLiteralNode,
} from "ts-morph";
import * as fs from "fs";
import { readFileSync } from "fs";
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

function changeSingleMember(
  sourceFile: SourceFile,
  name: string,
  fromType: string,
  toType: string
) {
  const typeAliases = sourceFile.getExportedDeclarations();
  if (!typeAliases || typeAliases.size === 0) return false;
  let changed = false;
  typeAliases.forEach((values) => {
    values.forEach((declartion) => {
      if (!(declartion instanceof TypeAliasDeclaration)) return;
      const typeNode = declartion.getTypeNode();
      if (!(typeNode instanceof TypeLiteralNode)) return;
      typeNode.getMembers().forEach((member: PropertySignature) => {
        const structure = member.getStructure();
        if (structure.name === name && structure.type === fromType) {
          console.log(
            `Changing ${name} declaration @ ${sourceFile.getBaseName()} from ${fromType} to ${toType}`
          );
          member.setType(toType);
          sourceFile.saveSync();
          changed = true;
        }
      });
    });
  });
  if (changed) {
    sourceFile.addImportDeclaration({
      defaultImport: "BigNumber",
      moduleSpecifier: "bignumber.js",
    });
    sourceFile.saveSync();
  }
  return changed;
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

function initFullTsProject(
  modelFilePath: string,
  modelFiles: string[]
): SourceFile[] {
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
  return sources;
}

function manipulateSingleFileEnum(
  modelFilePath: string,
  modelFilename: string
) {
  const [project, sourceFile] = initTsProject(modelFilePath, modelFilename);

  const enumDeclaration = findSingleMemberEnum(sourceFile);

  if (enumDeclaration) {
    console.debug(
      `Changing enum declaration @ ${join(modelFilePath, modelFilename)}`
    );
    changeEnumMemberName(enumDeclaration, "value");
    saveManipulatedFile(project, sourceFile, modelFilename, modelFilePath);
  }
}

function manipulateSingleFileAmountBigNumber(
  modelFilePath: string,
  modelFilename: string
) {
  const [project, sourceFile] = initTsProject(modelFilePath, modelFilename);

  const changed = changeSingleMember(
    sourceFile,
    "amount",
    "(number | string)",
    "BigNumber"
  );

  if (changed) {
    saveManipulatedFile(project, sourceFile, modelFilename, modelFilePath);
  }
}

function extractTypeNameAndProperties(
  sourceFile: SourceFile
): [string, Symbol[]] {
  const typeAlias = sourceFile.getTypeAliases()[0];
  if (typeAlias) {
    const typeName = typeAlias.getName();
    const type = typeAlias.getType();
    if (!type.isString()) {
      return [typeName, type.getProperties()];
    }
  }
  return [undefined, undefined];
}

function guessValueTypeName(property: Symbol): [Type, string] {
  const valueDeclaration = property.getValueDeclaration();
  if (!valueDeclaration) {
    const declarations = property.getDeclarations();
    if (!declarations || declarations.length === 0) {
      return [undefined, undefined];
    }
    let bestGuess = 'any';
    let bestDeclaration = declarations[0];
    for (const dec of declarations as PropertySignature[]) {
      const tryType = dec.getTypeNode().getText();
      if (["string", "number"].includes(tryType)) {
        return [dec.getTypeNode().getType(), tryType];
      }
      if (tryType !== 'null') {
        bestGuess = tryType;
        bestDeclaration = dec;
      }
    }
    console.log('return guess', [bestDeclaration, bestGuess]);
    return [(bestDeclaration as PropertySignature).getTypeNode().getType(), bestGuess];
  }
  const signature = valueDeclaration
    .getSymbol()
    .getDeclarations()[0] as PropertySignature;

  const underlyingType = property.getValueDeclaration().getType();
  const valueTypeName = signature.getStructure().type as string;

  return [underlyingType, valueTypeName];
}

function inferEnumUnderlyingType(underlyingType: Type): string {
  const enumDec = underlyingType
    .getSymbol()
    .getDeclarations()[0] as EnumDeclaration;
  if (enumDec.getType().isNumber()) {
    return "number";
  } else {
    return "string";
  }
}

function inferDirectTypeAlias(
  underlyingType: Type,
  currentGuess: string
): string {
  const symbol = underlyingType.getSymbol();
  if (!symbol) {
    if (currentGuess.includes("any")) {
      return undefined;
    } else {
      const message = `No underlying symbol for ${underlyingType.getText()}`;
      console.error(message, { currentGuess, underlyingType });
      throw new Error(message);
    }
  }

  const baseType = symbol.getDeclaredType().getBaseTypeOfLiteralType();
  if (baseType.isNumberLiteral()) {
    return "number";
  }
  if (baseType.isStringLiteral()) {
    return "string";
  }
  if (baseType.isBooleanLiteral() || baseType.isBoolean()) {
    return "boolean";
  }

  return currentGuess;
}

function renameTypeNameToEip712(typeName: string) {
  switch (typeName) {
    case "boolean":
      return "bool";
    case "number":
      return "int256";
    case "BigNumber":
      return "uint256";
    default:
      return typeName;
  }
}

function formatEip712SchemasFile(allTypes) {
  const prettier = require("prettier");
  const eip712TypedInterfaces = readFileSync(
    "./scripts/eip712-typed-interfaces.ts"
  ).toString();
  return prettier.format(
    `${eip712TypedInterfaces}

    export const EIP712Schemas: EIP712TypeDefinitions = ${JSON.stringify(
      allTypes
    )};
    `,
    { parser: "babel" }
  );
}

function generateEip712Schemas(modelFilePath: string, modelFiles: string[]) {
  const sources = initFullTsProject(modelFilePath, modelFiles);
  const allTypes = {};
  for (const sourceFile of sources) {
    const [typeName, typeProperties] = extractTypeNameAndProperties(sourceFile);
    if (typeName) {
      allTypes[typeName] = {
        name: typeName,
        schema: [],
        bigNumbers: [],
      };
      for (let property of typeProperties) {
        let [underlyingType, valueTypeName] = guessValueTypeName(property);
        console.log('after guess', {typeName, valueTypeName, text: underlyingType.getText(), name: property.getName()});
        if (!underlyingType) continue;

        if (underlyingType.isEnum()) {
          valueTypeName = inferEnumUnderlyingType(underlyingType);
        } else if (
          !underlyingType.getText().startsWith("import") &&
          underlyingType.getText() !== "any"
        ) {
          valueTypeName = underlyingType.getText();
        }
        if (valueTypeName.includes(".")) {
          valueTypeName = inferDirectTypeAlias(underlyingType, valueTypeName);
        }
        const isBigNumberField = valueTypeName === "BigNumber";
        valueTypeName = renameTypeNameToEip712(valueTypeName);
        console.log({typeName, valueTypeName, name: property.getName()});

        if (valueTypeName) {
          const fieldName = property.getName();
          allTypes[typeName].schema.push({
            name: fieldName,
            type: valueTypeName,
          });
          if (isBigNumberField) {
            allTypes[typeName].bigNumbers.push(fieldName);
          }
        }
      }
    }
  }

  const formatted = formatEip712SchemasFile(allTypes);
  writeFileSync(join(modelFilePath, "eip712schemas.ts"), formatted);
}

function resetDirectories(schemasDestinationPath: string) {
  removeSync(schemasDestinationPath);
  mkdirpSync(schemasDestinationPath);
  const tempFolderPath = `./${uuidv4()}`;
  mkdirpSync(tempFolderPath);
  return tempFolderPath;
}

function moveToDestination(
  modelFiles,
  tempFolderPath: string,
  schemasDestinationPath: string
) {
  for (const modelFile of modelFiles) {
    moveSync(
      join(tempFolderPath, "models", modelFile),
      join(schemasDestinationPath, modelFile)
    );
  }
}

function writeExportsToIndex(modelFiles, schemasDestinationPath: string) {
  let indexFileContent = "";
  for (const modelFile of modelFiles) {
    indexFileContent += `export * from "./${basename(modelFile, ".ts")}";\n`;
  }
  writeFileSync(join(schemasDestinationPath, "index.ts"), indexFileContent);
}

function manipulateEnums(modelFiles, schemasDestinationPath: string) {
  for (const modelFile of modelFiles) {
    manipulateSingleFileEnum(schemasDestinationPath, modelFile);
  }
}

function manipulateAmountBigNumber(modelFiles, schemasDestinationPath: string) {
  for (const modelFile of modelFiles) {
    manipulateSingleFileAmountBigNumber(schemasDestinationPath, modelFile);
  }
}

function extractComponentJsonSchema(
  openApiPath: string,
  schemasDestinationPath: string
) {
  const yaml = jsYaml.load(readFileSync(openApiPath).toString());
  writeFileSync(
    join(schemasDestinationPath, "jsonSchemaComponents.json"),
    JSON.stringify({ components: yaml["components"] })
  );
  let indexFileContent = readFileSync(
    join(schemasDestinationPath, "index.ts")
  ).toString();
  indexFileContent += `export * from "./eip712schemas";\n`;
  indexFileContent += `export { default as OffchainJsonSchema } from "./jsonSchemaComponents.json";\n`;
  writeFileSync(join(schemasDestinationPath, "index.ts"), indexFileContent);
}

async function generateWebSchemas() {
  const schemasDestinationPath = "./src/schemas/";
  const openApiPath = "./src/payment-protocol.yaml";
  const tempFolderPath = resetDirectories(schemasDestinationPath);

  console.log("Generating typescript models...");
  await generate({
    input: openApiPath,
    output: tempFolderPath,
  });

  const modelFiles = readdirSync(join(tempFolderPath, "models"));

  console.log("Moving files to the destination folder...");
  moveToDestination(modelFiles, tempFolderPath, schemasDestinationPath);

  console.log("Writing export statements to index.ts...");
  writeExportsToIndex(modelFiles, schemasDestinationPath);

  console.log("Manipulating enums with a single value...");
  manipulateEnums(modelFiles, schemasDestinationPath);

  console.log("Manipulating amounts to be BigNumber...");
  manipulateAmountBigNumber(modelFiles, schemasDestinationPath);

  console.log("Generating EIP712 schemas...");
  generateEip712Schemas(schemasDestinationPath, modelFiles);

  console.log("Extracting JSON schema for validation...");
  extractComponentJsonSchema(openApiPath, schemasDestinationPath);

  console.log("Removing temporary folder...");
  removeSync(tempFolderPath);
}

generateWebSchemas()
  .then(() => console.log("Schemas generated successfully"))
  .catch((e) => console.log("Error!", e));

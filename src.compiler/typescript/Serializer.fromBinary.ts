import * as ts from 'typescript';
import {
    addNewLines,
    createNodeFromSource,
    getTypeWithNullableInfo,
    hasFlag,
    isEnumType,
    isMap,
    isTypedArray,
    setMethodBody,
    unwrapArrayItemType
} from '../BuilderHelpers';
import { findModule, findSerializerModule, JsonProperty } from './Serializer.common';

export function createFromBinaryMethod(
    program: ts.Program,
    input: ts.ClassDeclaration,
    propertiesToSerialize: JsonProperty[],
    importer: (name: string, module: string) => void
) {
    importer('IReadable', '@src/io/IReadable');
    const methodDecl = createNodeFromSource<ts.MethodDeclaration>(
        `public class Serializer {
            public static fromBinary(obj: ${input.name!.text}, r: IReadable): ${input.name!.text} {
            }
        }`,
        ts.SyntaxKind.MethodDeclaration
    );
    return setMethodBody(methodDecl, generateFromBinaryBody(program, propertiesToSerialize, importer));
}

function generateFromBinaryBody(
    program: ts.Program,
    propertiesToSerialize: JsonProperty[],
    importer: (name: string, module: string) => void
) {
    const statements: ts.Statement[] = [];

    statements.push(
        createNodeFromSource<ts.IfStatement>(
            `if(IOHelper.readNull(r)) { 
                return obj;
            }`,
            ts.SyntaxKind.IfStatement
        )
    );

    for (let prop of propertiesToSerialize) {
        const fieldName = (prop.property.name as ts.Identifier).text;
        const jsonName = prop.jsonNames.filter(n => n !== '')[0];
        if (!jsonName) {
            continue;
        }

        const typeChecker = program.getTypeChecker();
        const type = getTypeWithNullableInfo(typeChecker, prop.property.type!);
        const isArray = isTypedArray(type.type!);

        let propertyStatements: ts.Statement[] = [];

        let primitiveRead = getPrimitiveReadMethod(type.type!, typeChecker);
        if (primitiveRead) {
            if (type.isNullable) {
                propertyStatements.push(
                    createNodeFromSource<ts.IfStatement>(
                        `if(!IOHelper.readNull(r)) {
                            obj.${fieldName} = IOHelper.${primitiveRead}(r);
                        }`,
                        ts.SyntaxKind.IfStatement
                    )
                );
            } else {
                propertyStatements.push(
                    createNodeFromSource<ts.ExpressionStatement>(
                        `obj.${fieldName} = IOHelper.${primitiveRead}(r);`,
                        ts.SyntaxKind.ExpressionStatement
                    )
                );
            }
        } else if (isEnumType(type.type!)) {
            if (type.isNullable) {
                propertyStatements.push(
                    createNodeFromSource<ts.IfStatement>(
                        `if(!IOHelper.readNull(r)) {
                            obj.${fieldName} = JsonHelper.parseEnum<${type.type.symbol.name}>(IOHelper.readInt32LE(r), ${type.type.symbol.name});
                        }`,
                        ts.SyntaxKind.IfStatement
                    )
                );
            } else {
                propertyStatements.push(
                    createNodeFromSource<ts.ExpressionStatement>(
                        `obj.${fieldName} = JsonHelper.parseEnum<${type.type.symbol.name}>(IOHelper.readInt32LE(r), ${type.type.symbol.name})!;`,
                        ts.SyntaxKind.ExpressionStatement
                    )
                );
            }
        } else if (isArray) {
            const arrayItemType = unwrapArrayItemType(type.type!, typeChecker)!;
            const collectionAddMethod =
                (ts
                    .getJSDocTags(prop.property)
                    .filter(t => t.tagName.text === 'json_add')
                    .map(t => t.comment ?? '')[0] as string) || `${fieldName}.push`;

            let itemSerializer = arrayItemType.symbol.name + 'Serializer';
            importer(itemSerializer, findSerializerModule(arrayItemType, program.getCompilerOptions()));
            importer(arrayItemType.symbol.name, findModule(arrayItemType, program.getCompilerOptions()));

            const loopItems = [
                createNodeFromSource<ts.ExpressionStatement>(
                    `obj.${fieldName} = [];`,
                    ts.SyntaxKind.ExpressionStatement
                ),
                createNodeFromSource<ts.VariableStatement>(
                    `const length = IOHelper.readInt32LE(r);`,
                    ts.SyntaxKind.VariableStatement
                ),
                createNodeFromSource<ts.ForStatement>(
                    `for(let i = 0; i < length; i++) {
                        const it = new ${arrayItemType.symbol.name}();
                        ${itemSerializer}.fromBinary(it, r);
                        obj.${collectionAddMethod}(it);
                    }`,
                    ts.SyntaxKind.ForStatement
                )
            ];

            if (type.isNullable) {
                propertyStatements.push(
                    ts.factory.createIfStatement(ts.factory.createIdentifier('v'), ts.factory.createBlock(loopItems))
                );
            } else {
                propertyStatements.push(ts.factory.createBlock(loopItems));
            }
        } else if (isMap(type.type)) {
            const mapType = type.type as ts.TypeReference;

            const mapStatements: ts.Statement[] = [
                createNodeFromSource<ts.VariableStatement>(
                    `const size = IOHelper.readInt32LE(r);`,
                    ts.SyntaxKind.VariableStatement
                )
            ];

            const collectionAddMethod =
                (ts
                    .getJSDocTags(prop.property)
                    .filter(t => t.tagName.text === 'json_add')
                    .map(t => t.comment ?? '')[0] as string) || fieldName + '.set';

            let readKey: ts.Expression;
            const primitiveKeyRead = getPrimitiveReadMethod(mapType.typeArguments![0], typeChecker);
            if (primitiveKeyRead) {
                readKey = createNodeFromSource<ts.CallExpression>(
                    `IOHelper.${primitiveKeyRead}(r)`,
                    ts.SyntaxKind.CallExpression
                );
            } else if (isEnumType(mapType.typeArguments![0])) {
                readKey = createNodeFromSource<ts.NonNullExpression>(
                    `JsonHelper.parseEnum<${mapType.typeArguments![0].symbol.name}>(IOHelper.readInt32LE(r), ${
                        mapType.typeArguments![0].symbol.name
                    })!`,
                    ts.SyntaxKind.NonNullExpression
                );
            } else {
                throw new Error(
                    'only Map<Primitive, *> maps are supported extend if needed: ' +
                        mapType.typeArguments![0].symbol.name
                );
            }

            let readValue: ts.Expression;
            const primitiveValueRead = getPrimitiveReadMethod(mapType.typeArguments![1], typeChecker);
            if (primitiveValueRead) {
                readValue = createNodeFromSource<ts.CallExpression>(
                    `IOHelper.${primitiveValueRead}(r)`,
                    ts.SyntaxKind.CallExpression
                );
            } else if (isEnumType(mapType.typeArguments![1])) {
                readValue = createNodeFromSource<ts.CallExpression>(
                    `JsonHelper.parseEnum<${mapType.typeArguments![1].symbol.name}>(IOHelper.readInt32LE(r), ${
                        mapType.typeArguments![1].symbol.name
                    })!`,
                    ts.SyntaxKind.CallExpression
                );
            } else {
                const itemSerializer = mapType.typeArguments![1].symbol.name + 'Serializer';
                importer(itemSerializer, findSerializerModule(mapType.typeArguments![1], program.getCompilerOptions()));

                readValue = createNodeFromSource<ts.CallExpression>(
                    `${itemSerializer}.fromBinary(new ${mapType.typeArguments![1].symbol.name}(),r)`,
                    ts.SyntaxKind.CallExpression
                );
            }

            mapStatements.push(
                ts.factory.createForStatement(
                    ts.factory.createVariableDeclarationList(
                        [
                            ts.factory.createVariableDeclaration(
                                'i',
                                undefined,
                                undefined,
                                ts.factory.createIdentifier('0')
                            )
                        ],
                        ts.NodeFlags.Let
                    ),
                    ts.factory.createBinaryExpression(
                        ts.factory.createIdentifier('i'),
                        ts.SyntaxKind.LessThanToken,
                        ts.factory.createIdentifier('size')
                    ),
                    ts.factory.createPostfixIncrement(ts.factory.createIdentifier('i')),
                    ts.factory.createBlock([
                        ts.factory.createExpressionStatement(
                            ts.factory.createCallExpression(
                                ts.factory.createPropertyAccessExpression(
                                    ts.factory.createIdentifier('obj'),
                                    collectionAddMethod
                                ),
                                undefined,
                                [readKey, readValue]
                            )
                        )
                    ])
                )
            );

            propertyStatements.push(ts.factory.createBlock(mapStatements));
        }

        if (prop.target) {
            propertyStatements = propertyStatements.map(s =>
                ts.addSyntheticLeadingComment(s, ts.SyntaxKind.MultiLineCommentTrivia, `@target ${prop.target}`, true)
            );
        }

        statements.push(...propertyStatements);
    }

    statements.push(createNodeFromSource<ts.ReturnStatement>(
        `return obj;`,
        ts.SyntaxKind.ReturnStatement
    ))

    return ts.factory.createBlock(addNewLines(statements));
}

function getPrimitiveReadMethod(type: ts.Type, typeChecker: ts.TypeChecker): string | null {
    if (!type) {
        return null;
    }

    const isArray = isTypedArray(type);
    const arrayItemType = unwrapArrayItemType(type, typeChecker);

    if (hasFlag(type, ts.TypeFlags.Unknown)) {
        return 'readUnknown';
    }
    if (hasFlag(type, ts.TypeFlags.Number)) {
        return 'readNumber';
    }
    if (hasFlag(type, ts.TypeFlags.String)) {
        return 'readString';
    }
    if (hasFlag(type, ts.TypeFlags.Boolean)) {
        return 'readBoolean';
    }

    if (arrayItemType) {
        if (isArray && hasFlag(arrayItemType, ts.TypeFlags.Number)) {
            return 'readNumberArray';
        }
        if (isArray && hasFlag(arrayItemType, ts.TypeFlags.String)) {
            return 'readStringArray';
        }
        if (isArray && hasFlag(arrayItemType, ts.TypeFlags.Boolean)) {
            return 'readBooleanArray';
        }
    } else if (type.symbol) {
        switch (type.symbol.name) {
            case 'Uint8Array':
            case 'Uint16Array':
            case 'Uint32Array':
            case 'Int8Array':
            case 'Int16Array':
            case 'Int32Array':
            case 'Float32Array':
            case 'Float64Array':
                return 'read' + type.symbol.name;
        }
    }

    return null;
}

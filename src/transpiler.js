import { functionMappings } from '../mappings/stdlib.js';

export function transpile(ast) {
    return generateProgram(ast);
}

function generateProgram(programNode) {
    return programNode.body.map(generateStatement).join('\n');
}

function generateStatement(stmt) {
    switch (stmt.type) {
        case 'FunctionDeclaration':
            const args = stmt.params.map(p => p.name).join(', ');
            const body = stmt.body.body.map(generateStatement).join('\n');
            return `function ${stmt.name.name}(${args}) {\n${indent(body)}\n}`;
        case 'Assignment':
            return `let ${stmt.id.name} = ${generateExpression(stmt.value)};`;
        case 'IfStatement':
            const ifBody = stmt.body.body.map(generateStatement).join('\n');
            return `if (${generateExpression(stmt.test)}) {\n${indent(ifBody)}\n}`;
        case 'ReturnStatement':
            return `return ${generateExpression(stmt.value)};`;
        case 'CallExpression':
            return `${generateExpression(stmt)};`;
        default:
            throw new Error(`Unknown statement type: ${stmt.type}`);
    }
}

function generateExpression(expr) {
    switch (expr.type) {
        case 'Identifier':
            return expr.name;
        case 'Literal':
            return JSON.stringify(expr.value);
        case 'BinaryExpression':
            return `(${generateExpression(expr.left)} ${expr.operator} ${generateExpression(expr.right)})`;
        case 'CallExpression': {
            let calleeName = expr.callee.name;
            calleeName = toCamelCase(calleeName);
            
            const args = expr.arguments.map(generateExpression).join(', ');

            const mappedName = functionMappings[calleeName] || calleeName;

            return `${mappedName}(${args})`;
        }
        default:
            throw new Error(`Unknown expression type: ${expr.type}`);
    }
}

function indent(text) {
    return text.split('\n').map(line => '  ' + line).join('\n');
}

function toCamelCase(snake) {
  return snake.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}
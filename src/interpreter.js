class Environment {
    constructor(parent = null) {
        this.vars = new Map();
        this.funcs = new Map();
        this.parent = parent;
    }

    define(name, value) {
        this.vars.set(name, value);
    }

    assign(name, value) {
        if (this.vars.has(name)) {
            this.vars.set(name, value);
        } else if (this.parent) {
            this.parent.assign(name, value);
        } else {
            throw new Error(`Undefined variable: ${name}`);
        }
    }

    get(name) {
        if (this.vars.has(name)) return this.vars.get(name);
        if (this.parent) return this.parent.get(name);
        throw new Error(`Undefined variable: ${name}`);
    }

    defineFunction(name, func) {
        this.funcs.set(name, func);
    }

    getFunction(name) {
        if (this.funcs.has(name)) return this.funcs.get(name);
        if (this.parent) return this.parent.getFunction(name);
        throw new Error(`Undefined function: ${name}`);
    }
}

class Return {
    constructor(value) {
        this.value = value;
    }
}

export function interpret(ast, log = console.log) {
    const globalEnv = new Environment();

    function evalNode(node, env) {
        let result;
        switch (node.type) {
            case 'Program':
                node.body.forEach(stmt => evalNode(stmt, env));
                break;

            case 'Assignment':
                env.define(node.id.name, evalNode(node.value, env));
                break;

            case 'Identifier':
                return env.get(node.name);

            case 'Literal':
                return node.value;

            case 'BinaryExpression':
                const left = evalNode(node.left, env);
                const right = evalNode(node.right, env);
                switch (node.operator) {
                    case '+': return left + right;
                    case '-': return left - right;
                    case '*': return left * right;
                    case '/': return left / right;
                    case '>': return left > right;
                    case '<': return left < right;
                    case '==': return left === right;
                    default: throw new Error(`Unknown operator ${node.operator}`);
                }

            case 'FunctionDeclaration':
                env.defineFunction(node.name.name, {
                    params: node.params.map(p => p.name),
                    body: node.body
                });
                break;

            case 'CallExpression':
                const funcName = node.callee.name;
                const args = node.arguments.map(arg => evalNode(arg, env));

                if (funcName === 'print') {
                    console.log(...args);
                    return;
                }

                const func = env.getFunction(funcName);
                const localEnv = new Environment(env);
                func.params.forEach((param, i) => {
                    localEnv.define(param, args[i]);
                });
                result = evalNode(func.body, localEnv);
                if (result instanceof Return) return result.value;
                return result;



            case 'IfStatement':
                if (evalNode(node.test, env)) {
                    evalNode(node.body, env);
                }
                break;

            case 'ForLoop':
                const loopLimit = evalNode(node.count, env);
                for (let i = 0; i < loopLimit; i++) {
                    const loopEnv = new Environment(env);
                    loopEnv.define(node.id.name, i);
                    evalNode(node.body, loopEnv);
                }
                break;

            case 'ReturnStatement':
                return new Return(evalNode(node.value, env));

            case 'Block':
                for (const stmt of node.body) {
                    result = evalNode(stmt, env);
                    if (result instanceof Return) return result;
                }
                return result;

            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    evalNode(ast, globalEnv);
}

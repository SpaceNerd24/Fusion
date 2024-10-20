const fs = require('fs');
const Lexer = require('./lexer');
const Parser = require('./parser');

// interpreter.js
class Interpreter {
    constructor(ast) {
        this.ast = ast;
        this.environment = {};
        this.functions = {};
    }

    interpret() {
        for (const statement of this.ast) {
            this.executeStatement(statement);
        }
    }

    executeStatement(statement) {
        if (statement.type === 'ImportStatement') {
            this.executeImport(statement);
        } else if (statement.type === 'Assignment') {
         const value = this.evaluateExpression(statement.expression);
        // Directly assign to the environment, which is global
        this.environment[statement.identifier] = value;
        } else if (statement.type === 'IfStatement') {
            const condition = this.evaluateExpression(statement.condition);
            if (condition) {
                for (const stmt of statement.statements) {
                    this.executeStatement(stmt);
                }
            }
        } else if (statement.type === 'PrintStatement') {
            const value = this.evaluateExpression(statement.expression);
            console.log(value);
        } else if (statement.type === 'FunctionDefinition') {
            this.functions[statement.name] = statement;
        } else if (statement.type === 'FunctionCall') {
            this.executeFunctionCall(statement);
        } else {
            throw new Error(`Unknown statement type: ${statement.type}`);
        }
    }

    evaluateExpression(expression) {
        if (expression.type === 'NumberLiteral') {
            return parseInt(expression.value, 10);
        } else if (expression.type === 'StringLiteral') {
            return expression.value;
        } else if (expression.type === 'Identifier') {
            if (this.environment.hasOwnProperty(expression.value)) {
                return this.environment[expression.value];
            } else {
                throw new Error(`Undefined variable: ${expression.value}`);
            }
        } else if (expression.type === 'BinaryExpression') {
            const left = this.evaluateExpression(expression.left);
            const right = this.evaluateExpression(expression.right);

            switch (expression.operator) {
                case 'PLUS':
                    return left + right;
                case 'MINUS':
                    return left - right;
                case 'MULTIPLY':
                    return left * right;
                case 'DIVIDE':
                    return left / right;
                case 'GREATER_THAN':
                    return left > right;
                case 'LESS_THAN':
                    return left < right;
                case 'EQUAL_EQUAL':
                    return left == right;
                default:
                    throw new Error(`Unknown operator: ${expression.operator}`);
            }
        } else {
            throw new Error(`Unknown expression type: ${expression.type}`);
        }
    }

    executeFunctionCall(statement) {
        const func = this.functions[statement.name];
        if (!func) {
            throw new Error(`Undefined function: ${statement.name}`);
        }
    
        // Create a local environment for the function call
        const localEnv = { ...this.environment };
    
        for (let i = 0; i < func.parameters.length; i++) {
            const paramName = func.parameters[i];
            const argValue = this.evaluateExpression(statement.arguments[i]);
    
            // Assign the argument value directly to the local environment
            localEnv[paramName] = argValue;
        }
    
        // Temporarily set the environment to the local one
        const previousEnv = this.environment;
        this.environment = localEnv;
    
        for (const stmt of func.body) {
            this.executeStatement(stmt);
        }
    
        // Restore the previous environment
        this.environment = previousEnv;
    
        // Update global environment if the parameter name matches a variable
        for (const param of func.parameters) {
            if (previousEnv.hasOwnProperty(param)) {
                previousEnv[param] = localEnv[param];
            }
        }
    }

    executeImport(statement) {
        const fileName = statement.fileName;
        const fileContent = fs.readFileSync(fileName, 'utf-8');

        const lexer = new Lexer(fileContent);
        const tokens = lexer.tokenize();

        const parser = new Parser(tokens);
        const ast = parser.parse();

        const interpreter = new Interpreter(ast);
        interpreter.interpret();

        // Import functions into the current environment
        Object.assign(this.functions, interpreter.functions);
    }
}

module.exports = Interpreter;
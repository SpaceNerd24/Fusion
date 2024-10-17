class Interpreter {
    constructor(ast) {
        this.ast = ast;
        this.environment = {};
    }

    interpret() {
        for (const statement of this.ast) {
            this.executeStatement(statement);
        }
    }

    executeStatement(statement) {
        if (statement.type === 'Assignment') {
            const value = this.evaluateExpression(statement.expression);
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
}

module.exports = Interpreter;
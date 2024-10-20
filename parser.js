// parser.js
class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.position = 0;
    }

    parse() {
        const statements = [];
        while (this.position < this.tokens.length) {
            statements.push(this.parseStatement());
        }
        return statements;
    }

    parseStatement() {
        const token = this.tokens[this.position];

        if (token.type === 'IMPORT') {
            return this.parseImportStatement();
        } else if (token.type === 'IDENTIFIER') {
            if (this.tokens[this.position + 1] && this.tokens[this.position + 1].type === 'LPAREN') {
                return this.parseFunctionCall();
            } else {
                return this.parseAssignment();
            }
        } else if (token.type === 'IF') {
            return this.parseIfStatement();
        } else if (token.type === 'PRINT') {
            return this.parsePrintStatement();
        } else if (token.type === 'FUNCTION') {
            return this.parseFunctionDefinition();
        } else {
            throw new Error(`Unexpected token: ${token.type}`);
        }
    }

    parseImportStatement() {
        this.position++; // Skip 'import'
        const fileNameToken = this.tokens[this.position++];
        const semicolon = this.tokens[this.position++];
    
        if (semicolon.type !== 'SEMICOLON') {
            throw new Error('Expected ; after import statement');
        }
    
        return {
            type: 'ImportStatement',
            fileName: fileNameToken.value
        };
    }

    parseAssignment() {
        const identifier = this.tokens[this.position++];
        const equals = this.tokens[this.position++];
        const expression = this.parseExpression();
        const semicolon = this.tokens[this.position++];

        if (equals.type !== 'EQUALS' || semicolon.type !== 'SEMICOLON') {
            throw new Error('Invalid assignment syntax');
        }

        return {
            type: 'Assignment',
            identifier: identifier.value,
            expression: expression
        };
    }

    parseIfStatement() {
        this.position++; // Skip 'if'
        const condition = this.parseExpression();
        const lbrace = this.tokens[this.position++];

        if (lbrace.type !== 'LBRACE') {
            throw new Error('Expected { after if condition');
        }

        const statements = [];
        while (this.tokens[this.position].type !== 'RBRACE') {
            statements.push(this.parseStatement());
        }

        this.position++; // Skip '}'

        return {
            type: 'IfStatement',
            condition: condition,
            statements: statements
        };
    }

    parsePrintStatement() {
        this.position++;
        const expression = this.parseExpression();
        const semicolon = this.tokens[this.position++];

        if (semicolon.type !== 'SEMICOLON') {
            throw new Error('Expected ; after print statement');
        }

        return {
            type: 'PrintStatement',
            expression: expression
        };
    }

    parseFunctionDefinition() {
        this.position++; // Skip 'function'
        const name = this.tokens[this.position++];
        const lparen = this.tokens[this.position++];

        if (lparen.type !== 'LPAREN') {
            throw new Error('Expected ( after function name');
        }

        const parameters = [];
        while (this.tokens[this.position].type !== 'RPAREN') {
            parameters.push(this.tokens[this.position++].value);
            if (this.tokens[this.position].type === 'COMMA') {
                this.position++;
            }
        }

        this.position++; // Skip ')'
        const lbrace = this.tokens[this.position++];

        if (lbrace.type !== 'LBRACE') {
            throw new Error('Expected { after function parameters');
        }

        const body = [];
        while (this.tokens[this.position].type !== 'RBRACE') {
            body.push(this.parseStatement());
        }

        this.position++; // Skip '}'

        return {
            type: 'FunctionDefinition',
            name: name.value,
            parameters: parameters,
            body: body
        };
    }

    parseFunctionCall() {
        const name = this.tokens[this.position++];
        const lparen = this.tokens[this.position++];

        if (lparen.type !== 'LPAREN') {
            throw new Error('Expected ( after function name');
        }

        const args = [];
        while (this.tokens[this.position].type !== 'RPAREN') {
            args.push(this.parseExpression());
            if (this.tokens[this.position].type === 'COMMA') {
                this.position++;
            }
        }

        this.position++; // Skip ')'
        const semicolon = this.tokens[this.position++];

        if (semicolon.type !== 'SEMICOLON') {
            throw new Error('Expected ; after function call');
        }

        return {
            type: 'FunctionCall',
            name: name.value,
            arguments: args
        };
    }

    parseExpression() {
        let left = this.parseTerm();

        while (this.position < this.tokens.length && (this.tokens[this.position].type === 'PLUS' || this.tokens[this.position].type === 'MINUS' || this.tokens[this.position].type === 'GREATER_THAN' || this.tokens[this.position].type === 'LESS_THAN' || this.tokens[this.position].type === 'EQUAL_EQUAL')) {
            const operator = this.tokens[this.position++];
            const right = this.parseTerm();
            left = {
                type: 'BinaryExpression',
                operator: operator.type,
                left: left,
                right: right
            };
        }

        return left;
    }

    parseTerm() {
        let left = this.parseFactor();

        while (this.position < this.tokens.length && (this.tokens[this.position].type === 'MULTIPLY' || this.tokens[this.position].type === 'DIVIDE')) {
            const operator = this.tokens[this.position++];
            const right = this.parseFactor();
            left = {
                type: 'BinaryExpression',
                operator: operator.type,
                left: left,
                right: right
            };
        }

        return left;
    }

    parseFactor() {
        const token = this.tokens[this.position];

        if (token.type === 'NUMBER') {
            this.position++;
            return { type: 'NumberLiteral', value: token.value };
        } else if (token.type === 'STRING') {
            this.position++;
            return { type: 'StringLiteral', value: token.value };
        } else if (token.type === 'IDENTIFIER') {
            this.position++;
            return { type: 'Identifier', value: token.value };
        } else if (token.type === 'LPAREN') {
            this.position++;
            const expression = this.parseExpression();
            const rparen = this.tokens[this.position++];

            if (rparen.type !== 'RPAREN') {
                throw new Error('Expected )');
            }

            return expression;
        } else {
            throw new Error(`Unexpected token in factor: ${token.type}`);
        }
    }
}

module.exports = Parser;
// lexer.js
class Lexer {
    constructor(input) {
        this.input = input;
        this.position = 0;
        this.tokens = [];
    }

    tokenize() {
        while (this.position < this.input.length) {
            const char = this.input[this.position];

            if (/\s/.test(char)) {
                this.position++;
            } else if (/[0-9]/.test(char)) {
                this.tokens.push(this.readNumber());
            } else if (/[a-zA-Z_]/.test(char)) {
                this.tokens.push(this.readIdentifier());
            } else if (char === '"') {
                this.tokens.push(this.readString());
            } else if (char === '+') {
                this.tokens.push({ type: 'PLUS', value: char });
                this.position++;
            } else if (char === '-') {
                this.tokens.push({ type: 'MINUS', value: char });
                this.position++;
            } else if (char === '*') {
                this.tokens.push({ type: 'MULTIPLY', value: char });
                this.position++;
            } else if (char === '/') {
                this.tokens.push({ type: 'DIVIDE', value: char });
                this.position++;
            } else if (char === '=') {
                if (this.input[this.position + 1] === '=') {
                    this.tokens.push({ type: 'EQUAL_EQUAL', value: '==' });
                    this.position += 2;
                } else {
                    this.tokens.push({ type: 'EQUALS', value: char });
                    this.position++;
                }
            } else if (char === ';') {
                this.tokens.push({ type: 'SEMICOLON', value: char });
                this.position++;
            } else if (char === '(') {
                this.tokens.push({ type: 'LPAREN', value: char });
                this.position++;
            } else if (char === ')') {
                this.tokens.push({ type: 'RPAREN', value: char });
                this.position++;
            } else if (char === '{') {
                this.tokens.push({ type: 'LBRACE', value: char });
                this.position++;
            } else if (char === '}') {
                this.tokens.push({ type: 'RBRACE', value: char });
                this.position++;
            } else if (char === '>') {
                this.tokens.push({ type: 'GREATER_THAN', value: char });
                this.position++;
            } else if (char === '<') {
                this.tokens.push({ type: 'LESS_THAN', value: char });
                this.position++;
            } else if (char === ',') {
                this.tokens.push({ type: 'COMMA', value: char });
                this.position++;
            } else {
                throw new Error(`Unexpected character: ${char}`);
            }
        }

        return this.tokens;
    }

    readNumber() {
        let start = this.position;
        while (/[0-9]/.test(this.input[this.position])) {
            this.position++;
        }
        return { type: 'NUMBER', value: this.input.slice(start, this.position) };
    }

    readIdentifier() {
        let start = this.position;
        while (/[a-zA-Z_]/.test(this.input[this.position])) {
            this.position++;
        }
        const value = this.input.slice(start, this.position);
        if (value === 'if') {
            return { type: 'IF', value: value };
        } else if (value === 'print') {
            return { type: 'PRINT', value: value };
        } else if (value === 'function') {
            return { type: 'FUNCTION', value: value };
        }
        return { type: 'IDENTIFIER', value: value };
    }

    readString() {
        let start = ++this.position; // Skip the opening quote
        while (this.input[this.position] !== '"') {
            this.position++;
        }
        const value = this.input.slice(start, this.position);
        this.position++; // Skip the closing quote
        return { type: 'STRING', value: value };
    }
}

module.exports = Lexer;
const fs = require('fs');
const Lexer = require('./lexer');
const Parser = require('./parser');
const Interpreter = require('./interpreter');

const input = fs.readFileSync(process.argv.at(2), 'utf-8');

const lexer = new Lexer(input);
const tokens = lexer.tokenize();

const parser = new Parser(tokens);
const ast = parser.parse();

const interpreter = new Interpreter(ast);
interpreter.interpret();
import { Token, TokenType, lookupIdentifier } from "./token";

const isLetter = (s: string | null) =>
  s !== null ? RegExp(/^[a-z_-]+$/i).test(s) : false;

const isDigit = (s: string | null) =>
  s !== null ? RegExp(/^[0-9]+$/).test(s) : false;

export class Lexer {
  #input: string;
  #position: number;
  #readPosition: number;
  #ch: string | null;
  constructor(i: string) {
    this.#input = i;
    this.#position = 0;
    this.#readPosition = 0;
    this.#ch = "";
    this.readChar();
  }

  readChar() {
    if (this.#readPosition >= this.#input.length) {
      this.#ch = null;
    } else {
      this.#ch = this.#input[this.#readPosition];
    }

    this.#position = this.#readPosition;
    this.#readPosition += 1;
  }

  readIdentifier() {
    const position = this.#position;
    while (isLetter(this.#ch)) {
      this.readChar();
    }
    return this.#input.slice(position, this.#position);
  }

  skipWhitespace() {
    while (this.#ch !== null && /\s/.test(this.#ch)) {
      this.readChar();
    }
  }

  readNumber() {
    const position = this.#position;
    while (isDigit(this.#ch)) {
      this.readChar();
    }
    return this.#input.slice(position, this.#position);
  }

  peekChar() {
    if (this.#readPosition >= this.#input.length) {
      return "";
    } else {
      return this.#input[this.#readPosition];
    }
  }

  nextToken() {
    let tok: Token;
    this.skipWhitespace();
    switch (this.#ch) {
      case "=":
        if (this.peekChar() == "=") {
          const ch = this.#ch;
          this.readChar();
          tok = { type: TokenType.EQ, literal: `${ch}${this.#ch}` };
        } else {
          tok = { type: TokenType.ASSIGN, literal: "=" };
        }
        break;
      case ";":
        tok = { type: TokenType.SEMICOLON, literal: ";" };
        break;
      case "(":
        tok = { type: TokenType.LPAREN, literal: "(" };
        break;
      case ")":
        tok = { type: TokenType.RPAREN, literal: ")" };
        break;
      case ",":
        tok = { type: TokenType.COMMA, literal: "," };
        break;
      case "+":
        tok = { type: TokenType.PLUS, literal: "+" };
        break;
      case "!":
        if (this.peekChar() == "=") {
          const ch = this.#ch;
          this.readChar();
          tok = { type: TokenType.NOT_EQ, literal: `${ch}${this.#ch}` };
        } else {
          tok = { type: TokenType.BANG, literal: "!" };
        }
        break;
      case "-":
        tok = { type: TokenType.MINUS, literal: "-" };
        break;
      case "/":
        tok = { type: TokenType.SLASH, literal: "/" };
        break;
      case "*":
        tok = { type: TokenType.ASTERISK, literal: "*" };
        break;
      case "<":
        tok = { type: TokenType.LT, literal: "<" };
        break;
      case ">":
        tok = { type: TokenType.GT, literal: ">" };
        break;
      case "{":
        tok = { type: TokenType.LBRACE, literal: "{" };
        break;
      case "}":
        tok = { type: TokenType.RBRACE, literal: "}" };
        break;
      case null:
        tok = { type: TokenType.EOF, literal: "" };
        break;
      default:
        if (isLetter(this.#ch)) {
          const literal = this.readIdentifier();
          tok = { type: lookupIdentifier(literal), literal };
          return tok;
        } else if (isDigit(this.#ch)) {
          tok = { type: TokenType.INT, literal: this.readNumber() };
          return tok;
        } else {
          tok = { type: TokenType.ILLEGAL, literal: "" };
        }
    }

    this.readChar();
    return tok;
  }
}

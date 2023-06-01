import { Token, TokenType, lookupIdentifier } from "./token";
import { match, P } from "ts-pattern";

const isLetter = (s: string | null) =>
  s !== null ? RegExp(/^[a-z_-]+$/i).test(s) : false;

const isDigit = (s: string | null) =>
  s !== null ? RegExp(/^[0-9]+$/).test(s) : false;

const SPECIAL_TOKENS = new Set([
  TokenType.ELSE,
  TokenType.FALSE,
  TokenType.FUNCTION,
  TokenType.IDENT,
  TokenType.IF,
  TokenType.INT,
  TokenType.LET,
  TokenType.RETURN,
  TokenType.TRUE,
]);

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
    this.skipWhitespace();
    const tok: Token = match([this.#ch, this.peekChar()])
      .with(["=", "="], ([char, peekChar]) => {
        this.readChar();
        return { type: TokenType.EQ, literal: `${char}${peekChar}` };
      })
      .with(["=", P.not("=")], ([literal]) => ({
        type: TokenType.ASSIGN,
        literal,
      }))
      .with(["!", "="], ([char, peekChar]) => {
        this.readChar();
        return {
          type: TokenType.NOT_EQ,
          literal: `${char}${peekChar}`,
        };
      })
      .with(["!", P.not("=")], ([literal]) => ({
        type: TokenType.BANG,
        literal,
      }))
      .with([";", P.any], ([literal]) => ({
        type: TokenType.SEMICOLON,
        literal,
      }))
      .with(["(", P.any], ([literal]) => ({ type: TokenType.LPAREN, literal }))
      .with([")", P.any], ([literal]) => ({ type: TokenType.RPAREN, literal }))
      .with([",", P.any], ([literal]) => ({ type: TokenType.COMMA, literal }))
      .with(["+", P.any], ([literal]) => ({ type: TokenType.PLUS, literal }))
      .with(["-", P.any], ([literal]) => ({ type: TokenType.MINUS, literal }))
      .with(["/", P.any], ([literal]) => ({ type: TokenType.SLASH, literal }))
      .with(["*", P.any], ([literal]) => ({
        type: TokenType.ASTERISK,
        literal,
      }))
      .with(["<", P.any], ([literal]) => ({ type: TokenType.LT, literal }))
      .with([">", P.any], ([literal]) => ({ type: TokenType.GT, literal }))
      .with(["{", P.any], ([literal]) => ({ type: TokenType.LBRACE, literal }))
      .with(["}", P.any], ([literal]) => ({ type: TokenType.RBRACE, literal }))
      .with([null, P.any], (_) => ({ type: TokenType.EOF, literal: "" }))
      .with(
        P.when((ch) => isLetter(ch[0])),
        () => {
          const literal = this.readIdentifier();
          return { type: lookupIdentifier(literal), literal };
        }
      )
      .with(
        P.when((ch) => isDigit(ch[0])),
        () => {
          return { type: TokenType.INT, literal: this.readNumber() };
        }
      )
      .otherwise(() => ({ type: TokenType.ILLEGAL, literal: "" }));

    if (!SPECIAL_TOKENS.has(tok.type)) {
      this.readChar();
    }
    return tok;
  }
}

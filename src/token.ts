export interface Token {
  type: TokenType;
  literal: string;
}

export enum TokenType {
  ILLEGAL = "ILLEGAL",
  EOF = "EOF",
  IDENT = "IDENT",
  INT = "INT",
  ASSIGN = "=",
  PLUS = "+",
  MINUS = "-",
  BANG = "!",
  ASTERISK = "*",
  SLASH = "/",
  LT = "<",
  GT = ">",
  COMMA = ",",
  SEMICOLON = ";",
  LPAREN = "(",
  RPAREN = ")",
  LBRACE = "{",
  RBRACE = "}",
  FUNCTION = "FUNCTION",
  LET = "LET",
  TRUE = "TRUE",
  FALSE = "FALSE",
  IF = "IF",
  ELSE = "ELSE",
  RETURN = "RETURN",
  EQ = "==",
  NOT_EQ = "!=",
}

const keywords = new Map([
  ["fn", TokenType.FUNCTION],
  ["let", TokenType.LET],
  ["true", TokenType.TRUE],
  ["false", TokenType.FALSE],
  ["if", TokenType.IF],
  ["else", TokenType.ELSE],
  ["return", TokenType.RETURN],
]);

export const lookupIdentifier = (ident: string) =>
  keywords.get(ident) ?? TokenType.IDENT;

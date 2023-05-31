import repl from "repl";
import { Lexer } from "./lexer";
import { Token } from "./token";

const interpret = (
  input: string,
  _context: any,
  _filename: any,
  callback: any
): void => {
  const lexer = new Lexer(input);
  let token = lexer.nextToken();
  let tokens: Token[] = [token];
  while (token.type !== "EOF") {
    token = lexer.nextToken();
    tokens.push(token);
  }
  callback(null, tokens);
};
console.log("Welcome to the Monkey Language");
repl.start({ prompt: "> ", eval: interpret });

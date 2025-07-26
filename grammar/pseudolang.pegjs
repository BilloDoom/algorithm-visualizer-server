// === Entry Point ===
Program
  = _NL? statements:StatementList _NL? EOF {
      return { type: "Program", body: statements };
    }

EOF = !.

// === Statement List ===
StatementList
  = statements:(Statement (_NL+ Statement)*)? {
      const list = statements
        ? [statements[0], ...(statements[1] || []).map(pair => pair[1])]
        : [];
      return list;
    }

Statement
  = FunctionDef
  / IfStatement
  / ForLoop
  / ReturnStatement
  / Assignment
  / Expression

Block
  = _NL* INDENT _NL+ body:StatementList _NL+ DEDENT {
      return { type: "Block", body };
    }

INDENT = ">>>>"
DEDENT = "<<<<"

// === Statements ===
Assignment
  = id:Identifier _ "=" _ expr:Expression {
      return { type: "Assignment", id, value: expr };
    }

FunctionDef
  = "def" __ name:Identifier _ "(" _ args:ArgList _ ")" _ ":" _NL body:Block {
      return {
        type: "FunctionDeclaration",
        name,
        params: args,
        body
      };
    }

ReturnStatement
  = "return" __ value:Expression {
      return { type: "ReturnStatement", value };
    }

ArgList
  = first:Identifier rest:(_ "," _ Identifier)* {
      return [first, ...rest.map(x => x[3])];
    }
  / _ { return []; }

IfStatement
  = "if" __ test:Expression _ ":" _NL body:Block {
      return { type: "IfStatement", test, body };
    }

ForLoop
  = "for" __ id:Identifier _ "in" __ "range" _ "(" _ count:Expression _ ")" _ ":" _NL body:Block {
      return {
        type: "ForLoop",
        id,
        count,
        body
      };
    }

// === Expressions ===
Expression
  = BinaryExpression

BinaryExpression
  = left:Primary _ op:("+" / "-" / "*" / "/" / ">" / "<" / "==") _ right:Primary {
      return {
        type: "BinaryExpression",
        operator: op,
        left,
        right
      };
    }
  / Primary

Primary
  = FunctionCall
  / Number
  / String
  / Identifier

FunctionCall
  = name:Identifier _ "(" _ args:ArgValues _ ")" {
      return {
        type: "CallExpression",
        callee: name,
        arguments: args
      };
    }

ArgValues
  = first:Expression rest:(_ "," _ Expression)* {
      return [first, ...rest.map(x => x[3])];
    }
  / _ { return []; }

// === Atoms ===
Identifier
  = name:$(Letter (Letter / Digit)*) {
      return { type: "Identifier", name };
    }

Number
  = n:$([0-9]+) { return { type: "Literal", value: parseInt(n, 10) }; }

String
  = "\"" chars:$(Char*) "\"" { return { type: "Literal", value: chars }; }

Char
  = !["\n\r] .

// === Whitespace ===
_  = [ \t]*                 // Optional whitespace (no newlines)
__ = [ \t]+                 // Required space
_NL = ([ \t]* ("\r"? "\n"))+  // Required newline(s)

Letter = [a-zA-Z_]
Digit  = [0-9]

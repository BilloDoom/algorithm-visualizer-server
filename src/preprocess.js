export function preprocess(code) {
    const lines = code.split('\n');
    const INDENT = 'INDENT';
    const DEDENT = 'DEDENT';

    let indentStack = [0];
    const output = [];

    for (let rawLine of lines) {
        const line = rawLine.replace(/\r/g, '');
        const trimmed = line.trim();

        if (trimmed === '' || trimmed.startsWith('#')) continue;

        const indent = line.match(/^ */)[0].length;

        if (indent > indentStack[indentStack.length - 1]) {
            indentStack.push(indent);
            output.push(INDENT);
        } else {
            while (indent < indentStack[indentStack.length - 1]) {
                indentStack.pop();
                output.push(DEDENT);
            }
        }

        output.push(trimmed);
    }

    while (indentStack.length > 1) {
        indentStack.pop();
        output.push(DEDENT);
    }

    return output.join('\n');
}

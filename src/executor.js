import { drawingAPI } from "./runtime.js";

export function runTranspiledCode(jsCode) {
  const sandbox = { ...drawingAPI };

  const userFunc = new Function(...Object.keys(sandbox), jsCode);
  userFunc(...Object.values(sandbox));
}

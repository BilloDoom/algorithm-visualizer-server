import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { parse } from './parser.js';
import { transpile } from './transpiler.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/compile', (req, res) => {
  const { code } = req.body;

  try {
    const ast = parse(code);
    const compiledJs = transpile(ast);
    res.json({ success: true, compiled: compiledJs });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

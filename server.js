import cors from 'cors';
import { pipeline } from '@xenova/transformers';
import express from 'express';

const app = express();
app.use(cors())
app.use(express.json());


console.log('Loading model...');
const classifier = await pipeline('sentiment-analysis');
console.log('Model ready.');

app.post('/sentiment', async (req, res) => {
  const { text } = req.body;
  const result = await classifier(text);
  res.json(result);
});

app.listen(3001, () => console.log('Inference server running on :3001'));
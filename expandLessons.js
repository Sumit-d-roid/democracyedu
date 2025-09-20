const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const LESSONS_DIR = './content/lessons';
const MODEL_URL = 'https://api-inference.huggingface.co/models/google/flan-t5-base'; // Free, but limited

async function expandText(text) {
  const prompt = `Expand this educational content with more examples, case studies, and practical exercises:\n${text}`;
  const response = await fetch(MODEL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputs: prompt })
  });
  const result = await response.json();
  return result[0]?.generated_text || '';
}

async function processLesson(file) {
  const lesson = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const section of lesson.sections) {
    const expanded = await expandText(section.content);
    section.content += '\n\n' + expanded;
  }
  fs.writeFileSync(file, JSON.stringify(lesson, null, 2));
  console.log(`Expanded: ${file}`);
}

async function main() {
  const files = fs.readdirSync(LESSONS_DIR).filter(f => f.endsWith('.json'));
  for (const file of files) {
    await processLesson(path.join(LESSONS_DIR, file));
  }
}

main();

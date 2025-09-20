const fs = require('fs');
const path = require('path');
let fetchFn = global.fetch;
if (!fetchFn) {
  fetchFn = require('node-fetch');
}

const LESSONS_DIR = './content/lessons';
const GEMINI_API_KEY = 'AIzaSyCEUcunYewJLAurcK9FQbCavt_o6PzIsBA';
const MODEL_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function expandText(text) {
  const prompt = `You are an expert educational content writer. Deeply expand and enrich the following information with detailed examples, case studies, practical exercises, and additional explanations. Make the content suitable for intermediate learners and ensure it is relevant to Nepal's constitution and civic education.\n\n${text}`;
  const response = await fetchFn(MODEL_URL + '?key=' + GEMINI_API_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    })
  });
  const result = await response.json();
  // Gemini returns candidates[0].content.parts[0].text
  return result.candidates?.[0]?.content?.parts?.[0]?.text || '';
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

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';

dotenv.config();

class ConstitutionHelper {
  constructor(token) {
    this.API_TOKEN = token;
    // Using an openly available text generation model
    this.MODEL = "gpt2";
    this.API_URL = `https://api-inference.huggingface.co/models/${this.MODEL}`;
  }

  async query(prompt) {
    console.log('🔄 Sending request to:', this.MODEL);
    console.log('🔑 Using token:', this.API_TOKEN.substring(0, 8) + '...');
    
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false,
            do_sample: true
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`API Error: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Response received');
      return result;
    } catch (error) {
      console.error('❌ Query failed:', error.message);
      throw error;
    }
  }

  async generateLesson(topic) {
    const prompt = `Create a lesson about "${topic}" from Nepal's Constitution. Include:
1. A brief summary
2. Key points (3-5 points)
3. 3 multiple choice questions with explanations

Format the response in clear sections.`;

    try {
      console.log(`📚 Generating lesson for: ${topic}...`);
      const response = await this.query(prompt);
      const content = Array.isArray(response) ? response[0] : response;
      
      // Save the response
      const outputDir = path.join(process.cwd(), 'content/lessons');
      await fs.mkdir(outputDir, { recursive: true });
      
      const fileName = `${topic.toLowerCase().replace(/\s+/g, '-')}.json`;
      const output = {
        topic,
        timestamp: new Date().toISOString(),
        content: content.generated_text || content,
        model: this.MODEL
      };

      await fs.writeFile(
        path.join(outputDir, fileName),
        JSON.stringify(output, null, 2)
      );
      
      console.log(`✅ Lesson saved to: ${fileName}`);
      return output;
    } catch (error) {
      console.error('❌ Error generating lesson:', error.message);
      throw error;
    }
  }

  async generateQuiz(constitutionalText) {
    const prompt = `Based on this text from Nepal's Constitution:

${constitutionalText}

Generate 3 multiple choice questions that test understanding. For each question:
1. Make it practical and relevant to citizens
2. Provide 4 options with one correct answer
3. Include a brief explanation for the correct answer`;

    try {
      console.log('🎯 Generating quiz questions...');
      const response = await this.query(prompt);
      return response;
    } catch (error) {
      console.error('❌ Error generating quiz:', error.message);
      throw error;
    }
  }
}

// Example usage
async function main() {
  if (!process.env.HF_TOKEN) {
    console.error('❌ No HF_TOKEN found in environment variables!');
    process.exit(1);
  }

  const helper = new ConstitutionHelper(process.env.HF_TOKEN);

  try {
    console.log('\n🚀 Testing Constitution Helper');
    
    // Generate a lesson about Fundamental Rights
    console.log('\n📖 Generating Lesson...');
    const lesson = await helper.generateLesson('Fundamental Rights');
    console.log('\nGenerated Content:');
    console.log(lesson.content);

    // Generate a quiz
    console.log('\n📝 Generating Quiz...');
    const sampleText = `
    Article 17. Right to Freedom
    (1) Every citizen shall have the following freedoms:
    (a) freedom of opinion and expression,
    (b) freedom to assemble peaceably and without arms,
    (c) freedom to form political parties,
    (d) freedom to form unions and associations,
    (e) freedom to move and reside in any part of Nepal.`;
    
    const quiz = await helper.generateQuiz(sampleText);
    console.log('\nGenerated Quiz:');
    console.log(quiz);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run test if executed directly
if (process.argv[2] === 'test') {
  console.log('🔍 Starting test...');
  main().catch(console.error);
}
'use server'

import * as fs from 'fs';
import * as path from 'path';

export async function getPromptTemplate(): Promise<string> {
  const promptPath = path.join(process.cwd(), 'app', 'actions', 'prompts', 'generate-values-prompt.txt');
  return fs.readFileSync(promptPath, 'utf8');
}
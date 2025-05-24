'use server'

import * as fs from 'fs';
import * as path from 'path';
import { generateValuesPrompt } from './prompts/generate-values-prompt';

export async function getPromptTemplate(): Promise<string> {
  const promptPath = path.join(process.cwd(), 'app', 'actions', 'prompts', 'generate-values-prompt.txt');
  return generateValuesPrompt;
}
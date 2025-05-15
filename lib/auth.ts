import { GoogleAuth } from 'google-auth-library';
import * as fs from 'fs-extra';
import path from 'path';

// GoogleAuth インスタンスを提供するクラス
export class GoogleAuthProvider {
  private static instance: GoogleAuth;

  // シングルトンパターンでインスタンスを取得
  public static getInstance(): GoogleAuth {
    if (!GoogleAuthProvider.instance) {
      const keyPath = path.join(process.cwd(), 'key', 'sekairoscope-3177be258b29.json');
      
      GoogleAuthProvider.instance = new GoogleAuth({
        keyFile: keyPath,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });
    }
    
    return GoogleAuthProvider.instance;
  }

  // アクセストークンを取得するヘルパー関数
  public static async getAccessToken(): Promise<string> {
    try {
      const auth = GoogleAuthProvider.getInstance();
      const client = await auth.getClient();
      const token = await client.getAccessToken();
      
      if (!token.token) {
        throw new Error('認証トークンを取得できませんでした');
      }
      
      return token.token;
    } catch (error) {
      console.error('認証エラー:', error);
      throw error instanceof Error ? error : new Error('認証に失敗しました');
    }
  }
}

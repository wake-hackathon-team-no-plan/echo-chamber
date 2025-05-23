import { GoogleAuth } from 'google-auth-library';

// GoogleAuth インスタンスを提供するクラス
export class GoogleAuthProvider {
  private static instance: GoogleAuth;

  // シングルトンパターンでインスタンスを取得
  public static getInstance(): GoogleAuth {
    if (!GoogleAuthProvider.instance) {
      // 環境変数からbase64エンコードされたキーを取得
      const serviceAccountKeyBase64 = process.env.GCP_SERVICE_ACCOUNT_KEY;
      
      if (!serviceAccountKeyBase64) {
        throw new Error("GCP_SERVICE_ACCOUNT_KEY環境変数が設定されていません");
      }

      // base64デコードしてJSONオブジェクトに変換
      const serviceAccountKey = JSON.parse(
        Buffer.from(serviceAccountKeyBase64, "base64").toString("utf-8")
      );
      
      GoogleAuthProvider.instance = new GoogleAuth({
        credentials: serviceAccountKey,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
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

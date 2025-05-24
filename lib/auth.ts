import { GoogleAuth } from 'google-auth-library';

// GoogleAuth インスタンスを提供するクラス
export class GoogleAuthProvider {
  private static instance: GoogleAuth;

  // シングルトンパターンでインスタンスを取得
  public static getInstance(): GoogleAuth {
    if (!GoogleAuthProvider.instance) {
      // 環境変数からサービスアカウントキーを取得
      const serviceAccountKey = process.env.GCP_SERVICE_ACCOUNT_KEY;
      
      if (!serviceAccountKey) {
        throw new Error('GCP_SERVICE_ACCOUNT_KEY環境変数が設定されていません');
      }
      
      try {
        // Base64エンコードされたキーをデコード
        const decodedKey = Buffer.from(serviceAccountKey, 'base64').toString('utf8');
        const credentials = JSON.parse(decodedKey);
        
        GoogleAuthProvider.instance = new GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });
      } catch (error) {
        console.error('サービスアカウントキーの解析に失敗:', error);
        throw new Error('GCP_SERVICE_ACCOUNT_KEYの形式が正しくありません');
      }
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

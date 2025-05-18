import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { filename } = req.query;
  
  // tmpディレクトリから動画を取得
  const videoPath = path.join(process.cwd(), 'tmp', 'videos', filename as string);
  
  try {
    // ファイルの存在を確認
    try {
      await fs.stat(videoPath);
    } catch (err) {
      res.status(404).end('ファイルが見つかりません');
      return;
    }
    
    // ファイルを読み込む
    const videoBuffer = await fs.readFile(videoPath);

    // Content-Typeを設定
    res.setHeader('Content-Type', 'video/mp4');
    
    // レスポンスを返す
    res.send(videoBuffer);
  } catch (error) {
    console.error('動画取得エラー:', error);
    res.status(500).end('サーバーエラーが発生しました');
  }
}
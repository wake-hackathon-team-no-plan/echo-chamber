# echo-chamber
_By Team No Plan - WAKE Hackathon 2025_

このアプリは、ユーザーが単語に反応することで、自身の価値観や思考のパターンをAIが分析・可視化し、最終的に動画で表現する自己理解支援アプリです。

## 🏗 プロジェクト構成
```
echo-chamber/
├── frontend/     # Next.js で構築されたフロントエンド
├── backend/      # AWS Lambda上で動作するAPI（言語・構成は検討中）
├── README.md
└── .gitignore
```

## ▶️ フロントエンドの起動方法

```bash
cd frontend

# 依存パッケージをインストール（初回のみ）
npm install

# 開発サーバーを起動
npm run dev
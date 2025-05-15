## プロジェクト構成

```
my-app/
├── app/
│   ├── actions/            # 各機能のサーバーアクション
│   ├── [page]/             # 各ページのディレクトリ
│   └── ...
│
├── components/
│   ├── ui/                 # 基本コンポーネント
│   └── feature/            # 特定のUI
│
├── lib/                    # ビジネスロジック
│   └── ...
│
├── types/                  # TypeScript型定義
├── public/                 # 静的ファイル
└── package.json
```

## クローンからサーバー立ち上げまでの手順

1. リポジトリをクローンします。

```bash
git clone <リポジトリのURL>
```

2. 依存関係をインストールします。

```bash
npm install
```

3. 開発サーバーを起動します。

```bash
npm run dev
```

4. ブラウザで[http://localhost:3000](http://localhost:3000)にアクセスして、アプリケーションを確認します。

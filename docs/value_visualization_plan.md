# 解決したい社会課題

**エコーチェンバー・フィルターバブル問題**

SNSやアルゴリズムによって自分の好みや価値観に合わせた情報ばかりに接するようになり、
多様な視点や意見に触れる機会が減少したり、差別思想が攻撃的になる社会課題に注目。

# プロダクトアイデア（どんな解決策か？）

- どんな人の、どんな困りごとを、どう解決する？
    - どんな人の
        - デジタルメディアを日常的に利用している人
        - 自分の情報消費パターンや価値観を振り返りたいと考えている人
    - どんな困りことを、どう解決する
        - ユーザーの興味・関心のある世界を可視化する、
        また、ユーザの興味・関心とあえて異なる視点の世界を可視化することで、異なる世界があることに気づく・考えるきっかけとしたい
- 現時点でのプロダクト概要
    - ユーザーが共感できる言葉・できない言葉をスワイプで仕分けていく
    - それらの言葉をもとにした世界観を表現する。
- 生成AIをどう活用する予定か？
    - 共感できる言葉・できない言葉の候補のリストを生成AIで作成する
    - 価値観や興味関心のキーワードをもとに生成AIで可視化する

# 実装・構成について

## 条件
利用する以下は決定している。

- フロントエンド
    - Next.js
    - TypeScript
- 利用AIのAPI
    - GCP Vertex AI API
- APIの呼び出し方法
    - Next.jsのServer Actionsを使う。 Vertex AI APIのSDKはVeo2が対応していないので、利用禁止。

## GCP Vertex AI API設定・呼び出し方法

### 事前準備（完了済み）
- GCPへのログイン、プロジェクト作成、Vertex AIの有効化
- サービスアカウント「vertex-ai-service」の作成と「Vertex AI 管理者」ロールの付与
- サービスアカウントのJSONキーを作成し、`key/sekairoscope-3177be258b29.json`に保存

### GCP Vertex AIの公式マニュアル

- 動画生成モデル
    - Veo | AI Video Generator | Generative AI on Vertex AI（概要・サンプルリクエスト・手順解説）
    https://cloud.google.com/vertex-ai/generative-ai/docs/video/generate-videos

- テキスト生成モデル

    - gemini | Generative AI on Vertex AI
    https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/gemini

    - gemini 1.5 | Generative AI on Vertex AI
    https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/send-chat-prompts-gemini?hl=ja#gemini-chat-samples-drest


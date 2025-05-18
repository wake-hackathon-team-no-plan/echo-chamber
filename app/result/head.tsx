export default function Head() {
  return (
    <>
      <title>思考バイアス診断結果</title>
      {/* OGPタグ */}
      <meta property="og:title" content="思考バイアス診断" />
      <meta property="og:description" content="あなたの情報の偏り、可視化してみませんか？" />
      {/* ✅ 本番公開時に {your-domain.com} を実際のURLに置き換える */}
      {/* <meta property="og:image" content="https://your-domain.com/ogp/thumbnail.png" /> */}
      <meta property="og:image" content="https://picsum.photos/1200/600" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://your-domain.com/result" />
      {/* Twitterカード用タグ */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="思考バイアス診断" />
      <meta name="twitter:description" content="あなたの情報の偏り、可視化してみませんか？" />
      {/* <meta name="twitter:image" content="https://your-domain.com/ogp/thumbnail.png" /> */}
      <meta name="twitter:image" content="https://picsum.photos/1200/600" />
    </>
  )
}
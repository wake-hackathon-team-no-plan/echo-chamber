import ApiTestForm from '../../components/ApiTestForm';

export const metadata = {
  title: 'API動作確認 | 価値観テキスト生成',
  description: 'Gemini APIを使用した価値観テキスト生成の動作確認ページです',
};

export default function ApiTestPage() {
  return (
    <main className="container mx-auto py-8">
      <ApiTestForm />
    </main>
  );
}
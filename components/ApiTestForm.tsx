'use client'

import { useState, useEffect } from 'react';
import { generateValuesText } from '../app/actions/generate-values-text';
import { generateMovie } from '../app/actions/generate-movie';
import { getPromptTemplate } from '../app/actions/get-prompt-template';
import { generateResultsText, Viewpoint } from '../app/actions/generate-results-text';

export default function ApiTestForm() {
  // テキスト生成用の状態
  const [theme, setTheme] = useState('');
  const [textResult, setTextResult] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [temperature, setTemperature] = useState('0.7');
  
  // 定義されたテーマ一覧
  const themes = ['家族', '教育', '競争', '食', 'メディア', '環境', '友情', 'ジェンダー', '文化', '人種', '芸術', '動物', '幸福論', '政治'];
  
  // 結果プロンプト生成用の状態
  const defaultViewpoints: Viewpoint[] = [
    {
      viewpoint: "距離があっても心はそばに",
      resonates: true
    },
    {
      viewpoint: "役割じゃなくて関係性でいたい",
      resonates: false
    },
    {
      viewpoint: "感謝より、まず対話がほしい",
      resonates: true
    },
    {
      viewpoint: "心地よさがルールになる家庭が理想",
      resonates: true
    },
    {
      viewpoint: "新しい家族の形、どんどんあり！",
      resonates: false
    }
  ];
  
  const [resultTheme, setResultTheme] = useState('家族');
  const [viewpoints, setViewpoints] = useState<Viewpoint[]>(defaultViewpoints);
  const [resultPrompt, setResultPrompt] = useState('');
  
  // 動画生成用の状態
  const [prompt, setPrompt] = useState("A whimsical 3D world floating in soft pink and lavender skies, with several cozy floating islands connected by glowing heart-shaped bridges. Each island represents a different aspect of family values. One island shows two characters far apart, yet connected by a glowing thread of light between their hearts. Another has a picnic scene where everyone is sitting freely, without fixed seats or roles, enjoying each other's presence. A third island has a giant ear-shaped sculpture surrounded by bubbles with dialogue icons, symbolizing listening and conversation. One area displays a playful, upside-down house with a sign that says “normal?”—questioning traditional ideas of family. The whole world is surrounded by floating pillows, blankets, and twinkling stars, creating a warm, relaxed atmosphere. No harsh lines, everything is soft, round, and magical.");
  const [width, setWidth] = useState('1024');
  const [height, setHeight] = useState('576');
  const [videoLength, setVideoLength] = useState('5');
  const [seed, setSeed] = useState('');
  const [guidanceScale, setGuidanceScale] = useState('5.0');
  const [motionBucket, setMotionBucket] = useState('127');
  const [videoPath, setVideoPath] = useState<string>('');
  
  // 共通の状態
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // プロンプトテンプレートの読み込み
  useEffect(() => {
    const loadPromptTemplate = async () => {
      try {
        const template = await getPromptTemplate();
        setCustomPrompt(template);
      } catch (error) {
        console.error('Error loading prompt template:', error);
      }
    };
    loadPromptTemplate();
  }, []);

  // テキスト生成のハンドラ
  const handleTextGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTextResult([]);

    try {
      const response = await generateValuesText(
        theme,
        customPrompt || undefined,
        parseFloat(temperature)
      );
      if ('error' in response) {
        setError(response.error);
      } else {
        setTextResult(response.text);
      }
    } catch (err) {
      setError('エラーが発生しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // テーマ選択のハンドラ
  const handleThemeSelect = (selectedTheme: string) => {
    setTheme(selectedTheme);
  };

  // 結果プロンプト生成のハンドラ
  const handleResultGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResultPrompt('');

    try {
      const response = await generateResultsText(
        resultTheme,
        viewpoints,
        undefined,  // カスタムプロンプトは使わない
        parseFloat(temperature)
      );
      
      if ('error' in response) {
        setError(response.error);
      } else {
        setResultPrompt(response.prompt);
        // 生成したプロンプトを動画生成用のプロンプトにセット
        setPrompt(response.prompt);
      }
    } catch (err) {
      setError('エラーが発生しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 動画生成のハンドラ
  const handleMovieGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setVideoPath('');

    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('width', width);
      formData.append('height', height);
      formData.append('videoLength', videoLength);
      formData.append('seed', seed);
      formData.append('guidanceScale', guidanceScale);
      formData.append('motionBucket', motionBucket);

      const response = await generateMovie(formData);
      if ('error' in response) {
        setError(response.error);
      } else {
        setVideoPath(response.videoPath);
      }
    } catch (err) {
      setError('エラーが発生しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* テキスト生成フォーム */}
      <div className="border p-4 rounded">
        <h2 className="text-2xl font-bold mb-4">価値観テキスト生成API テスト</h2>
        <form onSubmit={handleTextGeneration} className="space-y-4">
          <div>
            <label className="block mb-2">
              テーマを選択
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {themes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleThemeSelect(t)}
                  className={`px-4 py-2 rounded ${
                    theme === t
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  {t}
                </button>
              ))}
            </div>
            {theme && (
              <div className="mt-2">
                <p>選択中のテーマ: <strong>{theme}</strong></p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="customPrompt" className="block mb-2">
                カスタムプロンプト（オプション）
              </label>
              <textarea
                id="customPrompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full p-2 border rounded"
                rows={4}
                placeholder="generate-values-text-prompt.txt"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="temperature" className="block mb-2">
                Temperature
              </label>
              <input
                type="number"
                id="temperature"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full p-2 border rounded"
                min="0"
                max="1"
                step="0.01"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !theme}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            {isLoading ? '生成中...' : 'テキスト生成'}
          </button>
        </form>

        {textResult.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">生成結果:</h3>
            <div className="space-y-2">
              {textResult.map((value, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded">
                  {value}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 結果プロンプト生成フォーム */}
      <div className="border p-4 rounded">
        <h2 className="text-2xl font-bold mb-4">結果プロンプト生成API テスト</h2>
        <form onSubmit={handleResultGeneration} className="space-y-4">
          <div>
            <label className="block mb-2">
              テーマ（固定）
            </label>
            <div className="p-2 bg-gray-100 rounded">
              {resultTheme}
            </div>
          </div>

          <div>
            <label className="block mb-2">
              価値観（固定）
            </label>
            <div className="space-y-2">
              {viewpoints.map((vp, index) => (
                <div key={index} className={`p-2 rounded flex justify-between ${vp.resonates ? "bg-green-100" : "bg-red-100"}`}>
                  <span>{vp.viewpoint}</span>
                  <span>{vp.resonates ? "共感する" : "共感しない"}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="resultTemperature" className="block mb-2">
              Temperature
            </label>
            <input
              type="number"
              id="resultTemperature"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full p-2 border rounded"
              min="0"
              max="1"
              step="0.01"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            {isLoading ? '生成中...' : 'プロンプト生成'}
          </button>
        </form>

        {resultPrompt && (
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">生成結果:</h3>
            <div className="p-4 bg-gray-100 rounded whitespace-pre-wrap">
              {resultPrompt}
            </div>
          </div>
        )}
      </div>

      {/* 動画生成フォーム */}
      <div className="border p-4 rounded">
        <h2 className="text-2xl font-bold mb-4">動画生成API テスト</h2>
        <form onSubmit={handleMovieGeneration} className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block mb-2">
              プロンプト
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 border rounded"
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="width" className="block mb-2">
                幅
              </label>
              <input
                type="number"
                id="width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="height" className="block mb-2">
                高さ
              </label>
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="videoLength" className="block mb-2">
                動画の長さ（秒）
              </label>
              <input
                type="number"
                id="videoLength"
                value={videoLength}
                onChange={(e) => setVideoLength(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={isLoading}
                step="1"
              />
            </div>

            <div>
              <label htmlFor="seed" className="block mb-2">
                シード値（オプション）
              </label>
              <input
                type="number"
                id="seed"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="guidanceScale" className="block mb-2">
                ガイダンススケール
              </label>
              <input
                type="number"
                id="guidanceScale"
                value={guidanceScale}
                onChange={(e) => setGuidanceScale(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={isLoading}
                step="0.1"
              />
            </div>

            <div>
              <label htmlFor="motionBucket" className="block mb-2">
                モーションバケット
              </label>
              <input
                type="number"
                id="motionBucket"
                value={motionBucket}
                onChange={(e) => setMotionBucket(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            {isLoading ? '生成中...' : '動画生成'}
          </button>
        </form>

        {videoPath && (
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">生成結果:</h3>
            <video
              src={videoPath}
              controls
              className="w-full rounded"
              style={{ maxWidth: '640px' }}
            >
              お使いのブラウザは動画の再生に対応していません。
            </video>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
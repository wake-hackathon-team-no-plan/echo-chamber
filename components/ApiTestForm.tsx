'use client'

import { useState, useEffect } from 'react';
import { generateValuesText } from '../app/actions/generate-values-text';
import { generateMovie } from '../app/actions/generate-movie';
import { getPromptTemplate } from '../app/actions/get-prompt-template';
import { generateMoviePrompt, Viewpoint } from '../app/actions/generate-movie-prompt-text';
import { generateResultsText } from '../app/actions/generate-results-text';

export default function ApiTestForm() {
  // テキスト生成用の状態
  const [theme, setTheme] = useState('');
  const [textResult, setTextResult] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [temperature, setTemperature] = useState('1.0');
  
  // 定義されたテーマ一覧
  const themes = ['家族', '教育', '競争', '食', 'メディア', '環境', '友情', 'ジェンダー', '文化', '人種', '芸術', '動物', '幸福論', '政治'];
  
  // 共通の価値観サンプルデータ
  const initialViewpoints: Viewpoint[] = [
    {
      viewpoint: "距離があっても心はそばに",
      resonates: true
    },
    {
      viewpoint: "役割じゃなくて関係性でいたい",
      resonates: true
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
      resonates: true
    }
  ];
  
  // 動画プロンプト生成用の状態
  const [moviePromptTheme, setMoviePromptTheme] = useState('家族');
  const [moviePromptViewpoints, setMoviePromptViewpoints] = useState<Viewpoint[]>(initialViewpoints);
  const [moviePromptResult, setMoviePromptResult] = useState('');

  // 結果生成用の状態
  const resultsTheme = '家族'; // 固定値
  const [resultsViewpoints, setResultsViewpoints] = useState<Viewpoint[]>(initialViewpoints);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [perspective, setPerspective] = useState('');
  
  // 動画生成用の状態
  const [prompt, setPrompt] = useState(`A whimsical 3D world floating in soft pink and lavender skies, with several cozy floating islands connected by glowing heart-shaped bridges. Each island represents a different aspect of family values. One island shows two characters far apart, yet connected by a glowing thread of light between their hearts. Another has a picnic scene where everyone is sitting freely, without fixed seats or roles, enjoying each other's presence. A third island has a giant ear-shaped sculpture surrounded by bubbles with dialogue icons, symbolizing listening and conversation. One area displays a playful, upside-down house with a sign that says "normal?"—questioning traditional ideas of family. The whole world is surrounded by floating pillows, blankets, and twinkling stars, creating a warm, relaxed atmosphere. No harsh lines, everything is soft, round, and magical.`);
  const [videoLength, setVideoLength] = useState('5');
  const [aspectRatio, setAspectRatio] = useState('16:9');
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

  // 動画プロンプト生成のハンドラ
  const handleMoviePromptGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMoviePromptResult('');    
    try {
      const response = await generateMoviePrompt(
        moviePromptTheme,
        moviePromptViewpoints,
        parseFloat(temperature)
      );
      
      if ('error' in response) {
        setError(response.error);
      } else {
        setMoviePromptResult(response.movieGenerationPrompt);
        // 生成したプロンプトを動画生成用のプロンプトにセット
        setPrompt(response.movieGenerationPrompt);
      }
    } catch (err) {
      setError('エラーが発生しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 結果生成のハンドラ
  const handleResultsGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setKeywords([]);
    setPerspective('');

    try {
      const response = await generateResultsText(
        resultsTheme,
        resultsViewpoints,
        parseFloat(temperature)
      );
      
      if ('error' in response) {
        setError(response.error);
      } else {
        setKeywords(response.keywords);
        setPerspective(response.perspective);
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
      const response = await generateMovie(
        prompt,
        parseInt(videoLength),
        aspectRatio as "16:9" | "9:16"
      );
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
                placeholder="generate-values-prompt.txt"
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
                max="2"
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

      {/* 映画プロンプト生成フォーム */}
      <div className="border p-4 rounded">
        <h2 className="text-2xl font-bold mb-4">動画プロンプト生成API テスト</h2>
        <form onSubmit={handleMoviePromptGeneration} className="space-y-4">
          <div>
            <label className="block mb-2">
              テーマ（固定）
            </label>
            <div className="p-2 bg-gray-100 rounded">
              {moviePromptTheme}
            </div>
          </div>

          <div>
            <label className="block mb-2">
              価値観（固定）
            </label>
            <div className="space-y-2">
              {moviePromptViewpoints.map((vp, index) => (
                <div key={index} className="p-2 rounded flex justify-between items-center space-x-2">
                  <span className="flex-grow">{vp.viewpoint}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newViewpoints = [...moviePromptViewpoints];
                        newViewpoints[index] = { ...vp, resonates: true };
                        setMoviePromptViewpoints(newViewpoints);
                      }}
                      className={`px-3 py-1 rounded ${
                        vp.resonates ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-green-100'
                      }`}
                      disabled={isLoading}
                    >
                      共感する
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newViewpoints = [...moviePromptViewpoints];
                        newViewpoints[index] = { ...vp, resonates: false };
                        setMoviePromptViewpoints(newViewpoints);
                      }}
                      className={`px-3 py-1 rounded ${
                        !vp.resonates ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-red-100'
                      }`}
                      disabled={isLoading}
                    >
                      共感しない
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="moviePromptTemperature" className="block mb-2">
              Temperature
            </label>
            <input
              type="number"
              id="moviePromptTemperature"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full p-2 border rounded"
              min="0"
              max="2"
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

        {moviePromptResult && (
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">生成結果:</h3>
            <div className="p-4 bg-gray-100 rounded whitespace-pre-wrap">
              {moviePromptResult}
            </div>
          </div>
        )}
      </div>

      {/* 結果生成フォーム */}
      <div className="border p-4 rounded">
        <h2 className="text-2xl font-bold mb-4">結果生成API テスト</h2>
        <form onSubmit={handleResultsGeneration} className="space-y-4">
          <div>
            <label className="block mb-2">
              テーマ（固定）
            </label>
            <div className="p-2 bg-gray-100 rounded">
              {resultsTheme}
            </div>
          </div>

          <div>
            <label className="block mb-2">
              価値観（固定）
            </label>
            <div className="space-y-2">
              {resultsViewpoints.map((vp, index) => (
                <div key={index} className="p-2 rounded flex justify-between items-center space-x-2">
                  <span className="flex-grow">{vp.viewpoint}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newViewpoints = [...resultsViewpoints];
                        newViewpoints[index] = { ...vp, resonates: true };
                        setResultsViewpoints(newViewpoints);
                      }}
                      className={`px-3 py-1 rounded ${
                        vp.resonates ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-green-100'
                      }`}
                      disabled={isLoading}
                    >
                      共感する
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newViewpoints = [...resultsViewpoints];
                        newViewpoints[index] = { ...vp, resonates: false };
                        setResultsViewpoints(newViewpoints);
                      }}
                      className={`px-3 py-1 rounded ${
                        !vp.resonates ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-red-100'
                      }`}
                      disabled={isLoading}
                    >
                      共感しない
                    </button>
                  </div>
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
              max="2"
              step="0.01"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            {isLoading ? '生成中...' : '結果生成'}
          </button>
        </form>

        {(keywords.length > 0 || perspective) && (
          <div className="mt-4 space-y-4">
            {keywords.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-2">キーワード:</h3>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <div key={index} className="px-3 py-1 bg-blue-100 rounded">
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {perspective && (
              <div>
                <h3 className="text-xl font-bold mb-2">価値観の説明:</h3>
                <div className="p-4 bg-gray-100 rounded whitespace-pre-wrap">
                  {perspective}
                </div>
              </div>
            )}
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
              <label htmlFor="videoLength" className="block mb-2">
                動画の長さ（5～8秒）
              </label>
              <input
                type="number"
                id="videoLength"
                value={videoLength}
                onChange={(e) => setVideoLength(e.target.value)}
                className="w-full p-2 border rounded"
                min="5"
                max="8"
                step="1"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="aspectRatio" className="block mb-2">
                アスペクト比
              </label>
              <select
                id="aspectRatio"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={isLoading}
              >
                <option value="16:9">16:9</option>
                <option value="9:16">9:16</option>
              </select>
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
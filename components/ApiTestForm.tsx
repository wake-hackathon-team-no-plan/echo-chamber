'use client'

import { useState } from 'react';
import { generateValuesText } from '../app/actions/generate-values-text';
import { generateMovie } from '../app/actions/generate-movie';

export default function ApiTestForm() {
  // テキスト生成用の状態
  const [input, setInput] = useState('');
  const [textResult, setTextResult] = useState<string>('');
  
  // 動画生成用の状態
  const [prompt, setPrompt] = useState('');
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

  // テキスト生成のハンドラ
  const handleTextGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTextResult('');

    try {
      const response = await generateValuesText(input);
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
            <label htmlFor="input" className="block mb-2">
              入力テキスト
            </label>
            <textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-2 border rounded"
              rows={4}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            {isLoading ? '生成中...' : 'テキスト生成'}
          </button>
        </form>

        {textResult && (
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">生成結果:</h3>
            <div className="p-4 bg-gray-100 rounded whitespace-pre-wrap">
              {textResult}
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
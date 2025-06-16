"use client"

import { useEffect, useState, useRef, useCallback } from "react";
import { useLiveAPI } from "@/lib/hooks/useLiveApi";
import { LiveClientOptions } from "@/types/voice";
import { LiveConnectConfig, Modality } from "@google/genai";
import VoiceControls from "@/components/feature/voice/VoiceControls";
import { SYSTEM_PROMPT, START_MESSAGE, TIMEUP_MESSAGE, END_MESSAGE } from "./prompts";
import LogPanel from "@/components/feature/voice/LogPanel";
import { useVoiceTimer } from "@/lib/hooks/useVoiceTimer";
import TimerDisplay from "@/components/feature/voice/TimerDisplay";
import AvatarSection from "@/components/feature/voice/AvatarSection";
import MicButton from "@/components/feature/voice/MicButton";
// 開発モード判定（.env で NEXT_PUBLIC_IS_DEV=true に設定）
const isDev = process.env.NEXT_PUBLIC_IS_DEV === "true";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
if (typeof API_KEY !== "string") {
  throw new Error("NEXT_PUBLIC_GEMINI_API_KEY が設定されていません");
}

const MODEL_NAME = process.env.NEXT_PUBLIC_GEMINI_MODEL_NAME || "models/gemini-2.0-flash-exp";

const apiOptions: LiveClientOptions = {
  apiKey: API_KEY,
};

interface VoiceChatProps {
  results: any;
  onBackToResults?: () => void;
}

export default function VoiceChat({ results, onBackToResults }: VoiceChatProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isAITalking, setIsAITalking] = useState(false);
  const { secondsLeft, start: startTimer, stop: stopTimer, reset: resetTimer } = useVoiceTimer(60);
  const [chatPhase, setChatPhase] = useState<'waiting' | 'preparing' | 'chatting' | 'ending'>('waiting');
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [volumeState, setVolumeState] = useState(0);
  const hasStartedRef = useRef<boolean>(false);
  const [showEndButton, setShowEndButton] = useState(false);
  const [showTimeUpPopup, setShowTimeUpPopup] = useState(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [connectionRetryCount, setConnectionRetryCount] = useState(0);
  const [lastError, setLastError] = useState<string>("");

  const {
    client,
    setConfig,
    connected,
    connect,
    disconnect,
    volume,
    setModel,
  } = useLiveAPI(apiOptions);

  // ログ機能の改善：重要度による色分けと制限
  const log = (msg: string, level: 'info' | 'warn' | 'error' | 'success' | 'api' | 'audio' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = {
      info: '📝',
      warn: '⚠️',
      error: '❌',
      success: '✅',
      api: '🔄', // Live API関連
      audio: '🎤' // 音声関連
    }[level];
    
    const formattedMsg = `${timestamp} ${prefix} ${msg}`;
    setLogMessages((prev) => {
      const newLogs = [...prev.slice(-49), formattedMsg]; // 最大50件保持
      return newLogs;
    });
    
    // LogPanel 側で自動スクロール処理を行う
  };

  // 主要な箇所でlog関数を呼ぶ（コンソールログのインターセプトは削除）
  useEffect(() => {
    // intro animation timer
    const t = setTimeout(() => setShowIntro(false), 800);

    log('VoiceChatマウント', 'info');
    log(`デバイス: ${navigator.userAgent.includes('iPhone') ? 'iPhone' : 'その他'}`, 'info');
    log(`プロトコル: ${window.location.protocol}`, 'info');
    
    // グローバルにlog関数を設定（useLiveAPIから使用するため）
    (window as any).voiceChatLog = log;
    
    return () => {
      log('VoiceChatアンマウント', 'info');
      delete (window as any).voiceChatLog;
    };
  }, []);

  // 接続状態の監視
  useEffect(() => {
    if (connected) {
      log('Live API接続成功', 'api');
      setLastError("");
      setConnectionRetryCount(0);
    } else if (hasStartedRef.current) {
      log('Live API切断検知', 'api');
    }
  }, [connected]);

  // Live APIイベントの監視を追加
  useEffect(() => {
    if (!client) return;

    const handleTurnComplete = () => {
      log('AI返答完了 (turncomplete)', 'api');
      setIsAITalking(false);
    };

    const handleAudio = (data: ArrayBuffer) => {
      // AI音声データ受信時、AIが話しているとみなす
      setIsAITalking(true);
    };

    client.on('turncomplete', handleTurnComplete);
    client.on('audio', handleAudio);

    return () => {
      client.off('turncomplete', handleTurnComplete);
      client.off('audio', handleAudio);
    };
  }, [client]);

  // AI視点セット
  useEffect(() => {
    if (results && !isInitialized) {
      const userPerspective = results.user?.perspective || "";
      const oppositePerspective = results.opposite?.perspective || "";
      const swipeAnswersArr = results.swipeAnswers || [];
      const swipeAnswersStr = Array.isArray(swipeAnswersArr) && swipeAnswersArr.length > 0
        ? swipeAnswersArr.map((a: any) => `${a.viewpoint}:${a.resonates ? "共感" : "非共感"}`).join(" / ")
        : "";
      // voiceName を localStorage (results.opposite.voiceName) から取得。無ければデフォルト "Aoede"
      const oppositeVoiceName = results.opposite?.voiceName || "Aoede";

      //const systemPrompt = SYSTEM_PROMPT
      //  .replace("{{userPerspective}}", userPerspective)
      //  .replace("{{swipeAnswers}}", swipeAnswersStr)
      //  .replace("{{oppositePerspective}}", oppositePerspective);
      
      const systemPrompt = `
【指示】
あなたは、【ユーザーの価値観】と真逆の価値観を持っています。
でも、対立するのではなく、お互いの違いを面白がりながら語り合う友達関係です。
自分の意見はしっかり持ちつつ、押しつけず、やわらかく対話を続けてください。
会話ルール：
•とにかく短い1文でポップに!
•「僕は〜だと思うんだよね」「僕なら〜かな」みたいに、自分の感想で話す。
•説明より感想！分析より感情！
•最後は質問で締めて、ユーザーの考えを引き出す！
•ユーザに質問して！

【ユーザーの価値観】
家族は、血の繋がりを超えた、心の繋がりだ。どんな関係性よりも大切。:共感 / 子供の幸せのためなら、親は自己犠牲も厭わない。それが当然。:共感 / 家族の価値観は、個人の自由を多少犠牲にしても守るべきものだ。:共感 / 親は子供に責任を持つべきだが、子供は親の期待に応える義務はない。:共感 / 伝統的な家族の形に固執する必要はない。多様性こそが、未来の家族の形だ。:非共感 / 家族の絆は、経済的な自立を妨げることもある。時には距離を置くことも必要。:共感 / 親の愛情は無条件ではない。子供も親も、お互いに尊重し合うべきだ。:共感 / 家族は、個人の成長を阻害することもある。自分の人生を優先するべきだ。:非共感 / たとえ血が繋がっていても、価値観が合わないなら、家族関係は破綻する。:共感 / 家族は、社会における最小単位であり、すべての価値観の基盤である。:共感
`;
      console.log(`voice systemPrompt: ${swipeAnswersStr}`);
      console.log(`voice systemPrompt: ${systemPrompt}`);
      const config: LiveConnectConfig = {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          languageCode: "ja-JP",
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: oppositeVoiceName
            }
          }
        },
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        }
      };
      setModel(MODEL_NAME);
      setConfig(config);
      setIsInitialized(true);
      log('AI設定完了', 'success');
    }
  }, [results, setConfig, isInitialized, setModel]);

  // 音量監視
  useEffect(() => {
    setVolumeState(volume);
  }, [volume]);

  // マイク音量による発話状態管理
  const speakingThreshold = 0.01;
  const handleInVolume = (v: number) => {
    setVolumeState(v);
    if (v > speakingThreshold) {
      setIsUserSpeaking(true);
      if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
      speakingTimeoutRef.current = setTimeout(() => setIsUserSpeaking(false), 600);
    } else {
      if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
      setIsUserSpeaking(false);
    }
  };

  // デバッグログ追加版
  const handleStart = async () => {
    try {
      log(`🎯 [DEBUG] handleStart開始 - user gesture: ${performance.now()}`, 'info');
      log('音声チャット開始処理開始', 'info');
      setChatPhase('preparing');
      
      // モバイルブラウザでの権限取得を確実にするため、少し待機
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 接続前にエラーハンドリングを設定
      const handleConnectionError = (error: any) => {
        log(`🎯 [DEBUG] Connection Error: ${JSON.stringify(error)}`, 'error');
        log(`接続エラー: ${error.message || error}`, 'error');
        setLastError(error.message || 'Unknown error');
        setChatPhase('waiting');
        setConnectionRetryCount(prev => prev + 1);
      };
      
      // エラーリスナーを一時的に追加
      client.once('error', handleConnectionError);
      
      try {
        log(`🎯 [DEBUG] connect()呼び出し直前 - user gesture still valid: ${performance.now()}`, 'api');
        log('Live API接続開始...', 'api');
        await connect(); // 接続（音声権限取得）
        log('🎯 [DEBUG] connect()完了', 'success');

        // ★ 変更: 接続直後にAI開始メッセージを送信 ★
        if (client && typeof client.send === "function") {
          const startMessage = { text: START_MESSAGE };
          log(`AIに開始メッセージ即送信: ${JSON.stringify(startMessage)}`, 'api');
          try {
            client.send(startMessage);
            log('🎯 [DEBUG] client.send()成功', 'success');
          } catch (sendError) {
            log(`🎯 [DEBUG] client.send()エラー: ${sendError}`, 'error');
          }
        }

        log('Live API接続成功、チャット開始', 'api');
        setChatPhase('chatting'); // タイマー表示に切り替え
        hasStartedRef.current = true;
        
        // タイマー開始 (1分経過後の処理をコールバックで渡す)
        startTimer(() => {
          setShowTimeUpPopup(true);
          setTimeout(() => setShowTimeUpPopup(false), 2000);
          setShowEndButton(true);
          log('1分経過、終了ボタン表示', 'warn');
          sendTimeUpMessageWhenSilent();
        });
        
        // AIメッセージは setupcomplete イベントで送信される
        log('🎯 [DEBUG] AIメッセージはsetupcompleteイベントで送信されます', 'info');
        
      } catch (error) {
        handleConnectionError(error);
      } finally {
        // エラーリスナーを削除
        client.off('error', handleConnectionError);
      }
      
    } catch (error) {
      log(`🎯 [DEBUG] handleStart全体エラー: ${error instanceof Error ? error.message : String(error)}`, 'error');
      log(`開始エラー: ${error instanceof Error ? error.message : String(error)}`, 'error');
      setLastError(error instanceof Error ? error.message : String(error));
      setChatPhase('waiting');
    }
  };

  // 終了ボタンクリック時の処理
  const handleEnd = () => {
    log('終了ボタンクリック - 終了処理開始', 'info');
    // タイマーを停止
    stopTimer();
    if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
    // endingフェーズに切り替え
    setChatPhase('ending');
    setShowEndButton(false);
    
    // **根本解決: connected状態に依存せず送信**
    log(`🎯 [DEBUG] 終了メッセージ送信チェック - connected: ${connected}, client: ${!!client}, client.send: ${typeof client.send}`, 'api');
    if (client && typeof client.send === "function") {
      const endMessage = { text: END_MESSAGE };
      log(`AI終了メッセージ送信: ${JSON.stringify(endMessage)}`, 'api');
      try {
        client.send(endMessage);
        log('🎯 [DEBUG] 終了メッセージ送信成功', 'success');
      } catch (sendError) {
        log(`🎯 [DEBUG] 終了メッセージ送信エラー: ${sendError}`, 'error');
      }
      
      // AIの回答完了を待ってから切断&戻る
      const handleAIComplete = () => {
        log('AI回答完了検知、切断&戻る', 'api');
        disconnect();
        client.off('turncomplete', handleAIComplete);
        // 少し待ってからresult画面に戻る
        setTimeout(() => {
          if (onBackToResults) {
            onBackToResults();
          } else {
            // フォールバック: 状態をリセットしてwaitingに戻る
            setChatPhase('waiting');
            stopTimer();
            resetTimer();
            hasStartedRef.current = false;
          }
        }, 2000);
      };
      
      client.once('turncomplete', handleAIComplete);
      
      // 念のため10秒でタイムアウト
      setTimeout(() => {
        log('AI回答タイムアウト、強制終了', 'warn');
        disconnect();
        client.off('turncomplete', handleAIComplete);
        if (onBackToResults) {
          onBackToResults();
        } else {
          setChatPhase('waiting');
          stopTimer();
          resetTimer();
          hasStartedRef.current = false;
        }
      }, 10000);
    } else {
      // 接続されていない場合は即座に戻る
      log('🎯 [DEBUG] clientがないため即座終了', 'warn');
      setTimeout(() => {
        if (onBackToResults) {
          onBackToResults();
        } else {
          setChatPhase('waiting');
          stopTimer();
          resetTimer();
          hasStartedRef.current = false;
        }
      }, 2000);
    }
    log('終了処理完了', 'success');
  };

  // 1分経過後、沈黙を待って案内メッセージを送信
  const sendTimeUpMessageWhenSilent = useCallback(() => {
    const timeUpPrompt = TIMEUP_MESSAGE;

    const checkSilence = () => {
      if (!isAITalking && !isUserSpeaking) {
        if (client && typeof client.send === 'function') {
          try {
            client.send({ text: timeUpPrompt });
            log('📢 AI案内メッセージ送信完了', 'success');
          } catch (e) {
            log(`案内メッセージ送信エラー: ${e}`, 'error');
          }
        }
        setShowEndButton(true);
      } else {
        // まだ会話中の場合は500ms後にリトライ
        setTimeout(checkSilence, 500);
      }
    };

    checkSilence();
  }, [isAITalking, isUserSpeaking, client, log]);

  return (
    <div className="h-full flex flex-col items-center justify-between bg-white py-4 px-2">
      {/* タイマー */}
      <TimerDisplay chatPhase={chatPhase} secondsLeft={secondsLeft} />
      
      {/* エラー表示 */}
      {lastError && (
        <div className="w-full px-4 mb-2">
          <div className="bg-red-100 border border-red-300 rounded p-2 text-sm text-red-800">
            <div className="flex justify-between items-center">
              <span>❌ エラー: {lastError}</span>
              <button 
                onClick={() => setLastError("")}
                className="text-red-600 hover:text-red-800 ml-2"
              >
                ✕
              </button>
            </div>
            {connectionRetryCount > 0 && (
              <div className="text-xs mt-1">
                リトライ回数: {connectionRetryCount}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* キャラクター＋ビジュアライザー */}
      <AvatarSection isAITalking={isAITalking} isUserSpeaking={isUserSpeaking} showIntro={showIntro} />
      
      {/* マイクボタン */}
      <MicButton
        chatPhase={chatPhase}
        showEndButton={showEndButton}
        onStart={handleStart}
        onEnd={handleEnd}
      />
      
      {/* 音声処理用 VoiceControls（UIは非表示） */}
      <div>
        <VoiceControls
          connected={connected}
          connect={connect}
          disconnect={disconnect}
          client={client}
          volume={volume}
          onInVolume={handleInVolume}
        />
      </div>
      
      {/* 1分経過ポップアップ */}
      {showTimeUpPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white text-blue-600 px-12 py-8 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-blue-200">
            <span className="text-4xl">⏰</span>
            <span className="font-bold text-2xl">1分経ちました！</span>
          </div>
        </div>
      )}
      
      {/* ログ表示（開発環境のみ） */}
      {isDev && <LogPanel messages={logMessages} />}
    </div>
  );
}
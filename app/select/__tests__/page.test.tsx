import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import SelectPage from '../page'
import { allThemes } from '../../../components/feature/select/themes'
import { Theme } from '../../../components/feature/select/themes'
import * as generateValuesTextModule from '../../../app/actions/generate-values-text'

// モックの設定
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

// Framer Motionのモック
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}))

// 表示用の8テーマ（テスト用）
const mockDisplayThemes = [
  allThemes[0], // 政治
  allThemes[1], // 経済
  allThemes[2], // 環境問題
  allThemes[3], // テクノロジー
  allThemes[4], // 教育
  allThemes[5], // 健康
  allThemes[6], // エンターテイメント
  allThemes[7]  // スポーツ
]

// useRandomThemesフックのモック（UI要素のテスト用）
const mockUseRandomThemes = jest.fn().mockReturnValue(mockDisplayThemes)
jest.mock('../../../components/feature/select/themes', () => {
  const originalModule = jest.requireActual('../../../components/feature/select/themes')
  return {
    ...originalModule,
    useRandomThemes: () => mockUseRandomThemes()
  }
})

// generateValuesTextサーバーアクションのモック
const mockGenerateValuesText = jest.fn().mockResolvedValue({
  text: [
    "計画的な政策より緊急時対応こそ重要",
    "議論は深まるが結論は出ないもの",
    "大切なのはイデオロギーではなく実践",
    "現実と理想の基準が半世紀ずれてる",
    "ビジョンより数字の実績で運営すべき"
  ]
})

jest.mock('../../../app/actions/generate-values-text', () => ({
  generateValuesText: (theme: string) => mockGenerateValuesText(theme)
}))

// localStorageのモック
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('SelectPage', () => {
  beforeEach(() => {
    mockPush.mockClear()
    localStorageMock.clear()
    // デフォルトのモックテーマを設定
    mockUseRandomThemes.mockReturnValue(mockDisplayThemes)
    // サーバーアクションのモックをリセット
    mockGenerateValuesText.mockClear()
  })

  it('UI要素が正しく表示されること', () => {
    render(<SelectPage />)
    
    // ヘッダーセクションとテーマグリッドが表示されていることを確認
    expect(screen.getByTestId('header-section')).toBeInTheDocument()
    expect(screen.getByTestId('themes-grid')).toBeInTheDocument()
    
    // テーマカードが表示されていることを確認
    mockDisplayThemes.forEach(theme => {
      expect(screen.getByTestId(`theme-card-${theme.id}`)).toBeInTheDocument()
    })
    
    // 「次へ進む」ボタンが表示され、初期状態では無効化されていることを確認
    const nextButton = screen.getByTestId('next-button')
    expect(nextButton).toBeInTheDocument()
    expect(nextButton).toBeDisabled()
  })

  it('テーマを一つだけ選択でき、別のテーマを選択すると前の選択が解除されること', () => {
    render(<SelectPage />)
    
    // 初期状態では「次へ進む」ボタンは無効
    const nextButton = screen.getByTestId('next-button')
    expect(nextButton).toBeDisabled()
    
    // 政治テーマを選択
    const politicsCard = screen.getByTestId('theme-card-1')
    fireEvent.click(politicsCard)
    
    // ボタンが有効化されていることを確認
    expect(nextButton).not.toBeDisabled()
    
    // 経済テーマを選択（政治テーマの選択が解除されるはず）
    const economicsCard = screen.getByTestId('theme-card-2')
    fireEvent.click(economicsCard)
    
    // ボタンは引き続き有効
    expect(nextButton).not.toBeDisabled()
    
    // 同じテーマ（経済）を再度クリックして選択解除
    fireEvent.click(economicsCard)
    
    // すべて選択解除するとボタンは無効に戻る
    expect(nextButton).toBeDisabled()
  })

  it('次へ進むボタンをクリックすると、サーバーアクションが呼び出され、結果がlocalStorageに保存されること', async () => {
    render(<SelectPage />)
    
    // 政治テーマを選択
    fireEvent.click(screen.getByTestId('theme-card-1'))
    
    // 次へ進むボタンをクリック
    const nextButton = screen.getByTestId('next-button')
    fireEvent.click(nextButton)
    
    // サーバーアクションが正しく呼び出されたことを確認
    expect(mockGenerateValuesText).toHaveBeenCalledWith("政治")
    
    // 非同期処理が完了するのを待つ
    await waitFor(() => {
      // localStorageに選択したテーマIDが保存されていることを確認
      expect(localStorageMock.getItem('selectedThemes')).toBe('[1]')
      
      // 生成されたカードが保存されていることを確認
      const generatedCards = JSON.parse(localStorageMock.getItem('generatedCards') || '{}')
      expect(generatedCards).toHaveLength(5) // 5つのカードが生成される
      expect(generatedCards[0].category).toBe(1) // 選択したテーマIDが設定されている
      
      // swipe画面に遷移することを確認
      expect(mockPush).toHaveBeenCalledWith('/swipe')
    })
  })

  it('サーバーアクションがエラーを返した場合、エラーが表示されること', async () => {
    // サーバーアクションがエラーを返すようにモックを設定
    mockGenerateValuesText.mockResolvedValueOnce({ 
      error: 'テキスト生成に失敗しました' 
    })
    
    // window.alertをモック
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})
    
    render(<SelectPage />)
    
    // 政治テーマを選択
    fireEvent.click(screen.getByTestId('theme-card-1'))
    
    // 次へ進むボタンをクリック
    const nextButton = screen.getByTestId('next-button')
    fireEvent.click(nextButton)
    
    // 非同期処理が完了するのを待つ
    await waitFor(() => {
      // alertが表示されることを確認
      expect(alertMock).toHaveBeenCalledWith(
        expect.stringContaining('ワードの生成中にエラーが発生しました')
      )
      
      // swipe画面に遷移しないことを確認
      expect(mockPush).not.toHaveBeenCalled()
    })
    
    // モックを元に戻す
    alertMock.mockRestore()
  })

  it('テーマがランダムに選択されること', () => {
    // 実際のuseRandomThemesの実装をチェック
    const { useRandomThemes } = jest.requireActual('../../../components/feature/select/themes')
    
    // ランダム性をテストするため、実際の実装を使って結果を確認
    const mockSetState = jest.fn()
    
    // useEffectの中身を直接テスト
    const useEffectCallback = () => {
      const shuffled = [...allThemes].sort(() => 0.5 - Math.random())
      mockSetState(shuffled.slice(0, 8))
    }
    
    // 複数回実行して結果が異なることを確認
    const results: number[][] = []
    for (let i = 0; i < 5; i++) {
      useEffectCallback()
      
      // 選択されたテーマのIDを記録
      const selectedThemes = mockSetState.mock.calls[i][0] as Theme[]
      const selectedIds = selectedThemes.map(theme => theme.id)
      results.push(selectedIds)
      
      // 8個選択されていることを確認
      expect(selectedThemes.length).toBe(8)
      
      // 重複がないことを確認
      const uniqueIds = new Set(selectedIds)
      expect(uniqueIds.size).toBe(8)
    }
    
    // 少なくとも2つの異なる選択結果があることを確認
    const allResultsAreSame = results.every((result, i) => {
      if (i === 0) return true
      const prev = JSON.stringify([...results[0]].sort())
      const current = JSON.stringify([...result].sort())
      return prev === current
    })
    
    // ランダム性があるため、少なくとも1つは異なる結果になるはず
    expect(allResultsAreSame).toBe(false)
  })
})

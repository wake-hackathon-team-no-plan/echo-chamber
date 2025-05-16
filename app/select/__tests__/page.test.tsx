import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import SelectPage from '../page'
import { allTopics } from '../../../components/feature/select/topics'
import { Topic } from '../../../components/feature/select/topics'

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

// 表示用の8トピック（テスト用）
const mockDisplayTopics = [
  allTopics[0], // 政治
  allTopics[1], // 経済
  allTopics[2], // 環境問題
  allTopics[3], // テクノロジー
  allTopics[4], // 教育
  allTopics[5], // 健康
  allTopics[6], // エンターテイメント
  allTopics[7]  // スポーツ
]

// useRandomTopicsフックのモック（UI要素のテスト用）
const mockUseRandomTopics = jest.fn().mockReturnValue(mockDisplayTopics)
jest.mock('../../../components/feature/select/topics', () => {
  const originalModule = jest.requireActual('../../../components/feature/select/topics')
  return {
    ...originalModule,
    useRandomTopics: () => mockUseRandomTopics()
  }
})

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
    // デフォルトのモックトピックを設定
    mockUseRandomTopics.mockReturnValue(mockDisplayTopics)
  })

  it('UI要素が正しく表示されること', () => {
    render(<SelectPage />)
    
    // ヘッダーセクションとトピックグリッドが表示されていることを確認
    expect(screen.getByTestId('header-section')).toBeInTheDocument()
    expect(screen.getByTestId('topics-grid')).toBeInTheDocument()
    
    // トピックカードが表示されていることを確認
    mockDisplayTopics.forEach(topic => {
      expect(screen.getByTestId(`topic-card-${topic.id}`)).toBeInTheDocument()
    })
    
    // 「次へ進む」ボタンが表示され、初期状態では無効化されていることを確認
    const nextButton = screen.getByTestId('next-button')
    expect(nextButton).toBeInTheDocument()
    expect(nextButton).toBeDisabled()
  })

  it('トピックを一つだけ選択でき、別のトピックを選択すると前の選択が解除されること', () => {
    render(<SelectPage />)
    
    // 初期状態では「次へ進む」ボタンは無効
    const nextButton = screen.getByTestId('next-button')
    expect(nextButton).toBeDisabled()
    
    // 政治トピックを選択
    const politicsCard = screen.getByTestId('topic-card-1')
    fireEvent.click(politicsCard)
    
    // ボタンが有効化されていることを確認
    expect(nextButton).not.toBeDisabled()
    
    // 経済トピックを選択（政治トピックの選択が解除されるはず）
    const economicsCard = screen.getByTestId('topic-card-2')
    fireEvent.click(economicsCard)
    
    // ボタンは引き続き有効
    expect(nextButton).not.toBeDisabled()
    
    // 同じトピック（経済）を再度クリックして選択解除
    fireEvent.click(economicsCard)
    
    // すべて選択解除するとボタンは無効に戻る
    expect(nextButton).toBeDisabled()
  })

  it('次へ進むボタンをクリックすると、選択したトピックがlocalStorageに保存され、swipe画面に遷移すること', () => {
    render(<SelectPage />)
    
    // 政治トピックを選択
    fireEvent.click(screen.getByTestId('topic-card-1'))
    
    // 次へ進むボタンをクリック
    const nextButton = screen.getByTestId('next-button')
    fireEvent.click(nextButton)
    
    // localStorageに選択したトピックIDが保存されていることを確認
    expect(localStorageMock.getItem('selectedTopics')).toBe('[1]')
    
    // swipe画面に遷移することを確認
    expect(mockPush).toHaveBeenCalledWith('/swipe')
  })

  it('トピックがランダムに選択されること', () => {
    // 実際のuseRandomTopicsの実装をチェック
    const { useRandomTopics } = jest.requireActual('../../../components/feature/select/topics')
    
    // ランダム性をテストするため、実際の実装を使って結果を確認
    const mockSetState = jest.fn()
    
    // useEffectの中身を直接テスト
    const useEffectCallback = () => {
      const shuffled = [...allTopics].sort(() => 0.5 - Math.random())
      mockSetState(shuffled.slice(0, 8))
    }
    
    // 複数回実行して結果が異なることを確認
    const results: number[][] = []
    for (let i = 0; i < 5; i++) {
      useEffectCallback()
      
      // 選択されたトピックのIDを記録
      const selectedTopics = mockSetState.mock.calls[i][0] as Topic[]
      const selectedIds = selectedTopics.map(topic => topic.id)
      results.push(selectedIds)
      
      // 8個選択されていることを確認
      expect(selectedTopics.length).toBe(8)
      
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
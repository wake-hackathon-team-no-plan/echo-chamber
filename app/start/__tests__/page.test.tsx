import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import StartPage from '../page'

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

describe('StartPage', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('正しくレンダリングされること', () => {
    render(<StartPage />)
    
    // スタートボタンが表示されていることを確認
    const startButton = screen.getByTestId('start-button')
    expect(startButton).toBeInTheDocument()
  })

  it('ボタンクリックで/selectに遷移すること', () => {
    render(<StartPage />)
    
    // ボタンをクリック
    const startButton = screen.getByTestId('start-button')
    fireEvent.click(startButton)
    
    // router.pushが/selectで呼ばれたことを確認
    expect(mockPush).toHaveBeenCalledWith('/select')
  })
}) 
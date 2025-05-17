import { Loader2 } from "lucide-react"

type LoadingOverlayProps = {
  message?: string
}

export function LoadingOverlay({ message = "読み込み中..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="text-gray-700 text-center">{message}</p>
        </div>
      </div>
    </div>
  )
} 
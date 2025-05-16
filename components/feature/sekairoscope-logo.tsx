import type React from "react"

interface SekairoscopeLogoProps {
  className?: string
}

const SekairoscopeLogo: React.FC<SekairoscopeLogoProps> = ({ className = "" }) => {
  return (
    <div className={`sekairoscope-logo ${className}`}>
      <div className="flex items-center">
        {/* アイコン部分 */}
        <div className="relative w-12 h-12 mr-3">
          <div className="absolute inset-0 bg-[#ff5c8d] rounded-full opacity-70 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full overflow-hidden relative">
              {/* 万華鏡のような模様 */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff5c8d] via-[#3b7ff2] to-[#00c896] opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#ffba08]"></div>
                </div>
              </div>
              {/* 放射状の線 */}
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-[1px] h-5 bg-white opacity-70"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                      transformOrigin: "center",
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* テキスト部分 */}
        <div>
          <h1 className="text-2xl font-black leading-tight">
            セカイロスコープ
            <span className="block text-sm font-medium text-gray-600">Sekairoscope</span>
          </h1>
        </div>
      </div>
    </div>
  )
}

export default SekairoscopeLogo

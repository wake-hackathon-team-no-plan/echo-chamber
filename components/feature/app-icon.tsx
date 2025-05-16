import type React from "react"

interface AppIconProps {
  size?: number
  className?: string
}

const AppIcon: React.FC<AppIconProps> = ({ size = 64, className = "" }) => {
  return (
    <div
      className={`relative rounded-xl overflow-hidden ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* 背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ff5c8d] via-[#3b7ff2] to-[#00c896]"></div>

      {/* 万華鏡のパターン */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-3/4 h-3/4 rounded-full overflow-hidden">
          {/* 中心の円 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1/2 h-1/2 rounded-full bg-white flex items-center justify-center">
              <div className="w-1/2 h-1/2 rounded-full bg-[#ffba08]"></div>
            </div>
          </div>

          {/* 放射状の線 */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 bg-white/70"
              style={{
                width: "1px",
                height: `${size * 0.375}px`,
                transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                transformOrigin: "center",
              }}
            ></div>
          ))}

          {/* 三角形のパターン */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`triangle-${i}`}
              className="absolute"
              style={{
                width: `${size * 0.2}px`,
                height: `${size * 0.2}px`,
                top: `calc(50% - ${size * 0.1}px)`,
                left: `calc(50% - ${size * 0.1}px)`,
                transform: `rotate(${i * 60}deg) translateY(-${size * 0.25}px)`,
                transformOrigin: "center bottom",
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                background: i % 2 === 0 ? "rgba(255, 186, 8, 0.7)" : "rgba(0, 200, 150, 0.7)",
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* 外側の装飾 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="absolute rounded-full border-2 border-white/30"
          style={{ width: `${size * 0.85}px`, height: `${size * 0.85}px` }}
        ></div>
      </div>
    </div>
  )
}

export default AppIcon

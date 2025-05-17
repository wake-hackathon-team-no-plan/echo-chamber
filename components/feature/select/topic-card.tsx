/**
 * トピック選択用のカードコンポーネント
 */
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Topic } from "./topics"

// Lucideアイコンを使用してMaterial Design風のアイコンを提供
import {
  LandmarkIcon,
  BarChart3Icon,
  LeafIcon,
  CpuIcon,
  GraduationCapIcon,
  HeartIcon,
  FilmIcon,
  TrophyIcon,
  HelpCircleIcon,
  FlaskConicalIcon,
  PaletteIcon,
  ClockIcon,
  LandmarkIcon as MuseumIcon,
  PlaneIcon,
  UtensilsIcon,
  ShirtIcon,
  BrainIcon,
  RocketIcon,
  BuildingIcon,
  LanguagesIcon,
  ShareIcon
} from "lucide-react"

// Material Iconsの名前とLucideアイコンのマッピング
const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  "AccountBalance": LandmarkIcon,
  "TrendingUp": BarChart3Icon,
  "EcoOutlined": LeafIcon,
  "ComputerOutlined": CpuIcon,
  "School": GraduationCapIcon,
  "FavoriteBorder": HeartIcon,
  "MovieOutlined": FilmIcon,
  "EmojiEvents": TrophyIcon,
  "Science": FlaskConicalIcon,
  "Palette": PaletteIcon,
  "History": ClockIcon,
  "Museum": MuseumIcon,
  "Flight": PlaneIcon,
  "Restaurant": UtensilsIcon,
  "Checkroom": ShirtIcon,
  "Psychology": BrainIcon,
  "Rocket": RocketIcon,
  "Architecture": BuildingIcon,
  "Translate": LanguagesIcon,
  "ConnectWithoutContact": ShareIcon
}

type TopicCardProps = {
  topic: Topic
  isSelected: boolean
  onToggle: (id: number) => void
}

export function TopicCard({ topic, isSelected, onToggle }: TopicCardProps) {
  // マッピングからアイコンを取得、なければフォールバック
  const IconComponent = iconMap[topic.iconName] || HelpCircleIcon

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card
        className={`cursor-pointer transition-all h-full ${
          isSelected
            ? "border-4 border-[#3b7ff2] bg-[#3b7ff2]/10"
            : "border border-gray-200 hover:border-[#3b7ff2]/50"
        }`}
        onClick={() => onToggle(topic.id)}
        data-testid={`topic-card-${topic.id}`}
      >
        <CardContent className="flex flex-col items-center justify-center p-6 h-full">
          <div className="mb-4 text-gray-700">
            <IconComponent size={40} className="stroke-[1.5px]" />
          </div>
          <h3 className="text-xl font-bold" data-testid={`topic-title-${topic.id}`}>{topic.title}</h3>
        </CardContent>
      </Card>
    </motion.div>
  )
}

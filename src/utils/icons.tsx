import { BadgeCheck, BadgeX, BanknoteIcon, Skull, BadgeMinus, BadgePlus, SquareMenu, Trophy } from 'lucide-react'

export const icons = {
  BadgeCheck,
  BadgeX,
  BanknoteIcon,
  Skull,
  BadgeMinus,
  BadgePlus,
  SquareMenu,
  Trophy,
} as const

export type IconName = keyof typeof icons
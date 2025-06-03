import { BadgeCheck, BadgeX, BanknoteIcon, Skull, BadgeMinus, BadgePlus, SquareMenu, Trophy, RotateCw } from 'lucide-react'

export const icons = {
  BadgeCheck,
  BadgeX,
  BanknoteIcon,
  Skull,
  BadgeMinus,
  BadgePlus,
  SquareMenu,
  Trophy,
  RotateCw,
} as const

export type IconName = keyof typeof icons
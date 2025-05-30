import { BadgeCheck, BadgeX, BanknoteIcon, Skull, BadgeMinus, BadgePlus, SquareMenu } from 'lucide-react'

export const icons = {
  BadgeCheck,
  BadgeX,
  BanknoteIcon,
  Skull,
  BadgeMinus,
  BadgePlus,
  SquareMenu,
} as const

export type IconName = keyof typeof icons
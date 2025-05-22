import { BadgeCheck, BadgeX, BanknoteIcon, Skull, BadgeMinus, BadgePlus } from 'lucide-react'

export const icons = {
  BadgeCheck,
  BadgeX,
  BanknoteIcon,
  Skull,
  BadgeMinus,
  BadgePlus,
} as const

export type IconName = keyof typeof icons

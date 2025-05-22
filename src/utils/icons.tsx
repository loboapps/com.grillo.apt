import { BadgeCheck, BadgeX, BanknoteIcon, Skull, BadgeMinus } from 'lucide-react'

export const icons = {
  BadgeCheck,
  BadgeX,
  BanknoteIcon,
  Skull,
  BadgeMinus,
} as const

export type IconName = keyof typeof icons

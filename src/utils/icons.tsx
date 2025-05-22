import { BadgeCheck, BadgeX, BanknoteIcon, Skull } from 'lucide-react'

export const icons = {
  BadgeCheck,
  BadgeX,
  BanknoteIcon,
  Skull,
} as const

export type IconName = keyof typeof icons

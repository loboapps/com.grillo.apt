import { BadgeCheck, BadgeX, BanknoteIcon, Skull, BadgeMinus, BadgePlus, Menu } from 'lucide-react'

export const icons = {
  BadgeCheck,
  BadgeX,
  BanknoteIcon,
  Skull,
  BadgeMinus,
  BadgePlus,
  Menu,
} as const

export type IconName = keyof typeof icons
import { BadgeCheck, BadgeX, BanknoteIcon, Skull, BadgeMinus, BadgePlus, SquareMenu as SquareMenuIcon } from 'lucide-react'

export const icons = {
  BadgeCheck,
  BadgeX,
  BanknoteIcon,
  Skull,
  BadgeMinus,
  BadgePlus,
  SquareMenu: SquareMenuIcon
} as const

export type IconName = keyof typeof icons

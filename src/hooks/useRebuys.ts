import { useState } from 'react'

export const MAX_REBUYS = 2

export const useRebuys = () => {
  const [rebuys, setRebuys] = useState<{ [key: string]: number }>({})

  const addRebuy = (player: string) => {
    const currentRebuys = rebuys[player] || 0
    if (currentRebuys < MAX_REBUYS) {
      setRebuys(prev => ({
        ...prev,
        [player]: currentRebuys + 1
      }))
    }
  }

  const hasMaxRebuys = (player: string) => {
    return (rebuys[player] || 0) >= MAX_REBUYS
  }

  return {
    rebuys,
    addRebuy,
    hasMaxRebuys
  }
}

import { useState } from 'react'

export const useGuests = () => {
  const [guests, setGuests] = useState<string[]>([])

  const addGuest = () => {
    setGuests([...guests, ''])
  }

  const updateGuest = (index: number, value: string) => {
    const updatedGuests = [...guests]
    updatedGuests[index] = value
    setGuests(updatedGuests)
  }

  const removeGuest = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index))
  }

  return {
    guests,
    addGuest,
    updateGuest,
    removeGuest
  }
}

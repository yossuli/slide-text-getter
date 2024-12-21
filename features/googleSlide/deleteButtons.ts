import { handleGElements } from "~utils/handleGElements"

import { generateId } from "./generateId"

export const deleteButtons = () =>
  handleGElements((node) => {
    const id = generateId(node)
    const deleteButton = document.getElementById(id)
    if (deleteButton) {
      deleteButton.remove()
    }
  })

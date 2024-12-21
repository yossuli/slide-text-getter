import { handleGElements } from "~utils/handleGElements"

import { createCopyButton } from "./createCopyButton"

export const addListenersToExistingElements = () =>
  handleGElements(createCopyButton)

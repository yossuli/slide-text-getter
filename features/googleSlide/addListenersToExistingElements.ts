import { createCopyButton } from "./createCopyButton"
import { isDisappear } from "./isAppear"
import { isTargetElement } from "./isTargetElement"

export const addListenersToExistingElements = () => {
  document.querySelectorAll<Element>("g").forEach((node) => {
    if (node instanceof Element && isTargetElement(node)) {
      if (isDisappear(node)) return
      createCopyButton(node)
    }
  })
}

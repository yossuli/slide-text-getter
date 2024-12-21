import type { PlasmoCSConfig } from "plasmo"

import { addListenersToExistingElements } from "~features/googleSlide/addListenersToExistingElements"
import { deleteButtons } from "~features/googleSlide/deleteButtons"
import { handleCopyButtons } from "~features/googleSlide/handleCopyButtons"
import { isInIframe as isInIframeUtil } from "~features/googleSlide/isInIframe"

export const config: PlasmoCSConfig = {
  matches: ["https://docs.google.com/presentation/d/*"],
  all_frames: true
}

export const isInIframe = isInIframeUtil()

const observer = new MutationObserver(handleCopyButtons)

const content = (untilExit: boolean) => {
  if (untilExit) {
    addListenersToExistingElements()

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    })

    window.addEventListener("resize", addListenersToExistingElements)
  } else {
    window.removeEventListener("resize", addListenersToExistingElements)
    observer.disconnect()
    deleteButtons()
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.name === "INIT_FROM_BACKGROUND") {
    content(!message.body)
  }
})

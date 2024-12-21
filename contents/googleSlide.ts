import type { PlasmoCSConfig } from "plasmo"

import { addListenersToExistingElements } from "~features/googleSlide/addListenersToExistingElements"
import { handleCopyButtons } from "~features/googleSlide/handleCopyButtons"
import { isInIframe as isInIframeUtil } from "~features/googleSlide/isInIframe"

export const config: PlasmoCSConfig = {
  matches: ["https://docs.google.com/presentation/d/*"],
  all_frames: true
}

export const isInIframe = isInIframeUtil()

const observer = new MutationObserver(handleCopyButtons)

const content = (untilExit: boolean) => {
  if (!untilExit) {
    if (isInIframe) {
      addListenersToExistingElements()

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      })

      window.addEventListener("resize", addListenersToExistingElements)
    }
  } else {
    window.addEventListener("beforeunload", () => {
      chrome.storage.sync.set({ untilExit: true })
    })
    observer.disconnect()
    console.log("observerを停止")
  }
}
chrome.storage.sync.get("untilExit").then((v) => {
  console.log(v)
  content(v.untilExit === "true")
})

chrome.runtime.onMessage.addListener((message) => {
  if (message.name === "CHANGE_SETTINGS_FROM_BACKGROUND") {
    chrome.storage.sync.get("untilExit").then((v) => {
      content(v.untilExit === "true")
    })
  }
})

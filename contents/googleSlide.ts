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
  if (!untilExit) {
    addListenersToExistingElements()

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    })

    window.addEventListener("resize", addListenersToExistingElements)
  } else {
    window.addEventListener("beforeunload", () => {
      chrome.storage.sync.set({ untilExit: true })
    })
    observer.disconnect()
    deleteButtons()
    console.log(2, "observerを停止")
  }
}
chrome.storage.sync.get().then((v) => {
  if (isInIframe) {
    console.log(1, v.untilExit.replaceAll('"', "").replaceAll("'", ""))
    content(
      v.untilExit.replaceAll('"', "").replaceAll("'", "") ===
        window.location.href
    )
  }
})

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync" && changes.untilExit) {
    console.log(
      3,
      changes.untilExit.newValue.replaceAll('"', "").replaceAll("'", ""),
      window.top
    )
    content(
      changes.untilExit.newValue.replaceAll('"', "").replaceAll("'", "") ===
        window.top
    )
  }
})

import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://moocs.iniad.org/*"],
  all_frames: true
}

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  const textToCopy = message.body
  if (message.name === "COPY_TO_CLIPBOARD_FROM_BACKGROUND") {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        console.log("クリップボードにコピーしました: \n", textToCopy)
      })
      .catch((err) => {
        console.error("クリップボードにコピーできませんでした: \n", err)
      })
  }
  sendResponse(textToCopy)

  return true
})

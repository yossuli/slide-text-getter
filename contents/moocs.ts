import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://moocs.iniad.org/*"],
  all_frames: true
}

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  const textToCopy = message.body
  if (message.name === "copyToClipboardFromIframe") {
    if (textToCopy) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          console.log("クリップボードにコピーしました: \n", textToCopy)
        })
        .catch((err) => {
          console.error("クリップボードにコピーできませんでした: \n", err)
        })
    } else {
      alert("クリップボードにコピーする要素が見つかりませんでした")
    }
    sendResponse(textToCopy)
  }
  return true
})

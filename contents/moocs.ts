import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://moocs.iniad.org/*"],
  all_frames: true
}

chrome.runtime.onMessage.addListener((message) => {
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
})

chrome.runtime.onMessage.addListener((message) => {
  if (message.name === "INIT_FROM_BACKGROUND") {
    chrome.storage.sync.get().then((v) => {
      const untilExit = JSON.parse(v.untilExit)
      return untilExit.includes(window.location.href)
    })
  }
})

chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName === "sync" && changes.untilExit) {
    chrome.runtime.sendMessage({
      type: "RE_INIT",
      data: JSON.parse(changes.untilExit.newValue).includes(
        window.location.href
      )
    })
  }
})

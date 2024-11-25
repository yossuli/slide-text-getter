import type { PlasmoCSConfig } from "plasmo"

import { sendToContentScript } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["https://docs.google.com/presentation/d/e/*"],
  all_frames: true
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copy-to-clipboard",
    title: "クリップボードにコピー",
    contexts: ["all"]
  })
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "copy-to-clipboard") {
    await sendToContentScript({
      name: "copyToClipboard"
    })
  }
})

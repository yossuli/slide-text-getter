import type { PlasmoCSConfig } from "plasmo"

import { sendToContentScript } from "@plasmohq/messaging"

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copy-to-clipboard",
    title: "クリップボードにコピー",
    contexts: ["all"]
  })
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "copy-to-clipboard") {
    const res = await sendToContentScript({
      name: "copyToClipboard"
    })
    console.log(res)

    await sendToContentScript({
      name: "copyToEditSpace",
      body: res
    })
  }
})

import { sendToContentScript } from "@plasmohq/messaging"

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.contextMenus.create({
//     id: "copy-to-clipboard",
//     title: "クリップボードにコピー",
//     contexts: ["all"]
//   })
// })

// chrome.contextMenus.onClicked.addListener(async (info, tab) => {
//   if (info.menuItemId === "copy-to-clipboard") {
//     const res = await sendToContentScript({
//       name: "copyToClipboard"
//     })
//     await sendToContentScript({
//       name: "copyToEditSpace",
//       body: res
//     })
//   }
// })

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "COPY_TO_CLIPBOARD") {
    const res = await sendToContentScript({
      name: "COPY_TO_CLIPBOARD_FROM_BACKGROUND",
      body: message.data
    })
  }
})

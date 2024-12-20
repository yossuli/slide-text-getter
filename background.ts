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
  if (message.type === "FROM_IFRAME") {
    console.log("FROM_IFRAME")
    const res = await sendToContentScript({
      name: "copyToClipboardFromIframe",
      body: message.data
    })
  }
})

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "CHANGE_SETTINGS_FROM_POPUP") {
    console.log("storage event")
    await sendToContentScript({
      name: "CHANGE_SETTINGS_FROM_BACKGROUND"
    })
  }
})

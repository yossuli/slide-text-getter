import { sendToContentScript } from "@plasmohq/messaging"

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "COPY_TO_CLIPBOARD") {
    await sendToContentScript({
      name: "COPY_TO_CLIPBOARD_FROM_BACKGROUND",
      body: message.data
    })
  }
})

chrome.runtime.onMessage.addListener(async (message, _, sendResponse) => {
  if (message.type === "INIT") {
    const res = await sendToContentScript({
      name: "INIT_FROM_BACKGROUND"
    })
    sendResponse(res)
  }
})

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "RE_INIT") {
    await sendToContentScript({
      name: "RE_INIT_FROM_BACKGROUND",
      body: message.data
    })
  }
})

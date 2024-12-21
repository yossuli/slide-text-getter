import { sendToContentScript } from "@plasmohq/messaging"

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "COPY_TO_CLIPBOARD") {
    await sendToContentScript({
      name: "COPY_TO_CLIPBOARD_FROM_BACKGROUND",
      body: message.data
    })
  }
})

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "INIT") {
    sendToContentScript({
      name: "INIT_FROM_BACKGROUND",
      body: message.data
    })
  }
})

import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://moocs.iniad.org/*"],
  all_frames: true
}

const url = window.location.href

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

window.addEventListener("load", () => {
  chrome.storage.sync.get().then(async (v) => {
    chrome.runtime.sendMessage({
      type: "INIT",
      data: JSON.parse(v.untilExit ?? "[]")?.includes(url) || v[url] === "true"
    })
  })
})

chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName === "sync") {
    if (changes.untilExit) {
      chrome.runtime.sendMessage({
        type: "INIT",
        data: JSON.parse(changes.untilExit.newValue).includes(url)
      })
    }
    if (changes[url]) {
      chrome.runtime.sendMessage({
        type: "INIT",
        data: changes[url].newValue === "true"
      })
    }
  }
})

window.addEventListener("beforeunload", () => {
  sessionStorage.setItem("isReloading", url)
})

if (sessionStorage.getItem("isReloading") === url) {
} else {
  chrome.storage.sync.get().then((v) => {
    chrome.storage.sync.set({
      untilExit: JSON.stringify(
        JSON.parse(v.untilExit).filter(
          (url) => url !== sessionStorage.getItem("isReloading")
        )
      )
    })
  })
}

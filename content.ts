import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://docs.google.com/presentation/d/e/*"],
  all_frames: true
}

let textToCopy: string | null = null

const saveClickedElement = (event: MouseEvent) => {
  const target = event.target as Element
  const targetParentChildren = Array.from(target.parentElement.children)
  const targetIndex = targetParentChildren.findIndex((e) => e === target)
  const g = targetParentChildren[targetIndex - 1]
  if (g.tagName.toLowerCase() === "g") {
    const gAriaLabel = g.ariaLabel
    if (gAriaLabel) {
      textToCopy = gAriaLabel
    }
  }
}

const addListenersToExistingElements = () => {
  document.querySelectorAll<Element>("path").forEach((element) => {
    element.addEventListener("contextmenu", saveClickedElement)
  })
}

const observeDynamicGElements = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (
            node instanceof Element &&
            node.tagName.toLowerCase() === "path"
          ) {
            node.addEventListener("contextmenu", saveClickedElement)
          } else if (node instanceof Element) {
            node.querySelectorAll("path").forEach((element) => {
              element.addEventListener("contextmenu", saveClickedElement)
            })
          }
        })
      }
    })
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })

  console.log("MutationObserver を開始しました")
}

chrome.runtime.onMessage.addListener((message) => {
  console.log("content.ts: メッセージを受信", message)
  if (message.name === "copyToClipboard") {
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
  }
  return true
})

addListenersToExistingElements()
observeDynamicGElements()

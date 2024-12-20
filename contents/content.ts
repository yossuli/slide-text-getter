import type { PlasmoCSConfig } from "plasmo"

import { generateId } from "~utils/generateId"
import { handleChildList } from "~utils/handleChildList"
import { isTargetElement } from "~utils/isTargetElement"
import { parseStyle } from "~utils/parseStyle"

import { style, styleHover } from "./copyButtonStyle"

export const config: PlasmoCSConfig = {
  matches: ["https://docs.google.com/presentation/d/*"],
  all_frames: true
}

const isInIframe = (() => {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
})()

const isAppear = (node: Element) =>
  node.getAttribute("aria-hidden") !== "true" &&
  parseStyle(node.getAttribute("style") ?? "")["opacity"] !== "0"

const isDisappear = (node: Element) =>
  node.getAttribute("aria-hidden") === "true" ||
  parseStyle(node.getAttribute("style") ?? "")["opacity"] === "0"

const createCopyButton = (node: Element, textToCopy: string) => {
  const rect = node.getBoundingClientRect()
  const id = generateId(node)
  const currentCopyButton = document.getElementById(id)
  if (currentCopyButton) {
    style(currentCopyButton, currentCopyButton.querySelector("button"), rect)
    return
  }

  const deleteButton = document.createElement("button")
  deleteButton.textContent = "×"
  deleteButton.style.backgroundColor = "#0000"
  deleteButton.addEventListener("click", () => {
    copyButton.remove()
  })

  const copyButton = document.createElement("button")
  copyButton.id = id
  copyButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "FROM_IFRAME", data: textToCopy })
  })

  style(copyButton, deleteButton, rect)
  copyButton.addEventListener("mouseenter", () =>
    styleHover(copyButton, deleteButton)
  )
  copyButton.addEventListener("mouseleave", () =>
    style(copyButton, deleteButton, rect)
  )

  document.body.appendChild(copyButton)
  copyButton.appendChild(deleteButton)
}

const observer = new MutationObserver((mutations) => {
  console.log("変更を検知")
  const addedNodes: Element[] = mutations
    .filter((mutation) => mutation.type === "childList")
    .flatMap((mutation) => handleChildList(mutation.addedNodes).flat())

  const addedNodesDisappeared = addedNodes.filter(isDisappear)

  const appearedNodes: Element[] = mutations
    .filter((mutation) => mutation.type === "attributes")
    .map((mutation) => mutation.target)
    .filter((node) => node instanceof Element)

  const appearedParentNodes = appearedNodes.filter(isAppear).flatMap((node) =>
    Array.from(node.querySelectorAll("g"))
      .filter(isTargetElement)
      .filter(isAppear)
      .filter((node) => !addedNodesDisappeared.some((e) => e.contains(node)))
  )

  const deletedNodes = mutations
    .filter((mutation) => mutation.type === "childList")
    .flatMap((mutation) => handleChildList(mutation.removedNodes).flat())

  const deletedTargetNodes = deletedNodes.filter(isTargetElement)

  const disappearedNodes = mutations
    .filter((mutation) => mutation.type === "attributes")
    .map((mutation) => mutation.target)
    .filter((node) => node instanceof Element)

  const disappearedParentNodes = disappearedNodes.flatMap((node) =>
    Array.from(node.querySelectorAll("g"))
  )

  ;[...deletedTargetNodes, ...disappearedParentNodes].forEach((node) => {
    const id = generateId(node)
    const deleteButton = document.getElementById(id)
    if (deleteButton) {
      deleteButton.remove()
    }
  })

  appearedParentNodes.forEach((node) => {
    const textToCopy = node.getAttribute("aria-label")
    createCopyButton(node, textToCopy)
  })
})

const content = (untilExit: boolean) => {
  if (!untilExit) {
    if (isInIframe) {
      const addListenersToExistingElements = () => {
        document.querySelectorAll<Element>("g").forEach((node) => {
          if (node instanceof Element && isTargetElement(node)) {
            if (isDisappear(node)) return
            const textToCopy = node.getAttribute("aria-label")
            createCopyButton(node, textToCopy)
          }
        })
      }

      const observeDynamicGElements = () => {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true
        })
      }

      addListenersToExistingElements()
      observeDynamicGElements()

      window.addEventListener("resize", addListenersToExistingElements)
    }
  } else {
    // windowを閉じるときにuntilExitをtrueにする
    window.addEventListener("beforeunload", () => {
      chrome.storage.sync.set({ untilExit: true })
    })
    observer.disconnect()
    console.log("observerを停止")
  }
}
chrome.storage.sync.get("untilExit").then((v) => {
  console.log(v)
  content(v.untilExit)
})

chrome.runtime.onMessage.addListener((message) => {
  if (message.name === "CHANGE_SETTINGS_FROM_BACKGROUND") {
    chrome.storage.sync.get("untilExit").then((v) => {
      console.log("storage event")
      console.log(v)
      content(v.untilExit === "true")
    })
  }
})

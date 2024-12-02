import type { PlasmoCSConfig } from "plasmo"

import { handleChildList } from "~utils/handleChildList"
import { isTargetElement } from "~utils/isTargetElement"

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

if (isInIframe) {
  const createCopyButton = (node: Element, textToCopy: string) => {
    const { left, top, width, height } = node.getBoundingClientRect()
    const id = node.getAttribute("aria-label")
    if (document.getElementById(id)) return

    const deleteButton = document.createElement("button")
    deleteButton.textContent = "delete"
    deleteButton.style.backgroundColor = "#0000"
    deleteButton.addEventListener("click", () => {
      copyButton.remove()
    })

    const copyButton = document.createElement("button")
    copyButton.id = id
    copyButton.addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "FROM_IFRAME", data: textToCopy })
    })

    const style = () => {
      copyButton.style.position = "absolute"
      copyButton.style.top = `${top}px`
      copyButton.style.left = `${left}px`
      copyButton.style.width = `${width}px`
      copyButton.style.height = `${height}px`
      copyButton.style.zIndex = "10000"
      copyButton.style.background = "#0002"
      copyButton.style.border = "solid 1px #f00"
      copyButton.style.display = "flex"
      copyButton.style.padding = "0"
      deleteButton.style.display = "none"
    }
    const styleHover = () => {
      copyButton.style.background = "#0004"
      copyButton.style.border = "solid 1px #0f0"
      deleteButton.style.display = "block"
    }
    style()
    copyButton.addEventListener("mouseenter", styleHover)
    copyButton.addEventListener("mouseleave", style)

    document.body.appendChild(copyButton)
    copyButton.appendChild(deleteButton)
  }

  const addListenersToExistingElements = () => {
    document.querySelectorAll<Element>("g").forEach((node) => {
      if (node instanceof Element && isTargetElement(node)) {
        if (node.getAttribute("aria-hidden") === "true") return
        const textToCopy = node.getAttribute("aria-label")
        createCopyButton(node, textToCopy)
      }
    })
  }

  const observeDynamicGElements = () => {
    const observer = new MutationObserver((mutations) => {
      const addedNodes: Element[] = mutations
        .filter((mutation) => mutation.type === "childList")
        .flatMap((mutation) =>
          handleChildList(mutation.addedNodes)
            .flat()
            .filter(isTargetElement)
            .filter((node) => node.getAttribute("aria-hidden") !== "true")
        )

      const appearedNodes: Element[] = mutations
        .filter((mutation) => mutation.type === "attributes")
        .map((mutation) => mutation.target)
        .filter((node) => node instanceof Element)
        .filter(isTargetElement)
        .filter((node) => node.getAttribute("aria-hidden") !== "true")

      const deletedNodes = mutations
        .filter((mutation) => mutation.type === "childList")
        .flatMap((mutation) =>
          handleChildList(mutation.removedNodes).flat().filter(isTargetElement)
        )
      const disappearedNodes = mutations
        .filter((mutation) => mutation.type === "attributes")
        .filter((node) => node instanceof Element)
        .filter(isTargetElement)
        .filter((node) => node.getAttribute("aria-hidden") === "true")

      const addTargetNodes = [...addedNodes, ...appearedNodes]
      addTargetNodes.forEach((node) => {
        const textToCopy = node.getAttribute("aria-label")
        createCopyButton(node, textToCopy)
      })

      const deleteTargetNodes = [...deletedNodes, ...disappearedNodes]
      deleteTargetNodes.forEach((node) => {
        const id = node.getAttribute("aria-label")
        const deleteButton = document.getElementById(id)
        if (deleteButton) {
          deleteButton.remove()
        }
      })
    })

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

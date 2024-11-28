import type { PlasmoCSConfig } from "plasmo"

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

    const deleteButton = document.createElement("button")
    deleteButton.textContent = "delete"
    deleteButton.style.backgroundColor = "#0000"
    deleteButton.addEventListener("click", () => {
      copyButton.remove()
    })

    const copyButton = document.createElement("button")
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
    Array.from(document.body.children).forEach((node) => {
      if (node instanceof Element) {
        if (node.tagName.toLowerCase() === "button") {
          node.remove()
        }
      }
    })
    document.querySelectorAll<Element>("g").forEach((node) => {
      if (node instanceof Element && node.tagName.toLowerCase() === "g") {
        if (node.getAttribute("aria-label") === null) return
        if (node.getAttribute("aria-label") === "") return
        const textToCopy = node.getAttribute("aria-label")
        createCopyButton(node, textToCopy)
      }
    })
  }

  const observeDynamicGElements = () => {
    const observer = new MutationObserver((mutations) => {
      const targetNodes: Element[] = mutations
        .filter((mutation) => mutation.type === "childList")
        .flatMap((mutation) =>
          Array.from(mutation.addedNodes)
            .filter((node) => node instanceof Element)
            .map((node) =>
              node.tagName.toLowerCase() === "g"
                ? node
                : Array.from(node.querySelectorAll("g"))
            )
            .flat()
            .filter(
              (node) =>
                node instanceof Element &&
                node.getAttribute("aria-label") !== null
            )
        )
      if (targetNodes.length === 0) return
      Array.from(document.body.children).forEach((node) => {
        if (node instanceof Element) {
          if (node.tagName.toLowerCase() === "button") {
            node.remove()
          }
        }
      })
      targetNodes.forEach((node) => {
        const textToCopy = node.getAttribute("aria-label")
        createCopyButton(node, textToCopy)
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  addListenersToExistingElements()
  observeDynamicGElements()

  window.addEventListener("resize", addListenersToExistingElements)
}

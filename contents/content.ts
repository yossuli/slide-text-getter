import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://docs.google.com/presentation/d/*"],
  all_frames: true
}




const createCopyButton = (node: Element, textToCopy: string) => {
  const { left, top, width, height } = node.getBoundingClientRect()
  const button = document.createElement("button")
  button.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "FROM_IFRAME", data: textToCopy })
  })
  button.style.position = "absolute"
  button.style.top = `${top}px`
  button.style.left = `${left}px`
  button.style.width = `${width}px`
  button.style.height = `${height}px`
  button.style.zIndex = "10000"
  const style = () => {
    button.style.background = "#0002"
    button.style.border = "solid 1px #f00"
  }
  const styleHover = () => {
    button.style.background = "#0004"
  }
  style()
  button.addEventListener("mouseenter", styleHover)
  button.addEventListener("mouseleave", style)
  document.body.appendChild(button)
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

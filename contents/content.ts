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
      if (node instanceof Element && node.tagName.toLowerCase() === "g") {
        if (node.getAttribute("aria-label") === null) return
        if (node.getAttribute("aria-label") === "") return
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
                node.getAttribute("aria-label") !== null &&
                node.getAttribute("aria-label") !== "" &&
                node.getAttribute("aria-hidden") !== "true"
            )
        )
      const appearedNodes: Element[] = mutations
        .filter((mutation) => mutation.type === "attributes")
        .filter(
          (mutation) =>
            mutation.target instanceof Element &&
            mutation.target.tagName.toLowerCase() === "g" &&
            mutation.target.getAttribute("aria-label") !== null &&
            mutation.target.getAttribute("aria-label") !== "" &&
            mutation.target.getAttribute("aria-hidden") !== "true"
        )
        .map((mutation) => mutation.target as Element)
      const deletedNodes = mutations
        .filter((mutation) => mutation.type === "childList")
        .flatMap((mutation) =>
          Array.from(mutation.removedNodes)
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
                node.getAttribute("aria-label") !== null &&
                node.getAttribute("aria-label") !== ""
            )
        )
      const disappearedNodes = mutations
        .filter((mutation) => mutation.type === "attributes")
        .filter(
          (mutation) =>
            mutation.target instanceof Element &&
            mutation.target.tagName.toLowerCase() === "g" &&
            mutation.target.getAttribute("aria-label") !== null &&
            mutation.target.getAttribute("aria-label") !== "" &&
            mutation.target.getAttribute("aria-hidden") === "true"
        )
        .map((mutation) => mutation.target as Element)
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

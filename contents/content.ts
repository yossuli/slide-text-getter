import type { PlasmoCSConfig } from "plasmo"

import { handleChildList } from "~utils/handleChildList"
import { inspect } from "~utils/inspect"
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

if (isInIframe) {
  const createCopyButton = (node: Element, textToCopy: string) => {
    const rect = node.getBoundingClientRect()
    const id = node.getAttribute("aria-label")
    const currentCopyButton = document.getElementById(id)
    if (currentCopyButton) {
      style(currentCopyButton, currentCopyButton.querySelector("button"), rect)
      return
    }

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
    const observer = new MutationObserver((mutations) => {
      const addedNodes: Element[] = mutations
        .filter((mutation) => mutation.type === "childList")
        .flatMap((mutation) => handleChildList(mutation.addedNodes).flat())

      const addedNodesDisappeared = addedNodes.filter(isDisappear)
      const addedTargetNodes: Element[] = addedNodes
        .filter(isTargetElement)
        .filter(isAppear)
        .filter((node) => !addedNodesDisappeared.some((n) => n.contains(node)))

      const appearedNodes: Element[] = mutations
        .filter((mutation) => mutation.type === "attributes")
        .map((mutation) => mutation.target)
        .filter((node) => node instanceof Element)

      const findAppearedTargetNodes = (node: Element[]) =>
        node.filter(isTargetElement).filter(isAppear)

      const appearedTargetNodes: Element[] = appearedNodes.flatMap((node) => [
        ...findAppearedTargetNodes([node]),
        ...findAppearedTargetNodes(
          Array.from(node.querySelectorAll("g"))
        ).filter((node) => !addedNodesDisappeared.some((n) => n.contains(node)))
      ])

      const deletedNodes = mutations
        .filter((mutation) => mutation.type === "childList")
        .flatMap((mutation) => handleChildList(mutation.removedNodes).flat())

      const deletedTargetNodes = deletedNodes.filter(isTargetElement)

      const deletedParentNodes = deletedNodes.filter((node) =>
        Array.from(node.querySelectorAll("g"))
          .map((elm) => elm.getAttribute("aria-label"))
          .some(Boolean)
      )

      const disappearedNodes = mutations
        .filter((mutation) => mutation.type === "attributes")
        .map((mutation) => mutation.target)
        .filter((node) => node instanceof Element)

      const findDisappearedTargetNodes = (node: Element[]) =>
        node.filter(isTargetElement).filter(isDisappear)
      const disappearedTargetNodes = disappearedNodes.flatMap((node) => [
        ...findDisappearedTargetNodes([node]),
        ...findDisappearedTargetNodes(
          Array.from(node.querySelectorAll("g"))
        ).filter((node) => addedNodesDisappeared.some((n) => n.contains(node)))
      ])

      const deleteTargetNodes = [
        ...deletedTargetNodes,
        ...deletedParentNodes,
        ...disappearedTargetNodes
      ]
      deleteTargetNodes.forEach((node) => {
        const id = node.getAttribute("aria-label")
        const deleteButton = document.getElementById(id)
        if (deleteButton) {
          deleteButton.remove()
        }
      })

      const addTargetNodes = [...addedTargetNodes, ...appearedTargetNodes]
      addTargetNodes.forEach((node) => {
        const textToCopy = node.getAttribute("aria-label")
        createCopyButton(node, textToCopy)
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

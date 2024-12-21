import { style, styleHover } from "./copyButtonStyle"
import { generateId } from "./generateId"

export const createCopyButton = (node: Element) => {
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
    chrome.runtime.sendMessage({
      type: "COPY_TO_CLIPBOARD",
      data: node.getAttribute("aria-label")
    })
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

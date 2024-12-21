import { createCopyButton } from "./createCopyButton"
import { generateId } from "./generateId"
import { handleChildList } from "./handleChildList"
import { isAppear, isDisappear } from "./isAppear"
import { isTargetElement } from "./isTargetElement"

export const handleCopyButtons = (mutations: MutationRecord[]) => {
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
    createCopyButton(node)
  })
}

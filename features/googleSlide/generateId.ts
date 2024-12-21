export const generateId = (node: Element) =>
  `${node.getAttribute("aria-label")}-${node.getAttribute("id")}`

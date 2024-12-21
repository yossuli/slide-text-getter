import { parseStyle } from "./parseStyle"

export const isAppear = (node: Element) =>
  node.getAttribute("aria-hidden") !== "true" &&
  parseStyle(node.getAttribute("style") ?? "")["opacity"] !== "0"

export const isDisappear = (node: Element) => !isAppear(node)

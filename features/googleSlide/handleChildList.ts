export const handleChildList = (nodeList: NodeList) =>
  Array.from(nodeList)
    .filter((node) => node instanceof Element)
    .map((node) =>
      node.tagName.toLowerCase() === "g"
        ? node
        : Array.from(node.querySelectorAll("g"))
    )

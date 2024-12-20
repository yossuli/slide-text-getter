export const style = (
  copyButton: HTMLElement,
  deleteButton: HTMLElement,
  {
    left,
    top,
    width,
    height
  }: Pick<DOMRect, "left" | "top" | "width" | "height">
) => {
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
  deleteButton.style.margin = "0.25rem"
  deleteButton.style.marginRight = "1rem"
  deleteButton.style.borderRadius = "50%"
  deleteButton.style.aspectRatio = "1"
  deleteButton.style.backgroundColor = "#000"
  deleteButton.style.border = "none"
  deleteButton.style.color = "#fff"
  deleteButton.style.cursor = "pointer"
}

export const styleHover = (
  copyButton: HTMLElement,
  deleteButton: HTMLElement
) => {
  copyButton.style.background = "#0004"
  copyButton.style.border = "solid 1px #0f0"
  copyButton.style.minWidth = "fit-content"
  copyButton.style.minHeight = "fit-content"
  deleteButton.style.display = "block"
}

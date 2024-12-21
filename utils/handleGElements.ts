import { isDisappear } from "~features/googleSlide/isAppear"
import { isTargetElement } from "~features/googleSlide/isTargetElement"

export const handleGElements = (cfn: (node: Element) => void) => {
  document.querySelectorAll<Element>("g").forEach((node) => {
    if (node instanceof Element && isTargetElement(node)) {
      if (isDisappear(node)) return
      cfn(node)
    }
  })
}

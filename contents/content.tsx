import type { PlasmoCSConfig, PlasmoGetOverlayAnchor } from "plasmo"
import React, { useEffect, useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://docs.google.com/presentation/d/*"],
  all_frames: true
}

export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () =>
  document.getElementsByTagName("body")[0]

const EditPopup = () => {
  const [textToEdit, setTextToEdit] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  // メッセージを受け取って表示
  useEffect(() => {
    const messageListener = (message) => {
      if (message.name === "copyToEditSpace") {
        setTextToEdit(message.body)
      }
    }
    chrome.runtime.onMessage.addListener(messageListener)
    return () => chrome.runtime.onMessage.removeListener(messageListener)
  }, [])

  useEffect(() => {
    const keydownListener = (e) => {
      if (e.key === "Escape") {
        setIsVisible(false)
      }
    }
    document.addEventListener("keydown", keydownListener)
    return () => document.removeEventListener("keydown", keydownListener)
  })

  return isVisible ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: "50%",
        left: "50%",
        width: "80%",
        height: "80%",
        transform: "translate(-50%, -50%)",
        background: "white",
        border: "1px solid black",
        padding: "1rem",
        zIndex: 10000
      }}>
      <textarea
        onChange={(e) => setTextToEdit(e.target.value)}
        style={{
          width: "100%",
          height: "100%",
          marginBottom: "1rem"
        }}>
        {textToEdit}
      </textarea>
      <div>
        <button onClick={() => setIsVisible(false)}>閉じる（esc）</button>
      </div>
    </div>
  ) : (
    <button
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 10000
      }}
      onClick={() => setIsVisible(true)}>
      edit
    </button>
  )
}

export default EditPopup

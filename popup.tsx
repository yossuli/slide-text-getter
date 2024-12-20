import React, { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

const SlideButton = ({
  checked,
  htmlFor,
  colors: [color1, color2]
}: {
  checked: boolean
  htmlFor: string
  colors: [string, string]
}) => {
  return (
    <label htmlFor={htmlFor} style={{ cursor: "pointer", marginLeft: "auto" }}>
      <div
        style={{
          width: "48px",
          height: "6px",
          background: checked ? color1 : color2,
          borderRadius: "3px",
          transition: "background 0.3s",
          display: "flex",
          alignItems: "center"
        }}>
        <div
          style={{
            width: "18px",
            height: "18px",
            background: checked ? color1 : color2,
            borderRadius: "50%",
            marginLeft: checked ? "20px" : "4px",
            transition: "margin-left 0.3s"
          }}></div>
      </div>
    </label>
  )
}

const IndexPopup = () => {
  const [currentUrl, setCurrentUrl] = useState("")
  const [isEnabled, setIsEnabled] = useStorage(currentUrl, false)
  const [isEnableUntilExit, setIsEnableUntilExit] = useStorage(
    "untilExit",
    false
  )

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url) {
        setCurrentUrl(tabs[0].url)
      }
    })
  }, [])

  const sendMessage = () => {
    chrome.runtime.sendMessage({ type: "CHANGE_SETTINGS_FROM_POPUP" })
  }

  const handleEnabled = () => {
    setIsEnabled(!isEnabled)
    console.log("change isEnabled")
    sendMessage()
  }
  const handleEnableUntilExit = () => {
    setIsEnableUntilExit(!isEnableUntilExit)
    console.log("change isEnableUntilExit")
    sendMessage()
  }

  return (
    <div
      style={{
        padding: 16,
        width: "300px",
        fontFamily: "Arial, sans-serif"
      }}>
      <h1>Slide text getter</h1>
      <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
        <h3>このページでは拡張機能を無効化する</h3>
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={handleEnabled}
          style={{ display: "none" }}
          id="disable"
        />
        <SlideButton
          checked={isEnabled}
          htmlFor="disable"
          colors={["#ccc", "#3f51b5"]}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
        <h3>このページを離れるまで拡張機能を無効化する</h3>
        <input
          type="checkbox"
          checked={isEnableUntilExit}
          onChange={handleEnableUntilExit}
          style={{ display: "none" }}
          id="until_leave"
        />
        <SlideButton
          checked={isEnableUntilExit}
          htmlFor="until_leave"
          colors={["#ccc", "#3f51b5"]}
        />
      </div>
    </div>
  )
}

export default IndexPopup

import React, { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { ToggleSlideButton } from "~component/ToggleSlideButton"

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
        <ToggleSlideButton
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
        <ToggleSlideButton
          checked={isEnableUntilExit}
          htmlFor="until_leave"
          colors={["#ccc", "#3f51b5"]}
        />
      </div>
    </div>
  )
}

export default IndexPopup

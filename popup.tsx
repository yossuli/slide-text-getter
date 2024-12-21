import React, { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { ToggleSlideButton } from "~component/ToggleSlideButton"

const IndexPopup = () => {
  const [currentUrl, setCurrentUrl] = useState("")
  const [isEnabled, setIsEnabled] = useStorage(currentUrl, false)
  const [isEnableUntilExit, setIsEnableUntilExit] = useStorage(
    "untilExit",
    null
  )

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url) {
        setCurrentUrl(tabs[0].url)
      }
    })
  }, [])

  const handleEnabled = async () => {
    setIsEnabled(!isEnabled)
  }
  const handleEnableUntilExit = async () => {
    setIsEnableUntilExit(isEnableUntilExit === currentUrl ? null : currentUrl)
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
          checked={isEnableUntilExit === currentUrl}
          onChange={handleEnableUntilExit}
          style={{ display: "none" }}
          id="until_leave"
        />
        <ToggleSlideButton
          checked={isEnableUntilExit === currentUrl}
          htmlFor="until_leave"
          colors={["#ccc", "#3f51b5"]}
        />
      </div>
    </div>
  )
}

export default IndexPopup

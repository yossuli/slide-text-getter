import React, { useEffect, useMemo, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { ToggleSlideButton } from "~component/ToggleSlideButton"

const IndexPopup = () => {
  const [currentUrl, setCurrentUrl] = useState("")
  const [enabledUrls, setEnabledUrls] = useStorage("disableUrls", [])
  const [enableUntilExitUrls, setEnableUntilExitUrls] = useStorage(
    "disableUntilExitUrls",
    []
  )

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url) {
        setCurrentUrl(tabs[0].url)
      }
    })
  }, [chrome.tabs])

  const isEnabled = useMemo(() => {
    return (
      enabledUrls?.findIndex((url: string) => currentUrl.startsWith(url)) !== -1
    )
  }, [enabledUrls, currentUrl])

  const isEnableUntilExit = useMemo(
    () => enableUntilExitUrls?.includes(currentUrl),
    [enableUntilExitUrls, currentUrl]
  )

  const handleEnabled = async () => {
    if (isEnabled) {
      setEnabledUrls(enabledUrls.filter((url) => url !== currentUrl))
    } else {
      setEnabledUrls([...enabledUrls, currentUrl])
    }
  }
  const handleEnableUntilExit = async () => {
    if (isEnableUntilExit) {
      setEnableUntilExitUrls(
        enableUntilExitUrls.filter((url) => url !== currentUrl)
      )
    } else {
      setEnableUntilExitUrls([...enableUntilExitUrls, currentUrl])
    }
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
        <h3>このページを離れるまで拡張機能を無効化する（不安定）</h3>
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
      <a
        href="options.html"
        onClick={(e) => {
          e.preventDefault()
          chrome.tabs.create({ url: "options.html" })
        }}>
        option page
      </a>
    </div>
  )
}

export default IndexPopup

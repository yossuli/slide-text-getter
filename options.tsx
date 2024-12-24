import { useEffect, useRef, useState } from "react"

import { Url } from "~features/options/Url"
import { useStorage } from "~node_modules/@plasmohq/storage/dist/hook"

import styles from "./options.module.css"

const OptionIndex = () => {
  const [enableUrls, setEnableUrls] = useStorage("disableUrls", [])
  const [addDisableUrl, setAddDisableUrl] = useState("")
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLElement>()
  useEffect(() => {
    const span = ref.current
    if (span === undefined) return
    setWidth(span.getClientRects()[0]?.width)
  })

  console.log(ref.current)
  return (
    <div className={styles.container}>
      <h1>Slide Text Getter</h1>
      <p>
        ここは
        <a
          href="https://moocs.iniad.org"
          onClick={(e) => {
            e.preventDefault()
            chrome.tabs.create({
              url: "https://moocs.iniad.org"
            })
          }}>
          moocs
        </a>
        用の拡張機能「Slide Text Getter」の設定画面です
      </p>
      <h2>無効化するurlを追加</h2>
      <input
        type="text"
        value={`https://moocs.iniad.org/${addDisableUrl}`}
        style={{ width: `${width}px` }}
        onChange={(e) => {
          if (
            e.target.value.length <
            `https://moocs.iniad.org/${addDisableUrl}`.length
          ) {
            setAddDisableUrl(addDisableUrl.slice(0, -1))
            return
          }
          const input = e.target.value
            .split("")
            .find((c, i) => c !== `https://moocs.iniad.org/${addDisableUrl}`[i])

          setAddDisableUrl(`${addDisableUrl}${input}`)
        }}
      />
      <span
        ref={ref}
        style={{
          position: "absolute",
          color: "#0000",
          fontSize: "1.25rem",
          marginLeft: "0.75rem",
          width: "fit-content",
          fontFamily: "inherit",
          zIndex: -1
        }}>{`https://moocs.iniad.org/${addDisableUrl}`}</span>
      <button
        key={addDisableUrl}
        onClick={() => {
          setEnableUrls(Array.from(new Set([...enableUrls, addDisableUrl])))
          setAddDisableUrl("")
        }}>
        Add
      </button>
      <h2>無効化リスト</h2>
      <p>
        個別に拡張機能を無効化したmoocsページの、無効化の解除及び無効化範囲の修正を行えます
      </p>
      <p>指定されているurlから始まるページで拡張機能が無効化されます</p>
      <ul>
        {enableUrls.map((url: string, i) => (
          <li key={i}>
            <Url
              url={url}
              editUrl={(index: number) => {
                setEnableUrls(
                  enableUrls.map((url, j) =>
                    j === i
                      ? `https://moocs.iniad.org/${url.split("/").slice(0, index)}`
                      : url
                  )
                )
              }}
              deleteUrl={() =>
                setEnableUrls(enableUrls.filter((u) => u !== url))
              }
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
export default OptionIndex

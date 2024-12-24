import { useState } from "react"

import styles from "../../options.module.css"

export const Url = ({ url, editUrl, deleteUrl }) => {
  const [isEdit, setIsEdit] = useState(false)
  return (
    <>
      <h3>
        <a
          href={url}
          onClick={(e) => {
            e.preventDefault()
            chrome.tabs.create({ url })
          }}>
          https://moocs.iniad.org
          {url
            .replace("https://moocs.iniad.org/", "")
            .split("/")
            .map((path, i) => (
              <div key={i}>
                /{path}
                {isEdit && (
                  <div
                    className={styles.editButton}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      editUrl(i)
                      setIsEdit(false)
                    }}
                  />
                )}
              </div>
            ))}
        </a>
      </h3>
      <button
        onClick={() => {
          setIsEdit(!isEdit)
        }}>
        {["Edit", "exit"][+isEdit]}
      </button>
      <span style={{ display: "inline-block", width: "1.5rem" }}></span>

      <button
        onClick={() => {
          deleteUrl()
        }}>
        Delete
      </button>
    </>
  )
}

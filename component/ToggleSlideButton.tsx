export const ToggleSlideButton = ({
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

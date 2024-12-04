export const parseStyle = (cssText: string) =>
  cssText.split(";").reduce(
    (acc, cur) => {
      const [key, value] = cur.split(":")
      if (key && value) acc[key.trim()] = value.trim()
      return acc
    },
    {} as { [key: string]: string }
  )

import React from "react"

interface TreeNode {
  name: string
  isAble: boolean
  children: TreeNode[]
}

interface TreeProps {
  data: { url: string; isAble: boolean }[]
}

const buildTree = (data: { url: string; isAble: boolean }[]): TreeNode => {
  const root: TreeNode = { name: "", isAble: true, children: [] }

  data.forEach((item) => {
    const parts = item.url.split("/").filter(Boolean)
    let current = root

    parts.forEach((part, index) => {
      let node = current.children.find((child) => child.name === part)
      if (!node) {
        node = { name: part, isAble: item.isAble, children: [] }
        current.children.push(node)
      }
      current = node
    })
  })

  return root
}

const buildTree2 = (data: { url: string; isAble: boolean }[]): TreeNode => {
  const splittedUrls = data.map(({ url, isAble }) =>
    url.split("/").map((path) => ({ path, isAble }))
  )
  const node = splittedUrls.reduce((root, paths, i) => {
    return paths.reduce((current, { path, isAble }, j) => {
      
    })
  })
}

const TreeNodeComponent: React.FC<{ node: TreeNode; depth: number }> = ({
  node,
  depth
}) => {
  return (
    <div style={{ marginLeft: depth * 20 }}>
      {node.name && (
        <div>
          {node.isAble ? "+ " : "- "}
          {node.name}
        </div>
      )}
      {node.children.map((child) => (
        <TreeNodeComponent key={child.name} node={child} depth={depth + 1} />
      ))}
    </div>
  )
}

const Tree: React.FC<TreeProps> = ({ data }) => {
  const tree = buildTree(data)
  return <TreeNodeComponent node={tree} depth={0} />
}

export default Tree

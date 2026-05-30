{
  const elNodeType = Node.ELEMENT_NODE
  const urlRegEx = /\bhttps?:\/\/[^\s"\)\]\>]*/ig
  const selection = window.getSelection()
  const results = []

  if (!selection || selection.type !== 'Range')
    throw new Error('[ffx-plus] No selection')

  let prevLink = ''
  const partial = true

  const ancestor = selection.getRangeAt(0)
    .commonAncestorContainer
  const elNode = ancestor.nodeType === elNodeType
    ? ancestor : ancestor.parentElement

  if (elNode) collectSelectedLinks(elNode)

  if (results.length === 0) {
    for (let r = 0; r < selection.rangeCount; r++) {
      const rangetext = selection
        .getRangeAt(r).toString().trim()
      const urls = rangetext.match(urlRegEx)
      if (urls) urls
        .forEach(function(url) {
          results.push(url)})}
  }

  function collectSelectedLinks(root) {
    const rootLink = root.matches('a') ? root : null
    const nested = Array.from(root.getElementsByTagName('a'))
    const links = [rootLink, ...nested]
      .filter(Boolean)

    for (const link of links) {
      if (!selection.containsNode(link, partial)) continue;
      if (link.href === prevLink) continue;
      results.push(link.href)
      prevLink = link.href}
  }

  results
}

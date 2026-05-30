browser.runtime.onInstalled.addListener(initialize)
browser.commands.onCommand.addListener(commandListener)
browser.contextMenus.onClicked.addListener(menuListener)

const openSelectedCommand = 'open-selected'
const openSelectedMenu = 'openselected'

function initialize() {
  browser.contextMenus.create({
    id: openSelectedMenu,
    title: 'Open selected',
    contexts: ['selection']})
}

function menuListener(info, tab) {
  switch (info.menuItemId) {
    case openSelectedMenu:
      return openSelected(tab)
    default:
      console.error(`invalid menuItemId ${info.menuItemId}`)}
}

function commandListener(command, tab) {
  switch (command) {
    case openSelectedCommand:
      return openSelected(tab)
    default:
      console.error(`invalid command ${command}`)}
}

function openSelected(tab) {
  if (!tab) return;
  return browser.scripting.executeScript({
    target: {tabId: tab.id, allFrames: true},
    files: ['/content.js']})
    .then(function(results) {
      const urls = flattenUrls(results)
      return Promise.all(urls.map(function(url) {
        return browser.tabs.create(makeTabinfo(tab, url))}))})
    .catch(function(error) {
      throw new Error(`[ffx-plus] ${error}`)})
}

function flattenUrls(results) {
  const urls = []
  for (const frame of results) {
    if (!frame.result) continue
    for (const url of frame.result) urls.push(url)}
  return urls
}

function makeTabinfo(tab, url) {
  const info = {}
  if (tab) {
    info.windowId = tab.windowId
    info.openerTabId = tab.id
    info.cookieStoreId = tab.cookieStoreId
    info.active = false}
  if (url) info.url = url
  return info
}

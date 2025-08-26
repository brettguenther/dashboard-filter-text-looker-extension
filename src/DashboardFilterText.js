import React, { useEffect, useState, useContext } from 'react'
import { Button, ComponentsProvider } from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'
import { ConfigPanel } from './ConfigPanel'
import { DisplayView } from './DisplayView'
import { processTemplate } from './utils'

export const DashboardFilterText = () => {
  const { tileHostData, extensionSDK } = useContext(ExtensionContext40)
  const [backgroundColor, setBackgroundColor] = useState('#111FF4')
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [draftBackgroundColor, setDraftBackgroundColor] = useState(backgroundColor)
  const [draftTextColor, setDraftTextColor] = useState(textColor)
  const [linkUrl, setLinkUrl] = useState('')
  const [draftLinkUrl, setDraftLinkUrl] = useState(linkUrl)
  const defaultTemplate = 'Planning for {MyFilter.name} Value: {MyFilter.value}'
  const [textTemplate, setTextTemplate] = useState(defaultTemplate)
  const [draftTextTemplate, setDraftTextTemplate] = useState(textTemplate)
  const [displayMode, setDisplayMode] = useState('view')
  const [draftDisplayMode, setDraftDisplayMode] = useState(displayMode)

  const { isDashboardEditing, elementId, dashboardId } = tileHostData

  const contextKey = `${elementId}-${dashboardId}`

  useEffect(() => {
    // empty space for title removal
    if (extensionSDK) {
      extensionSDK.updateTitle(" ");
    }
  },[extensionSDK])

  useEffect(() => {
    const init = async () => {
      const context = await extensionSDK.getContextData()
      const savedData = context?.[contextKey]
      if (savedData) {
        if (savedData.backgroundColor) {
          setBackgroundColor(savedData.backgroundColor)
          setDraftBackgroundColor(savedData.backgroundColor)
        }
        if (savedData.textColor) {
          setTextColor(savedData.textColor)
          setDraftTextColor(savedData.textColor)
        }
        if (savedData.linkUrl) {
          setLinkUrl(savedData.linkUrl)
          setDraftLinkUrl(savedData.linkUrl)
        } else {
          setLinkUrl('')
          setDraftLinkUrl('')
        }
        if (savedData.textTemplate) {
          setTextTemplate(savedData.textTemplate)
          setDraftTextTemplate(savedData.textTemplate)
        } else {
          setTextTemplate(defaultTemplate)
          setDraftTextTemplate(defaultTemplate)
        }
        if (savedData.displayMode) {
          setDisplayMode(savedData.displayMode)
          setDraftDisplayMode(savedData.displayMode)
        }
      }
    }
    if (elementId) {
      init()
    }
  }, [elementId, extensionSDK, contextKey, defaultTemplate])

  const handleSave = async () => {
    // First, save the draft values to the extension context.
    const context = (await extensionSDK.refreshContextData()) || {}
    const newValues = {
      backgroundColor: draftBackgroundColor,
      textColor: draftTextColor,
      linkUrl: draftLinkUrl,
      textTemplate: draftTextTemplate,
      displayMode: draftDisplayMode,
    }
    const newContext = {
      ...context,
      [contextKey]: newValues,
    }
    await extensionSDK.saveContextData(newContext)
    setBackgroundColor(newValues.backgroundColor)
    setTextColor(newValues.textColor)
    setLinkUrl(newValues.linkUrl)
    setTextTemplate(newValues.textTemplate)
    setDisplayMode(newValues.displayMode)
  }

  const dashboardFilters = tileHostData?.dashboardFilters || {}
  const displayText = processTemplate(textTemplate, dashboardFilters)
  const processedLinkUrl = processTemplate(linkUrl, dashboardFilters, true)
  const previewDisplayText = processTemplate(draftTextTemplate, dashboardFilters)
  const previewProcessedLinkUrl = processTemplate(
    draftLinkUrl,
    dashboardFilters,
    true
  )

  const shouldRender = () => {
    if (isDashboardEditing) {
      return false
    }
    const placeholderRegex = /{([^{}]+?)\.(name|value)}/g
    const hasPlaceholders = placeholderRegex.test(textTemplate)
    if (!hasPlaceholders) {
      return true // Static text, always render
    }
    // Has placeholders, so check if any referenced filters exist on dashboard
    const filterNamesFromTemplate = [
      ...new Set(
        [...textTemplate.matchAll(placeholderRegex)].map((match) =>
          match[1].trim()
        )
      ),
    ]
    const dashboardFilterKeys = Object.keys(dashboardFilters)
    return filterNamesFromTemplate.some((name) =>
      dashboardFilterKeys.includes(name)
    )
  }

  return (
    <ComponentsProvider>
      {isDashboardEditing ? (
        <ConfigPanel
          draftLinkUrl={draftLinkUrl}
          setDraftLinkUrl={setDraftLinkUrl}
          draftTextTemplate={draftTextTemplate}
          setDraftTextTemplate={setDraftTextTemplate}
          draftBackgroundColor={draftBackgroundColor}
          setDraftBackgroundColor={setDraftBackgroundColor}
          draftTextColor={draftTextColor}
          setDraftTextColor={setDraftTextColor}
          previewProcessedLinkUrl={previewProcessedLinkUrl}
          previewDisplayText={previewDisplayText}
          onSave={handleSave}
          draftDisplayMode={draftDisplayMode}
          setDraftDisplayMode={setDraftDisplayMode}
          extensionSDK={extensionSDK}
        />
      ) : shouldRender() ? (
        displayMode === 'view' ? (
          <DisplayView
            backgroundColor={backgroundColor}
            textColor={textColor}
            linkUrl={linkUrl}
            processedLinkUrl={processedLinkUrl}
            displayText={displayText}
            extensionSDK={extensionSDK}
          />
        ) : (
          <Button onClick={() => extensionSDK.openBrowserWindow(processedLinkUrl, '_blank')}>{displayText}</Button>
        )
      ) : null}
    </ComponentsProvider>
  )
}
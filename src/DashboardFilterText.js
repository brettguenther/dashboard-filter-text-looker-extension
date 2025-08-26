import React, { useEffect, useState, useContext } from 'react'
import {
  Box,
  ComponentsProvider,
  Span,
  Button,
  Link,
  FieldTextArea,
  FieldColor,
  Heading,
} from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'

const processTemplate = (template, filters, urlEncode = false) => {
  if (!template || !filters) return template || ''

  // Regex to find {filter.name} or {filter.value} placeholders
  return template.replace(/{([^{}]+?)\.(name|value)}/g, (match, filterName, property) => {
    const trimmedFilterName = filterName.trim()
    if (property === 'name') {
      return urlEncode ? encodeURIComponent(trimmedFilterName) : trimmedFilterName
    }
    if (property === 'value') {
      const filterValue = filters[trimmedFilterName]
      const valueToReplace = filterValue === undefined || filterValue === null ? '' : filterValue
      return urlEncode ? encodeURIComponent(valueToReplace) : valueToReplace
    }
    return match // Should not happen, but as a fallback
  })
}

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
      {isDashboardEditing && (
        <Box m="u4">
          <FieldTextArea
            label="Link URL"
            value={draftLinkUrl}
            onChange={(e) => setDraftLinkUrl(e.target.value)}
            description="Use {FilterName.name} and {FilterName.value} as placeholders."
          />
          <FieldTextArea
            label="Text Template"
            value={draftTextTemplate}
            onChange={(e) => setDraftTextTemplate(e.target.value)}
            description="Use {FilterName.name} and {FilterName.value} as placeholders."
          />
          <FieldColor
            label="Background Color"
            value={draftBackgroundColor}
            onChange={(e) => setDraftBackgroundColor(e.target.value)}
          />
          <FieldColor
            label="Text Color"
            value={draftTextColor}
            onChange={(e) => setDraftTextColor(e.target.value)}
          />
          <Heading as="h4" mt="u4" mb="u2">
            Preview
          </Heading>
          <Box bg={draftBackgroundColor} p="u4" borderRadius="4px">
            {draftLinkUrl ? (
              <Link
                href={previewProcessedLinkUrl}
                isExternal
                target="_blank"
                underline={false}
              >
                <Span color={draftTextColor} fontSize="large" fontWeight="bold">
                  {previewDisplayText}
                </Span>
              </Link>
            ) : (
              <Span color={draftTextColor} fontSize="large" fontWeight="bold">{previewDisplayText}</Span>
            )}
          </Box>
          <Button mt="small" onClick={handleSave}>Save</Button>
        </Box>
      )}
      {shouldRender() && (
        <Box bg={backgroundColor} p="u4" m="u4" borderRadius="4px">
          {linkUrl ? (
            <Link href={processedLinkUrl} isExternal target="_blank" underline={false}>
              <Span color={textColor} fontSize="large" fontWeight="bold">
                {displayText}
              </Span>
            </Link>
          ) : (
            <Span color={textColor} fontSize="large" fontWeight="bold">
              {displayText}
            </Span>
          )}
        </Box>
      )}
    </ComponentsProvider>
  )
}

import React, { useEffect, useState, useContext } from 'react'
import {
  Box,
  ComponentsProvider,
  Span,
  Button,
  Link,
  FieldText,
  FieldColor,
} from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'

export const DashboardFilterText = () => {
  const { tileHostData, extensionSDK } = useContext(ExtensionContext40)
  const [myFilterValue, setMyFilterValue] = useState('all values')
  const [filterName, setFilterName] = useState('MyFilter')
  const [draftFilterName, setDraftFilterName] = useState(filterName)
  const [backgroundColor, setBackgroundColor] = useState('#111FF4')
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [draftBackgroundColor, setDraftBackgroundColor] = useState(backgroundColor)
  const [draftTextColor, setDraftTextColor] = useState(textColor)
  const [linkUrl, setLinkUrl] = useState('')
  const [draftLinkUrl, setDraftLinkUrl] = useState(linkUrl)
  const defaultTemplate = 'Planning for {filterName} Value: {filterValue}'
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
        if (savedData.filterName) {
          setFilterName(savedData.filterName)
          setDraftFilterName(savedData.filterName)
        }
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
  }, [elementId])

  useEffect(() => {
    console.log(`${JSON.stringify(tileHostData?.dashboardFilters)}`)
    const currentFilterValue = tileHostData?.dashboardFilters?.[filterName]
    setMyFilterValue(currentFilterValue)
  }, [tileHostData, filterName])

  const handleSave = async () => {
    // First, save the draft values to the extension context.
    const context = (await extensionSDK.refreshContextData()) || {}
    const newValues = {
      filterName: draftFilterName,
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
    setFilterName(newValues.filterName)
    setBackgroundColor(newValues.backgroundColor)
    setTextColor(newValues.textColor)
    setLinkUrl(newValues.linkUrl)
    setTextTemplate(newValues.textTemplate)
  }

  const handleChange = (e) => {
    setDraftFilterName(e.target.value)
  }

  const displayText = textTemplate
    .replace('{filterName}', filterName)
    .replace('{filterValue}', myFilterValue)

  return (
    <ComponentsProvider>
      {isDashboardEditing && (
        <Box m="u4">
          <FieldText label="Filter Name" value={draftFilterName} onChange={handleChange} />
          <FieldText
            label="Link URL"
            value={draftLinkUrl}
            onChange={(e) => setDraftLinkUrl(e.target.value)}
          />
          <FieldText
            label="Text Template"
            value={draftTextTemplate}
            onChange={(e) => setDraftTextTemplate(e.target.value)}
            description="Use {filterName} and {filterValue} as placeholders."
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
          <Button mt="small" onClick={handleSave}>Save</Button>
        </Box>
      )}
      {myFilterValue && (
        <Box bg={backgroundColor} p="u4" m="u4" borderRadius="4px">
          {linkUrl ? (
            <Link href={linkUrl} isExternal target="_blank" underline={false}>
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

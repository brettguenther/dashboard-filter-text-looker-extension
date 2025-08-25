import React, { useEffect, useState, useContext } from 'react'
import {
  Box,
  ComponentsProvider,
  Span,
  Button,
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
  const { isDashboardEditing, elementId, dashboardId } = tileHostData

  const contextKey = `${elementId}-${dashboardId}`

  useEffect(() => {
    // empty space for title
    extensionSDK.updateTitle(null);
  },[])

  useEffect(() => {
    const init = async () => {
      const context = await extensionSDK.getContextData()
      if (context && context[contextKey]) {
        const { filterName, backgroundColor, textColor } = context[contextKey]
        if (filterName) {
          setFilterName(filterName)
        }
        if (backgroundColor) {
          setBackgroundColor(backgroundColor)
        }
        if (textColor) {
          setTextColor(textColor)
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
    }
    const newContext = {
      ...context,
      contextKey: newValues,
    }
    await extensionSDK.saveContextData(newContext)
    setFilterName(newValues.filterName)
    setBackgroundColor(newValues.backgroundColor)
    setTextColor(newValues.textColor)
  }

  const handleChange = (e) => {
    setDraftFilterName(e.target.value)
  }

  return (
    <ComponentsProvider>
      {isDashboardEditing && (
        <Box m="u4">
          <FieldText label="Filter Name" value={draftFilterName} onChange={handleChange} />
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
          <Span color={textColor} fontSize="large" fontWeight="bold">
            Planning for {filterName} Value: {myFilterValue}
          </Span>
        </Box>
      )}
    </ComponentsProvider>
  )
}

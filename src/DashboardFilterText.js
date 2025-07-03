import React, { useEffect, useState, useContext } from 'react'
import {
  Box,
  ComponentsProvider,
  Span,
  InputText,
  Button,
} from '@looker/components'
import { ExtensionContext40 } from '@looker/extension-sdk-react'

export const DashboardFilterText = () => {
  const { tileHostData, extensionSDK } = useContext(ExtensionContext40)
  const [myFilterValue, setMyFilterValue] = useState('all values')
  const [filterName, setFilterName] = useState('MyFilter')
  const [draftFilterName, setDraftFilterName] = useState(filterName)
  const { isDashboardEditing, elementId } = tileHostData

  useEffect(() => {
    const init = async () => {
      const context = await extensionSDK.getContextData()
      if (context && context[elementId] && context[elementId].filterName) {
        setFilterName(context[elementId].filterName)
      }
    }
    if (elementId) {
      init()
    }
  }, [elementId])

  useEffect(() => {
    setDraftFilterName(filterName)
  }, [filterName])

  useEffect(() => {
    const currentFilterValue = tileHostData?.dashboardFilters?.[filterName]
    setMyFilterValue(currentFilterValue)
  }, [tileHostData, filterName])

  const handleSave = async () => {
    setFilterName(draftFilterName)
    const context = (await extensionSDK.refreshContextData()) || {}
    const newContext = { ...context, [elementId]: { filterName: draftFilterName } }
    await extensionSDK.saveContextData(newContext)
  }

  const handleChange = (e) => {
    setDraftFilterName(e.target.value)
  }

  return (
    <ComponentsProvider>
      {isDashboardEditing && (
        <Box m="u4">
          <InputText value={draftFilterName} onChange={handleChange} />
          <Button onClick={handleSave}>Save</Button>
        </Box>
      )}
      {myFilterValue && (
        <Box bg="olive" p="u4" m="u4" borderRadius="4px">
          <Span color="white" fontSize="large" fontWeight="bold">
            Planning for {filterName} Value: {myFilterValue}
          </Span>
        </Box>
      )}
    </ComponentsProvider>
  )
}

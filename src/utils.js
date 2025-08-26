export const processTemplate = (template, filters, urlEncode = false) => {
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

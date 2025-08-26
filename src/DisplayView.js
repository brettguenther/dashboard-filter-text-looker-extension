import React from 'react'
import { Box, Span, Space } from '@looker/components'

export const DisplayView = ({
  backgroundColor,
  textColor,
  linkUrl,
  processedLinkUrl,
  displayText,
  extensionSDK,
}) => {
  const handleClick = () => {
    if (linkUrl && extensionSDK) {
      extensionSDK.openBrowserWindow(processedLinkUrl, '_blank')
    }
  }

  return (
    <Space align="center" justify="center">
      <Box bg={backgroundColor} p="u05" m="u4" borderRadius="4px">
        <Span
          color={textColor}
          fontSize="large"
          fontWeight="bold"
          onClick={handleClick}
          style={{ cursor: linkUrl ? 'pointer' : 'default' }}
        >
          {displayText}
        </Span>
      </Box>
    </Space>
  )
}
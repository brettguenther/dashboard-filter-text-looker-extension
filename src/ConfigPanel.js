import React from 'react'
import {
  Box,
  Button,
  FieldColor,
  FieldTextArea,
  Heading,
  Link,
  Span,
  Fieldset,
  FieldRadioGroup
} from '@looker/components'

export const ConfigPanel = ({
  draftLinkUrl,
  setDraftLinkUrl,
  draftTextTemplate,
  setDraftTextTemplate,
  draftBackgroundColor,
  setDraftBackgroundColor,
  draftTextColor,
  setDraftTextColor,
  previewProcessedLinkUrl,
  previewDisplayText,
  onSave,
  draftDisplayMode,
  setDraftDisplayMode,
  extensionSDK
}) => {
  return (
    <Box m="u4">
      <FieldRadioGroup
        label="Display Mode"
        value={draftDisplayMode}
        onChange={setDraftDisplayMode}
        options={[
          { value: 'view', label: 'Text Box' },
          { value: 'button', label: 'Button' },
        ]}
      />
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
      <Fieldset accordion={true} defaultOpen>
        <FieldColor
          label="Background Color"
          value={draftBackgroundColor}
          disabled={draftDisplayMode === 'button'}
          onChange={(e) => setDraftBackgroundColor(e.target.value)}
        />
        <FieldColor
          label="Text Color"
          value={draftTextColor}
          disabled={draftDisplayMode === 'button'}
          onChange={(e) => setDraftTextColor(e.target.value)}
        />
      </Fieldset>
      <Heading as="h4" mt="u4" mb="u2">
        Preview
      </Heading>
      <Box bg={draftDisplayMode === 'view' ? draftBackgroundColor : 'transparent'} p="u4" borderRadius="4px">
        {draftDisplayMode === 'view' ? (
          draftLinkUrl ? (
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
            <Span color={draftTextColor} fontSize="large" fontWeight="bold">
              {previewDisplayText}
            </Span>
          )
        ) : (
          <Button onClick={() => extensionSDK.openBrowserWindow(previewProcessedLinkUrl, '_blank')}>{previewDisplayText}</Button>
        )}
      </Box>
      <Button mt="small" onClick={onSave}>
        Save
      </Button>
    </Box>
  )
}

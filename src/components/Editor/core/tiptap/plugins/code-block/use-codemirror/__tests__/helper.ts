import { Document } from '@tiptap/extension-document'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { CodeBlock } from '@tiptap/extension-code-block'
import { History } from '@tiptap/extension-history'

export const extensions = [Document, Paragraph, Text, CodeBlock, History]

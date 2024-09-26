import type { Ref } from 'vue'
import type { LayoutData } from '~/components/Manager/StylePicker/definitions'

export interface TemplateInfo {
  template: string
  data: LayoutData
}

export interface PreviewData {
  id: Ref<string>
  templateInfo: Ref<TemplateInfo>
}

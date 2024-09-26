import type { Story } from '@storybook/vue3'
import { Dropzone } from './index'

export default {
  title: 'Manager/Kanban/Components/KanbanCard',
  layout: 'fullscreen',
  argTypes: {
    status: {
      options: ['edit', 'unpublished', 'published'],
      control: { type: 'radio' },
    },
  },
}

const Template: Story = (args) => ({
  components: { Dropzone },
  template: `
    <div>
      <Dropzone
        :status="args.status"
        :oldStage="args.oldStage"
        :newStage="args.newStage"
        :newStageColor="args.newStageColor"
      />
    </div>
  `,
  setup() {
    return {
      args,
    }
  },
})

export const DragDropzone = Template.bind({})
DragDropzone.args = {
  status: 'unpublished', // droppend end position status, card will change width and height by this param
  oldStage: 'Ideas',
  newStage: 'For review',
  newStageColor: '#00bcd4',
}

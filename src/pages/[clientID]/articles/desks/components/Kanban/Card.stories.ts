import type { Story } from '@storybook/vue3'
import { action } from '@storybook/addon-actions'
import { Card } from './index'

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
  components: { Card },
  template: `
    <div>
      <Card
        :id="args.id"
        :title="args.title"
        :desk="args.desk"
        :editedAt="args.editedAt"
        :publishedAt="args.publishedAt"
        :featured="args.featured"
        :status="args.status"
        :avatars="args.avatars"
        @publish-now="onPublishNow"
        @unpublish="onUnpublish"
        @update-feature="onUpdateFeature"
        @delete="onDelete"
        @duplicate="onDuplicate"
        @click="onClick"
      />
    </div>
  `,
  setup() {
    return {
      args,
      onPublishNow(data) {
        action('PublishNow')(data)
      },
      onUnpublish(data) {
        action('Unpublish')(data)
      },
      onUpdateFeature(data) {
        action('UpdateFeature')(data)
      },
      onDelete(data) {
        action('Delete')(data)
      },
      onDuplicate(data) {
        action('Duplicate')(data)
      },
      onClick() {
        action('click')()
      },
    }
  },
})

export const Draft = Template.bind({})
Draft.args = {
  id: '1',
  title: 'Title',
  desk: 'Desk',
  editedAt: new Date(1647100000000),
  publishedAt: new Date(1647100000000),
  status: 'edit',
  featured: true,
  avatars: [
    { src: 'https://i.pravatar.cc/150?img=3', name: 'test1' },
    { src: 'https://i.pravatar.cc/150?img=4', name: 'test2' },
    { src: 'https://i.pravatar.cc/150?img=5', name: 'test3' },
  ],
}

export const Published = Template.bind({})
Published.args = {
  id: '1',
  title: 'Title',
  desk: 'Desk',
  editedAt: new Date(1647100000000),
  publishedAt: new Date(1647100000000),
  status: 'published',
  featured: true,
  avatars: [
    { src: 'https://i.pravatar.cc/150?img=3', name: 'test1' },
    { src: 'https://i.pravatar.cc/150?img=4', name: 'test2' },
    { src: 'https://i.pravatar.cc/150?img=5', name: 'test3' },
  ],
}

export const DraftScheduled = Template.bind({})
DraftScheduled.args = {
  id: '1',
  title: 'Title',
  desk: 'Desk',
  editedAt: new Date(1647100000000),
  publishedAt: new Date(1647100000000),
  status: 'unpublished',
  featured: false,
  avatars: [
    { src: 'https://i.pravatar.cc/150?img=3', name: 'test1' },
    { src: 'https://i.pravatar.cc/150?img=4', name: 'test2' },
    { src: 'https://i.pravatar.cc/150?img=5', name: 'test3' },
  ],
}

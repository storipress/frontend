import { ref } from 'vue'
import DestructiveModel from './index.vue'

export default {
  title: 'App Components/Modals',
}

export const Destructive = (args) => ({
  components: { DestructiveModel },
  setup() {
    const visible = ref(true)
    const loading = ref(false)

    function onModalClose() {
      visible.value = false
    }
    function onClickDelete() {
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 3000)
    }
    args = {
      title: 'Subs',
      confirmValue: 'New-York-Times/Delete-Members',
      buttonText: 'member(s)',
    }
    return {
      args,
      visible,
      loading,
      onModalClose,
      onClickDelete,
    }
  },
  template: `
    <DestructiveModel v-bind="args" :visible="visible" :loading="loading" @on-modal-close="onModalClose"  @on-click-delete="onClickDelete">
      You've selected 1 email.
      <br/><br/>
      This will remove this user and their associated profile data from your email list forever. If any of these emails have paid subscriptions, they will be issued a pro-rated refund before being removed from the list. Free subscribers will simply be removed from your email list.
      <br/><br/>
      
      If you want to preserve user data, unsubscribe the user instead.
    </DestructiveModel>
  `,
})

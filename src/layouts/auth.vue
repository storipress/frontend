<script lang="ts" setup>
const loginSuccess = ref(false)

function isLogin(status: boolean) {
  loginSuccess.value = status
}
</script>

<template>
  <div
    class="flex min-h-screen w-screen transform-gpu overflow-hidden before:fixed before:-z-10 before:size-full before:bg-[url('@assets/landing-abstract.svg')] before:bg-cover before:bg-no-repeat before:transition before:duration-1000 before:ease-out"
    :class="
      loginSuccess
        ? 'transform-gpu before:scale-100 before:brightness-100'
        : 'transform-gpu before:scale-110 before:brightness-95'
    "
  >
    <div class="my-12 flex items-center md:ml-[8.6%]">
      <router-view @is-login="isLogin" />
    </div>
  </div>
</template>

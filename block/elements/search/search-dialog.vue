<script lang="ts">
import type { ComponentInternalInstance } from 'vue'
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'
import { AisHits, AisInstantSearch, AisSearchBox } from 'vue-instantsearch/vue3/es'
import { defineComponent, getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue'

import { getImageDataUrl } from './liner-gradients'
import Block from './search-block.vue'
import CloseBtn from './search-close.vue'
import LogoPlaceholder from './search-logo.vue'

const coverCache = new Map()
function createSearchClient() {
  const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
    server: {
      apiKey: import.meta.env.VITE_TYPESENSE_KEY || '', // Be sure to use the search-only-api-key
      nodes: [
        {
          host: import.meta.env.VITE_TYPESENSE_HOST || '',
          port: 443,
          protocol: 'https',
        },
      ],
    },
    additionalSearchParameters: {
      query_by: 'title',
    },
  })
  const { searchClient } = typesenseInstantsearchAdapter
  return searchClient
}

function getCover(item: any) {
  if (coverCache.has(item.id)) {
    return coverCache.get(item.id)
  } else {
    const cover = JSON.parse(item.cover)
    if (cover) {
      coverCache.set(item.id, cover)
      return cover
    } else return { url: getImageDataUrl(), alt: '' }
  }
}

export default defineComponent({
  name: 'SearchDialog',
  components: { CloseBtn, LogoPlaceholder, Block, AisHits, AisSearchBox, AisInstantSearch },
  emits: ['clicked'],

  setup(_, { emit }) {
    const { proxy } = getCurrentInstance() as ComponentInternalInstance
    const searchBox = ref<HTMLInputElement>()
    const searchInput = ref('')

    // FIXME: detect empty list
    const currentClientID = (proxy as any).$storipress?.clientID || ''
    const clientID = `${currentClientID}-articles`

    function setFocus() {
      requestAnimationFrame(() => {
        const SEARCH_BOX = searchBox.value

        if (SEARCH_BOX) {
          SEARCH_BOX.focus()
        }
      })
    }

    onMounted(() => {
      const scrollPos = document.documentElement.scrollTop

      document.body.style.overflowY = 'hidden'

      setTimeout(setFocus, 500)

      onBeforeUnmount(() => {
        document.body.style.overflowY = ''

        document.body.scrollTo({ top: scrollPos })
      })
    })

    return {
      searchBox,
      searchInput,
      searchClient: createSearchClient(),
      clientID,

      dialogCloser() {
        emit('clicked', false)
      },
      setFocus,
      getCover,
    }
  },
})
</script>

<template>
  <div class="dialog" @transitionend="setFocus">
    <CloseBtn @click="dialogCloser" />

    <ais-instant-search
      class="search"
      :class="searchInput?.length > 0 && 'searched'"
      :search-client="searchClient"
      :index-name="clientID"
    >
      <div class="overlay-top" />

      <ais-search-box v-model="searchInput" class="search-input">
        <label>Just start typing...</label>
        <input ref="searchBox" v-model="searchInput" type="text" autofocus @keydown.esc="dialogCloser" />
      </ais-search-box>

      <ais-hits v-if="searchInput" v-slot="{ items }" class="results">
        <div v-if="items?.length === 0">
          <h1 class="no-result">We’re sorry, we couldn’t find any articles!</h1>

          <h2 class="try-another-keyword">Why don't you try searching for something else?</h2>
        </div>

        <div v-else class="grid grid-cols-1 gap-6 pb-24 lg:grid-cols-3">
          <div v-for="item in items" :key="item.id">
            <Block :log="item" :info="getCover(item).alt" :url="getCover(item).url" />
          </div>
        </div>
      </ais-hits>

      <LogoPlaceholder />
    </ais-instant-search>
  </div>
</template>

<style lang="scss" scoped>
.dialog {
  @apply overflow-y-auto overscroll-none;
  @apply h-screen w-screen;
  @apply fixed top-0 z-20;

  background-color: rgba(0, 0, 0, 0.92);

  .search {
    @apply relative;
    @apply h-full w-full;

    .search-input {
      @apply fixed z-20;
      @apply mx-4;

      top: 1.156rem;
      transition-property: top, transform;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 150ms;

      @screen md {
        @apply top-1/2;

        margin-left: 3.281rem;
        margin-right: 3.281rem;
        transform: translateY(-50%);
      }

      label {
        color: rgba(255, 255, 255, 0.5);
        font-size: 1rem;
      }

      input {
        @apply w-full bg-transparent outline-none;
        @apply font-bold text-white;

        font-size: 1.5rem;

        @screen md {
          font-size: 6rem;
        }
      }
    }

    .results {
      @apply h-screen;

      padding-top: 7rem;

      @screen md {
        padding-top: 18.75rem;
      }

      @screen lg {
        margin-left: 3.5rem;
        margin-right: 3.5rem;
      }

      .no-result {
        @apply mx-4 mt-4 text-5xl text-white;

        line-height: normal;
        max-width: 33.313rem;

        @screen md {
          @apply mx-0 mt-0;
        }
      }

      .try-another-keyword {
        @apply mx-4 mt-4 text-5xl text-white;

        color: rgba(216, 216, 216, 0.75);
        font-size: 1.688rem;
        font-weight: 300;
        line-height: 1.48;
        max-width: 21.688rem;

        @screen md {
          @apply mx-0;
        }
      }
    }

    &.searched {
      .search-input {
        @screen md {
          top: 3.125rem;
          transform: translateY(0);
        }
      }
    }
  }

  .overlay-top {
    @apply fixed top-0 z-10;
    @apply w-full;

    background: linear-gradient(180deg, #000 35%, transparent);
    height: 13rem;
  }
}
</style>

<script>
import { Template } from '@storipress/article'

export default defineComponent({
  mixins: [Template],
  data() {
    return {
      isSocialShareOpen: false,
    }
  },
  methods: {
    toggleSocialShare() {
      this.isSocialShareOpen = !this.isSocialShareOpen
    },
  },
})
</script>

<template>
  <ArticleBlock>
    <!--- hero --->
    <HeaderBlock>
      <HeadlineWrapper class="relative flex h-screen max-h-[20rem] md:max-h-[65rem]">
        <HeadlineImage class="absolute inset-0 w-full" sizes="100vw" />
        <!--- hero text wrapper --->
        <div
          class="relative hidden min-h-full w-full flex-col items-start justify-end bg-gradient-to-t from-black px-12 py-20 text-center md:flex"
        >
          <ArticleInfo v-slot="{ article }">
            <LinkElement :href="article.deskUrl">
              <Desk
                class="mb-2.5 mt-4 inline-block"
                :font-size="14"
                font-family="Jost"
                bold
                align="left"
                :color="{ xs: '000', md: 'fff' }"
                component="div"
              />
            </LinkElement>
          </ArticleInfo>
          <TitleElement
            class="pointer-events-auto mb-4 max-w-3xl text-left"
            :bold="true"
            :font-size="56"
            :line-height="1"
            font-family="Jost"
            color="fff"
            kind="hero-title"
          />
          <Description
            class="max-w-xl text-left"
            kind="hero-description"
            font-family="Jost"
            :font-size="21"
            :line-height="1.3"
            color="fff"
          />
        </div>
        <!--- svg share button --->
        <div class="social-buttons absolute bottom-6 right-6 z-10" :class="isSocialShareOpen && 'show'">
          <div class="cursor-pointer" role="button" @click="toggleSocialShare">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 511.626 511.627"
              style="enable-background: new 0 0 511.626 511.627"
              xml:space="preserve"
              fill="#fff"
            >
              <path
                d="M506.206 179.012 360.025 32.834c-3.617-3.617-7.898-5.426-12.847-5.426s-9.233 1.809-12.847 5.426c-3.617 3.619-5.428 7.902-5.428 12.85v73.089H264.95c-135.716 0-218.984 38.354-249.823 115.06C5.042 259.335 0 291.03 0 328.907c0 31.594 12.087 74.514 36.259 128.762.57 1.335 1.566 3.614 2.996 6.849a603.829 603.829 0 0 0 3.854 8.565c1.146 2.471 2.384 4.565 3.715 6.276 2.282 3.237 4.948 4.859 7.994 4.859 2.855 0 5.092-.951 6.711-2.854 1.615-1.902 2.424-4.284 2.424-7.132 0-1.718-.238-4.236-.715-7.569-.476-3.333-.715-5.564-.715-6.708-.953-12.938-1.429-24.653-1.429-35.114 0-19.223 1.668-36.449 4.996-51.675 3.333-15.229 7.948-28.407 13.85-39.543 5.901-11.14 13.512-20.745 22.841-28.835 9.325-8.09 19.364-14.702 30.118-19.842 10.756-5.141 23.413-9.186 37.974-12.135 14.56-2.95 29.215-4.997 43.968-6.14s31.455-1.711 50.109-1.711h63.953v73.091c0 4.948 1.807 9.232 5.421 12.847 3.62 3.613 7.901 5.424 12.847 5.424 4.948 0 9.232-1.811 12.854-5.424l146.178-146.183c3.617-3.617 5.424-7.898 5.424-12.847-.001-4.948-1.807-9.232-5.421-12.856z"
              />
            </svg>
          </div>
          <ArticleInfo v-slot="{ socials }">
            <ul class="share-items">
              <li v-if="socials.facebook">
                <LinkElement target="_blank" rel="noopener" :href="socials.facebook">
                  <svg fill="#fff" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M15.997 3.985h2.191V.169C17.81.117 16.51 0 14.996 0c-3.159 0-5.323 1.987-5.323 5.639V9H6.187v4.266h3.486V24h4.274V13.267h3.345l.531-4.266h-3.877V6.062c.001-1.233.333-2.077 2.051-2.077z"
                    />
                  </svg>
                </LinkElement>
              </li>
              <li v-if="socials.twitter">
                <LinkElement target="_blank" rel="noopener" :href="socials.twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff">
                    <path
                      d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"
                    />
                  </svg>
                </LinkElement>
              </li>
            </ul>
            <!--- svg share button end -->
          </ArticleInfo>
        </div>
      </HeadlineWrapper>
    </HeaderBlock>
    <!--- content meta --->
    <div class="mx-5 mt-16 flex max-w-screen-sm justify-start md:mx-auto md:mt-28">
      <div class="relative flex flex-col content-center">
        <div class="post-head flex flex-col justify-center">
          <ArticleInfo v-slot="{ article }">
            <LinkElement :href="article.deskUrl">
              <Desk component="div" class="inline-block md:hidden" />
            </LinkElement>
          </ArticleInfo>
          <TitleElement
            kind="content-title"
            class="mb-2.5 md:hidden"
            font-family="Jost Condensed"
            bold
            color="000"
            :font-size="{ xs: 40, md: 48 }"
            :line-height="1.2"
          />
          <Description
            kind="content-description"
            class="mb-5 md:hidden"
            font-family="Jost"
            :font-size="{ xs: 17, md: 21 }"
            color="000"
          />
          <AuthorList
            class="mb-3.5"
            font-family="Jost"
            :font-size="{ xs: 14, md: 15 }"
            :line-height="1.1"
            bold
            color="000"
          >
            By&nbsp;
            <Authors />
          </AuthorList>
          <div class="mb-8 flex flex-row pb-8 font-medium">
            <!-- <div class="label-published-article">Published&nbsp;</div> -->
            <Date font-family="Jost" :font-size="13" :line-height="1.0" color="444" format="MMMM d, yyyy" />
          </div>
        </div>
      </div>
    </div>

    <Content class="mx-5 max-w-screen-sm md:mx-auto">
      <!-- Below is the content of demo article, you should not add or remove any element below -->
      <Paragraph :order="0" font-family="Jost" :font-size="20" :line-height="1.6" color="333" />
      <Header1 font-family="Jost" :font-size="28" :line-height="2" />
      <Paragraph :order="1" font-family="Jost" :font-size="20" :line-height="1.6" color="333" />
      <Blockquote
        font-family="Jost"
        :font-size="{ xs: 35, md: 35 }"
        :line-height="1.4"
        :align="{ xs: 'center', lg: 'center' }"
        color="121212"
        bold
      />
      <Paragraph :order="2" font-family="Jost" :font-size="20" :line-height="1.6" color="333" />
      <Header2 font-family="Jost" :font-size="24" :line-height="2" />
      <Paragraph :order="3" font-family="Jost" :font-size="20" :line-height="1.6" color="333" />
    </Content>
  </ArticleBlock>
</template>

<style lang="scss" scoped>
.share-items {
  display: none;

  .show & {
    display: block;
  }
}

.social-buttons {
  transition: transform 0.1s 0.7s;
  transition-delay: 400ms;

  .share-items {
    color: #fff;
    position: absolute;
    overflow: hidden;
    left: 0;
    top: 100%;

    li {
      @apply opacity-80 transition-opacity hover:opacity-100;

      margin-top: 30px;
      transition: all 0.1s cubic-bezier(1, -0.13, 0, 0.82) 0s;

      svg {
        // stylelint-disable-next-line declaration-no-important
        width: 20px !important;
        // stylelint-disable-next-line declaration-no-important
        height: 20px !important;
      }
    }
  }

  &.show {
    transform: translateY(-100px);
    transition-delay: 0s;

    .social-items {
      pointer-events: auto;

      li {
        transform: translateY(0);
      }
    }
  }
}
</style>

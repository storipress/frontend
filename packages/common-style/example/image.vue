<script setup lang="ts"></script>

<template>
  <div
    class="has-focus image interactive-node not-prose clear-both"
    data-node-view-wrapper=""
    data-format="image"
    data-title=""
    data-alt=""
    data-src="https://assets.stori.press/media/images/9ff8450f-9d00-4fce-bfde-fb452fcc7cff.webp"
    data-source="[]"
    contenteditable="false"
    draggable="true"
    style="white-space: normal; width: 100%"
  >
    <figure data-v-6568667e="" class="flex w-full flex-col items-center justify-center">
      <span data-v-6568667e="" class="relative w-full cursor-grab"
        ><div data-v-6568667e="" class="space-y-1">
          <div data-v-6568667e="" class="flex flex-col items-center justify-center">
            <img
              data-v-6568667e=""
              src="https://assets.stori.press/media/images/9ff8450f-9d00-4fce-bfde-fb452fcc7cff.webp"
              class="h-full"
            />
            <div data-v-6568667e="" class="absolute items-center justify-center space-y-1"><!-- v-if --></div>
            <div data-v-6568667e="" class="mt-[-2rem] flex items-center justify-center">
              <label data-v-6568667e="" for="0.6006994155223859"
                ><div
                  data-v-6568667e=""
                  class="layer-1 visible w-fit rounded border border-stone-900/5 bg-white px-2 py-1"
                >
                  <div class="text-caption whitespace-nowrap text-stone-500">Missing alt text</div>
                </div></label
              >
              <div data-v-6568667e="" class="absolute right-2.5 flex items-center justify-center" role="button">
                <div
                  data-v-6568667e=""
                  data-testid="link-button"
                  class="flex size-6 items-center justify-center rounded-full bg-white"
                >
                  <span
                    data-v-188858b3=""
                    data-v-6568667e=""
                    class="icon-link_variant text-[.75rem] text-stone-600"
                  ></span>
                </div>
                <!---->
              </div>
            </div>
          </div>
          <!-- use w-[93vw] because use 100vw will exceed the image width -->
          <figcaption
            data-v-6568667e=""
            class="flex w-full cursor-text items-center space-x-1 pb-1 pt-3 text-xs leading-tight"
          >
            <div data-v-6568667e="" class="custom-input grid w-full grid-cols-1 grid-rows-1">
              <!-- add max-w-[10px] because safari will has bug if only use max-w-fit -->
              <div
                data-v-08b8a566=""
                data-v-6568667e=""
                class="rich-input col-start-1 col-end-2 row-start-1 min-w-full max-w-fit whitespace-pre-wrap break-all"
                data-testid="richCaption"
              >
                <div data-v-08b8a566="" style="white-space: pre-wrap; user-select: text">
                  <div
                    contenteditable="true"
                    translate="no"
                    class="tiptap ProseMirror no-drop"
                    tabindex="0"
                    aria-expanded="false"
                  >
                    <p data-placeholder="Enter a photo caption …" class="empty-node is-editor-empty">
                      <br class="ProseMirror-trailingBreak" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </figcaption></div
      ></span>
    </figure>
  </div>
</template>

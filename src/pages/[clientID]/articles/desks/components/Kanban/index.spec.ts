import type { PropType } from 'vue'
import { toRaw } from 'vue'
import type { MockInstance } from 'vitest'
import { describe, expect, it } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/vue'
import { ApolloClients } from '@vue/apollo-composable'
import { NotificationProvider } from '@storipress/core-component'
import { html } from 'proper-tags'
import type { KanbanState, NewStageInputData, StageWithType, StagesForView, UpdateStageInputData } from './definition'
import { mutationKey, stateKey, useKanbanMutation, useKanbanState } from './definition'

import { SortArticleBy } from './search-query-provider'
import Provider, { Kanban } from './index'
import ConfirmModalProvider from '~/components/ConfirmModalProvider/ConfirmModalProvider.vue'
import NewArticleProvider from '~/components/NewArticle/provider.vue'
import DraggableGroupProvider from '~/components/Draggable/DraggableGroupProvider'
import { mockResponseOnce, render } from '~/test-helpers'
import type { ListDesksQuery } from '~/graphql-operations'
import { clients } from '~/lib/apollo'
import GetStages from '~/mocks/graphql/GetStages'

async function prepareUITestingWrapper(mutationObject: Record<string, MockInstance<(...args: any[]) => any>>) {
  // eslint-disable-next-line testing-library/render-result-naming-convention
  const res = render(
    defineComponent({
      components: {
        ConfirmModalProvider,
        NewArticleProvider,
        NotificationProvider,
        DraggableGroupProvider,
        Kanban,
      },
      props: {
        desk: Object as PropType<ListDesksQuery['desks'][0]>,
      },
      setup() {
        const stagesWithType = [
          {
            id: '1',
            name: 'Drafts',
            color: '#FFA324',
            icon: 'mdiFileEditOutline',
            order: 1,
            ready: false,
            default: true,
          },
          {
            id: '2',
            name: 'For Review',
            color: '#a21caf',
            icon: 'preview',
            order: 125,
            ready: false,
            default: false,
          },
          {
            id: '3',
            name: 'Reviewed',
            color: '#44A604',
            icon: 'mdiSendOutline',
            order: 142,
            ready: true,
            default: false,
            type: 'ready',
          },
          {
            id: '3',
            name: 'Reviewed',
            color: '#44A604',
            icon: 'mdiSendOutline',
            order: 142,
            ready: true,
            default: false,
            type: 'published',
          },
        ]
        const mapAfterIdToDraftStages = ref<Map<string, NewStageInputData[]>>(new Map()) // prepare overwrite arguments
        const mapIdToKey = ref<Map<string, string>>(new Map()) // prepare overwrite arguments
        const stagesForView = computed<StagesForView>(() => {
          const customs: (StageWithType | NewStageInputData)[] = []
          stagesWithType.slice(0, stagesWithType.length - 2).forEach((stage) => {
            if (!stage.default) {
              customs.push(stage)
              stage.key = mapIdToKey.value.get(stage.id)
            }
            const temp = mapAfterIdToDraftStages.value.get(stage.id)
            if (temp) customs.push(...temp)
          })
          return {
            default: stagesWithType[0],
            customs,
            ready: stagesWithType[stagesWithType.length - 2],
            published: stagesWithType[stagesWithType.length - 1],
          }
        })
        provide(
          stateKey,
          computed<KanbanState>(() => {
            return {
              deskId: '3',
              stagesForView: stagesForView.value,
              mapStageKeyToArticlesForView: new Map([
                ['1-default', { total: 0, articles: [] }],
                ['2-custom', { total: 0, articles: [] }],
                ['3-ready', { total: 0, articles: [] }],
                ['3-published', { total: 0, articles: [] }],
              ]),
              isLoading: false,
              getStageKey: (stageId: string, stageType: string) => `${stageId}-${stageType}`,
              getStageByKey: (stageKey: string) => {
                const key = stageKey.replace(/-.*$/, '')
                return [
                  {
                    id: '1',
                    name: 'Drafts',
                    color: '#FFA324',
                    icon: 'mdiFileEditOutline',
                    order: 1,
                    ready: false,
                    default: true,
                  },
                  {
                    id: '2',
                    name: 'For Review',
                    color: '#a21caf',
                    icon: 'preview',
                    order: 125,
                    ready: false,
                    default: false,
                  },
                  {
                    id: '3',
                    name: 'Reviewed',
                    color: '#44A604',
                    icon: 'mdiSendOutline',
                    order: 142,
                    ready: true,
                    default: false,
                  },
                ].find((stage) => stage.id === key)
              },
              parseStageKey: (stageKey: string): [string, string] => {
                const temp = stageKey.split('-')
                return [temp[0], temp[1]]
              },
            }
          }),
        )
        provide(mutationKey, {
          publishArticle: async (id: string) => {},
          unpublishArticle: async (id: string) => {},
          unscheduleArticle: async (id: string) => {},
          changeFeatureArticle: async (id: string, value: boolean) => {},
          deleteArticle: async (id: string) => {},
          duplicateArticle: async (id: string) => {},
          moveArticleBefore: async (id: string, referenceId: string) => {},
          moveArticleAfter: async (id: string, referenceId: string) => {},
          moveArticleToDifferentStage: async (id: string, stageKey: string, index: number) => {},
          moveArticleToDifferentDesk: async (id: string, deskId: string) => {},
          sortBy: () => Promise.resolve(),
          addDraftStage: (afterId: string) => {
            const draftStage: NewStageInputData = {
              draftId: Math.random().toString(16).slice(2),
              name: '',
              color: '#0f766e',
              icon: 'preview',
            }
            if (mapAfterIdToDraftStages.value.has(afterId)) {
              mapAfterIdToDraftStages.value.get(afterId)?.unshift(draftStage)
            } else {
              mapAfterIdToDraftStages.value.set(afterId, [draftStage])
            }
          },
          removeDraftStage: (draftId: string) => {
            for (const drafts of mapAfterIdToDraftStages.value.values()) {
              const index = drafts.findIndex((stage) => stage.draftId === draftId)
              if (index !== -1) {
                drafts.splice(index, 1)
                break
              }
            }
          },
          addStage: async (data: NewStageInputData) => {},
          updateStage: async (stageId: string, data: UpdateStageInputData) => {},
          removeStage: async (stageId: string) => {},
          queryNextPageByStageIdAndType: async (stageId: string, type: string) => {},
          setDragging: () => {},
          ...mutationObject,
        })
      },
      template: html`
        <ConfirmModalProvider>
          <NewArticleProvider>
            <NotificationProvider>
              <DraggableGroupProvider>
                <Kanban v-bind="$props" />
              </DraggableGroupProvider>
            </NotificationProvider>
          </NewArticleProvider>
        </ConfirmModalProvider>
      `,
    }),
    {
      props: {
        desk: { id: 'ALL', name: 'All', slug: '', desks: [] },
      },
    },
  )
  await waitFor(() => {
    expect(res.getByText('For Review')).toBeVisible()
  })
  return res
}
async function prepareProviderTestingWrapper() {
  let state: any
  let mutation: any
  const InjectComp = defineComponent({
    setup() {
      state = useKanbanState()
      mutation = useKanbanMutation()
    },
  })
  const Wrapper = defineComponent({
    components: {
      ConfirmModalProvider,
      NewArticleProvider,
      NotificationProvider,
      DraggableGroupProvider,
      Provider,
      InjectComp,
    },
    props: {
      desk: Object as PropType<ListDesksQuery['desks'][0]>,
    },
    setup() {
      provide(ApolloClients, clients)
    },
    template: `
      <Provider v-bind="$props">
        <InjectComp />
      </Provider>
      `,
  })
  // eslint-disable-next-line testing-library/render-result-naming-convention
  const res = render(Wrapper, {
    props: {
      desk: { id: 'ALL', name: 'All', slug: '', desks: [] },
    },
  })
  await waitFor(() => {
    expect(res.getByText('For Review')).toBeVisible()
  })
  return [res, state, mutation]
}

function getDomPath(element: Element): string {
  const tagName = element.tagName
  if (tagName === 'BODY' || tagName === 'HTML') return tagName
  // eslint-disable-next-line testing-library/no-node-access
  const children = element.parentElement?.children
  if (children) {
    const index = Array.from(children).findIndex((child) => toRaw(child) === element || child === element)
    return `${getDomPath(element.parentElement as Element)} > ${index}:${tagName}`
  }
  return ''
}

function setupLayout(dom: HTMLElement) {
  const { width: clientWidth, height: clientHeight } = dom.getBoundingClientRect()
  Object.assign(dom, { clientWidth, clientHeight })

  const { children } = dom
  if (children) {
    Array.from(children).forEach((child) => {
      setupLayout(child as HTMLElement)
    })
  }
}

function _mockStages() {
  mockResponseOnce(GetStages, {
    stages: [
      {
        id: '1',
        name: 'Drafts',
        color: '#FFA324',
        icon: 'mdiFileEditOutline',
        order: 1,
        ready: false,
        default: true,
        __typename: 'Stage' as const,
      },
      {
        id: '2',
        name: 'For Review',
        color: '#a21caf',
        icon: 'preview',
        order: 125,
        ready: false,
        default: false,
        __typename: 'Stage' as const,
      },
      {
        id: '3',
        name: 'Reviewed',
        color: '#44A604',
        icon: 'mdiSendOutline',
        order: 142,
        ready: true,
        default: false,
        __typename: 'Stage' as const,
      },
    ],
  })
}

describe.skip('kanban unit tests', () => {
  // beforeEach(() => {
  //   _mockStages()
  // })
  // test(
  //   'Kanban',
  //   async () => {
  //     const [{ getByText, getAllByText }] = await prepareProviderTestingWrapper()
  //     await waitFor(
  //       () => {
  //         expect(getAllByText('TOA-Draft')).toHaveLength(2)
  //       },
  //       { timeout: 6 * 1000 }
  //     )
  //     await waitFor(() => {
  //       expect(getAllByText('10/05/22 @ 17:19 PM')).toHaveLength(2)
  //     })

  //     expect(getByText('Drafts')).toBeVisible()
  //     expect(getByText('For Review')).toBeVisible()
  //     expect(getByText('Reviewed')).toBeVisible()
  //     expect(getByText('Live')).toBeVisible()

  //     expect(getAllByText('TOA-Draft')).toHaveLength(2)
  //     expect(getAllByText('TOA-Draft')[0]).toBeVisible()
  //     expect(getAllByText('TOA-Draft')[1]).toBeVisible()

  //     expect(getAllByText('10/05/22 @ 17:19 PM')).toHaveLength(2)
  //     expect(getAllByText('10/05/22 @ 17:19 PM')[0]).toBeVisible()
  //     expect(getAllByText('10/05/22 @ 17:19 PM')[1]).toBeVisible()

  //     expect(getAllByText('TEST: One Article')).toHaveLength(2)
  //     expect(getAllByText('TEST: One Article')[0]).toBeVisible()
  //     expect(getAllByText('TEST: One Article')[1]).toBeVisible()
  //   },
  //   8 * 1000
  // )
  it('sort', async () => {
    const sortBy = vi.fn()
    const { getByText, findAllByTestId, findByText } = await prepareUITestingWrapper({
      sortBy,
    })

    const menuTrigger = (await findAllByTestId('stage-menu-trigger'))[0]
    await fireEvent.click(menuTrigger)
    const sortMenu = await findByText('Sort')
    await fireEvent.mouseOver(sortMenu)
    await waitFor(() => {
      expect(getByText('Date created (newest first)')).toBeVisible()
    })

    const sortItem1 = await findByText('Date created (newest first)')
    await fireEvent.click(sortItem1)
    expect(sortBy).toBeCalledWith({ sort: SortArticleBy.CreatedDesc })
    await fireEvent.click(menuTrigger)
    const sortItem2 = await findByText('Date created (oldest first)')
    await fireEvent.click(sortItem2)
    expect(sortBy).toBeCalledWith({ sort: SortArticleBy.CreatedAsc })
    await fireEvent.click(menuTrigger)
    const sortItem3 = await findByText('Article name (a-z)')
    await fireEvent.click(sortItem3)
    expect(sortBy).toBeCalledWith({ sort: SortArticleBy.TitleAsc })
    await fireEvent.click(menuTrigger)
    const sortItem4 = await findByText('Article name (z-a)')
    await fireEvent.click(sortItem4)
    expect(sortBy).toBeCalledWith({ sort: SortArticleBy.TitleDesc })
  })
  it('add Stage', async () => {
    const addStageMockFn = vi.fn()
    const { findByTestId, findAllByTestId, getByTestId, findByText, findByPlaceholderText } =
      await prepareUITestingWrapper({
        addStage: addStageMockFn,
      })
    const menuTrigger = (await findAllByTestId('stage-menu-trigger'))[0]
    await fireEvent.click(menuTrigger)
    let addStageItem = await findByText('Add stage')
    await fireEvent.click(addStageItem)
    await waitFor(() => {
      expect(getByTestId('stage-header-form')).toBeVisible()
    })
    const cancelIcon = await findByTestId('stage-header-form-cancel')
    await fireEvent.click(cancelIcon)

    await fireEvent.click(menuTrigger)
    addStageItem = await findByText('Add stage')
    await fireEvent.click(addStageItem)
    await waitFor(() => {
      expect(getByTestId('stage-header-form')).toBeVisible()
    })
    const stageFormMenuTrigger = await findByTestId('stage-header-form-menu')
    await fireEvent.click(stageFormMenuTrigger)
    const stageFormMenuIcon = (await findAllByTestId('stage-header-form-menu-icon'))[0]
    await fireEvent.click(stageFormMenuIcon)
    const stageFormMenuColor = (await findAllByTestId('stage-header-form-menu-color'))[0]
    await fireEvent.click(stageFormMenuColor)
    const stageFormNameInput = await findByPlaceholderText('Name')
    await fireEvent.update(stageFormNameInput, 'new stage')
    const saveIcon = await findByTestId('stage-header-form-save')
    await fireEvent.submit(saveIcon)
    expect(addStageMockFn).toHaveBeenCalled()
    expect(addStageMockFn.mock.calls[0][0]).toEqual(
      expect.objectContaining({ color: '#0f766e', icon: 'note', name: 'new stage' }),
    )
  })
  it('add Stage Proxy functions', async () => {
    const [, state, mutation] = await prepareProviderTestingWrapper()
    expect(() => mutation?.addDraftStage('1')).not.toThrow()
    const draft = state.value.stagesForView.customs[0]
    expect(draft).toEqual(expect.objectContaining({ color: '#0f766e', icon: 'preview', name: '' }))
    expect(() => mutation?.removeDraftStage(draft.draftId)).not.toThrow()
    mutation?.addDraftStage('1')
    await expect(mutation?.addStage(state.value.stagesForView.customs[0])).resolves.toBeUndefined()
  })
  // test('Delete Stage', async () => {
  //   const removeStageMockFn = vi.fn()
  //   const { getAllByTestId, findByText, queryByText } = await prepareUITestingWrapper({
  //     removeStage: removeStageMockFn,
  //   })
  //   await waitFor(() => {
  //     expect(getAllByTestId('stage-menu-trigger')?.[1]).toBeVisible()
  //   })
  //   const menuTrigger = getAllByTestId('stage-menu-trigger')[1]
  //   await fireEvent.click(menuTrigger)
  //   const deleteStageItem = await findByText('Delete stage')
  //   await fireEvent.click(deleteStageItem)
  //   const deleteButton = await findByText('Delete')
  //   await fireEvent.click(deleteButton)
  //   await waitForElementToBeRemoved(() => queryByText('Delete'))
  //   await waitFor(() => {
  //     expect(removeStageMockFn).toHaveBeenCalled()
  //   })
  // })
  // test('Delete Stage Proxy functions', async () => {
  //   const [, state, mutation] = await prepareProviderTestingWrapper()
  //   const { id } = state.value.stagesForView.customs[0]
  //   await expect(mutation?.removeStage(id)).resolves.toBeUndefined()
  // })
  // test(
  //   'DnD Card -> Stage sorting',
  //   async () => {
  //     const [{ getByTestId, getAllByTestId, getAllByText, queryByTestId, queryAllByTestId }] =
  //       await prepareProviderTestingWrapper()
  //     await waitFor(
  //       () => {
  //         expect(getAllByText('TOA-Draft')).toHaveLength(2)
  //       },
  //       { timeout: 6 * 1000 }
  //     )
  //     await waitFor(() => {
  //       expect(getAllByText('10/05/22 @ 17:19 PM')).toHaveLength(2)
  //     })

  //     let draggingItemPosition: DOMRect | undefined
  //     const _getBoundingClientRect = HTMLElement.prototype.getBoundingClientRect
  //     HTMLElement.prototype.getBoundingClientRect = (() => {
  //       return function (this: HTMLElement): DOMRect {
  //         if (this.hasAttribute('data-testId') && this.getAttribute('data-testId') === 'dragging-item') {
  //           const result = draggingItemPosition
  //           if (result) return result
  //         }

  //         const path = getDomPath(this)
  //         const temp = mockKanbanLayout[path] as DOMRect
  //         // const temp = mockKanbanLayoutForSingleCase[path] as DOMRect
  //         return temp || _getBoundingClientRect.call(this)
  //       }
  //     })()
  //     setupLayout(document.body)

  //     const draggingItem = getAllByTestId('dragging-item')[1]
  //     const draggedSourceCard = getAllByTestId('draggable-card')[1]
  //     draggingItemPosition = draggedSourceCard.getBoundingClientRect()
  //     draggingItem.clientWidth = draggingItemPosition?.width
  //     draggingItem.clientHeight = draggingItemPosition?.height
  //     await fireEvent(
  //       draggedSourceCard,
  //       Object.assign(createEvent.mouseDown(draggedSourceCard, {}), getElementCenter(draggedSourceCard))
  //     )
  //     await waitFor(() => {
  //       expect(getByTestId('dragging-card')).toBeVisible()
  //     })
  //     await new Promise((resolve) => setTimeout(resolve, 100))

  //     const referenceDom = getAllByTestId('draggable-card')[0]
  //     setupLayout(referenceDom)
  //     draggingItemPosition = referenceDom.getBoundingClientRect()
  //     if (draggingItemPosition) {
  //       Object.assign(draggingItemPosition, {
  //         x: draggingItemPosition.x - 10,
  //         y: draggingItemPosition.y - 10,
  //         left: draggingItemPosition.left - 10,
  //         top: draggingItemPosition.top - 10,
  //       })
  //     }
  //     const temp = getElementCenter(referenceDom)
  //     const nextMousePosition = { x: temp.x - 10, y: temp.y - 10 }
  //     await fireEvent(document.body, Object.assign(createEvent.mouseMove(document.body, {}), nextMousePosition))
  //     await waitFor(() => {
  //       expect(getAllByText('Reviewed')).toHaveLength(3)
  //     })

  //     await fireEvent(document.body, Object.assign(createEvent.mouseUp(document.body, {}), nextMousePosition))
  //     await waitFor(() => {
  //       const firstCard = queryAllByTestId('draggable-card')[0]
  //       expect(firstCard?.id).toEqual('card-158')
  //     })
  //     await new Promise((resolve) => setTimeout(resolve, 100))
  //     await waitFor(() => {
  //       const firstCard = queryAllByTestId('draggable-card')[0]
  //       expect(firstCard?.id).toEqual('card-158')
  //     })
  //   },
  //   15 * 1000
  // )
  // test(
  //   'DnD Card -> Stage change to another stage',
  //   async () => {
  //     const [{ getByTestId, getAllByTestId, getAllByText, queryByTestId, queryAllByTestId }] =
  //       await prepareProviderTestingWrapper()
  //     await waitFor(
  //       () => {
  //         expect(getAllByText('TOA-Draft')).toHaveLength(2)
  //       },
  //       { timeout: 6 * 1000 }
  //     )
  //     await waitFor(() => {
  //       expect(getAllByText('10/05/22 @ 17:19 PM')).toHaveLength(2)
  //     })

  //     let draggingItemPosition: DOMRect | undefined
  //     const _getBoundingClientRect = HTMLElement.prototype.getBoundingClientRect
  //     HTMLElement.prototype.getBoundingClientRect = (() => {
  //       return function (this: HTMLElement): DOMRect {
  //         if (this.hasAttribute('data-testId') && this.getAttribute('data-testId') === 'dragging-item') {
  //           const result = draggingItemPosition
  //           if (result) return result
  //         }

  //         const path = getDomPath(this)
  //         const temp = mockKanbanLayout[path] as DOMRect
  //         // const temp = mockKanbanLayoutForSingleCase[path] as DOMRect
  //         return temp || _getBoundingClientRect.call(this)
  //       }
  //     })()
  //     setupLayout(document.body)

  //     const draggingItem = getAllByTestId('dragging-item')[1]
  //     const draggedSourceCard = getAllByTestId('draggable-card')[1]
  //     draggingItemPosition = draggedSourceCard.getBoundingClientRect()
  //     draggingItem.clientWidth = draggingItemPosition?.width
  //     draggingItem.clientHeight = draggingItemPosition?.height
  //     await fireEvent(
  //       draggedSourceCard,
  //       Object.assign(createEvent.mouseDown(draggedSourceCard, {}), getElementCenter(draggedSourceCard))
  //     )
  //     await waitFor(() => {
  //       expect(getByTestId('dragging-card')).toBeVisible()
  //     })
  //     await new Promise((resolve) => setTimeout(resolve, 100))

  //     const referenceDom = getAllByTestId('draggable-list')[0]
  //     setupLayout(referenceDom)
  //     draggingItemPosition = referenceDom.getBoundingClientRect()
  //     if (draggingItemPosition) {
  //       Object.assign(draggingItemPosition, {
  //         x: draggingItemPosition.x - 10,
  //         y: draggingItemPosition.y - 10,
  //         left: draggingItemPosition.left - 10,
  //         top: draggingItemPosition.top - 10,
  //       })
  //     }
  //     const temp = getElementCenter(referenceDom)
  //     const nextMousePosition = { x: temp.x - 10, y: temp.y - 10 }
  //     await fireEvent(document.body, Object.assign(createEvent.mouseMove(document.body, {}), nextMousePosition))
  //     await waitFor(() => {
  //       expect(getAllByText('Drafts')).toHaveLength(2)
  //     })

  //     await fireEvent(document.body, Object.assign(createEvent.mouseUp(document.body, {}), nextMousePosition))
  //     await new Promise((resolve) => setTimeout(resolve, 1000))
  //     await waitFor(() => {
  //       const draftList = getAllByTestId('draggable-list')[0]
  //       const draggingCard = queryByTestId('card-158')
  //       expect(draftList).toContainElement(draggingCard)
  //     })
  //     await new Promise((resolve) => setTimeout(resolve, 100))
  //     await waitFor(() => {
  //       const draftList = getAllByTestId('draggable-list')[0]
  //       const draggingCard = queryByTestId('card-158')
  //       expect(draftList).toContainElement(draggingCard)
  //     })
  //   },
  //   15 * 1000
  // )
})

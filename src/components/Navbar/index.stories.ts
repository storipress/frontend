/* eslint-disable no-console */
import type { EventClickStepDataInterface, SearchDataInterface } from './definition'
import ManagerNavbar from './index'

export default {
  title: 'App Shell/Navbars',
}

export function Default() {
  return {
    components: { ManagerNavbar },
    template: `
    <ManagerNavbar
      v-model:searchValue="searchValue"
      :workspace="{ id: 'workspaceId', name: 'New York Times', domain: 'nytimes.com' }"
      :highlightLink="'Articles'"
      :placeholder="'Search articles…'"
      :guideProgress="[true, false, false, false, false]"
      :workspaceList="[
        { id: 'ID_1', name: 'New York Times', domain: 'nytimes.com' },
        { id: 'ID_2', name: 'test publication', domain: 'testpublication.storipress.app' },
        { id: 'ID_3', name: 'test publication 2', domain: 'testpublication2.storipress.app' },
        { id: 'ID_4', name: 'test publication 3', domain: 'testpublication3.storipress.app' },
        { id: 'ID_5', name: 'test publication 4', domain: 'testpublication4.storipress.app' },
      ]"
      :userInfo="{ name: 'Jessica Simpson', avatarSrc: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png' }"
      @update:searchValue="handleChangeSearchValue"
      @clickStep="handleClickStep"
    />
    <div>
      Search:
      <br/>
      <pre>
        text: {{searchValue.text}}
        range: {{searchValue?.range?.[0]}} - {{searchValue?.range?.[1]}}
        people: {{searchValue?.people?.map(person => person.full_name).join(',')}}
        tags: {{searchValue?.tags?.map(tag => tag.name).join(',')}}
      </pre>
    </div>
  `,
    data() {
      return {
        searchValue: {
          text: '123',
        },
      }
    },
    methods: {
      handleChangeSearchValue(data: SearchDataInterface) {
        console.log('changeSearchValue', {
          text: data.text,
          people: data.people,
          tags: data.tags,
          range: data.range,
        })
      },
      handleClickStep(data: EventClickStepDataInterface) {
        console.log('clickStep', {
          index: data.index,
          text: data.text,
          checked: data.checked,
        })
      },
    },
  }
}

import htm from 'htm'
import { h } from 'dom-chef'

import style from './cursor.module.scss'

const html = htm.bind(h)

/**
 *
 * @param {import('../api').EditorUser} param0
 * @param {*} h
 * @returns {HTMLElement}
 */
export function renderCursor({ name, avatar, color }) {
  return html`<span className=${style.userCursor} style=${{ '--bg-color': color }}>
    <div className=${style.userCursorContainer}>
      <div className=${style.userAvatar}>
        <img src=${avatar} />
      </div>
      <div className=${style.userName}>
        <div>${name}</div>
      </div>
    </div>
  </span>`
}

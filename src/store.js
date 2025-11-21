import { legacy_createStore as createStore } from 'redux'

let persistedSidebar = null
try {
  const v = localStorage.getItem('sidebarShow')
  if (v !== null) persistedSidebar = v === 'true'
} catch (e) {
  // ignore (e.g., during server-side rendering or tests)
}

const initialState = {
  sidebarShow: persistedSidebar !== null ? persistedSidebar : true,
  theme: 'light',
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      const next = { ...state, ...rest }
      try {
        if (typeof next.sidebarShow !== 'undefined') {
          localStorage.setItem('sidebarShow', next.sidebarShow ? 'true' : 'false')
        }
      } catch (e) {
        // ignore storage errors
      }
      return next
    default:
      return state
  }
}

const store = createStore(changeState)
export default store

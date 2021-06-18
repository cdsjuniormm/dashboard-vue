import useStore from '../hooks/useStore'
import { clearCurrentUser, resetUserStore, setCurrentUser, setApiKey } from './user'

describe('UserStore', () => {
  afterEach(() => {
    resetUserStore()
  })

  it('should set current user', async () => {
    const store = useStore()
    setCurrentUser({ name: 'Igor' })
    expect(store.User.currentUser.name).toBe('Igor')
  })

  it('should set api_key on current user', () => {
    const store = useStore()
    setApiKey('123')
    expect(store.User.currentUser.apiKey).toBe('123')
  })

  it('should clean current user', () => {
    const store = useStore()
    setCurrentUser({ name: 'Igor' })
    expect(store.User.currentUser.name).toBe('Igor')
    clearCurrentUser()
    expect(store.User.currentUser.name).toBeFalsy()
  })
})

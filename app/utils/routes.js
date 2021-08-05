import Home from '../components/home/home'
import LoginMenu from '../components/loginMenu/loginMenu'

/**
 * Declare routes for components.
 */
const routes = [
  {
    path: '/',
    exact: true,
    component: LoginMenu
  },
  {
    path: '/home',
    exact: true,
    component: Home
  },
]
export default routes

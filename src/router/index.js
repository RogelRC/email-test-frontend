import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import EmailView from '../views/EmailView.vue'
import LoginForm from '../components/LoginForm.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginForm,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/emails',
    name: 'Emails',
    component: EmailView,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.role === 'admin' ? '/dashboard' : '/emails';
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.role === 'admin' ? '/dashboard' : '/emails';
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard
router.beforeEach((to, from, next) => {
  console.log('Navigation from', from.path, 'to', to.path);
  const isAuthenticated = document.cookie.includes('auth_token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  console.log('Auth status:', { isAuthenticated, userRole: user.role });
  
  // Redirect to login if route requires authentication and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('Redirecting to login - not authenticated');
    return next('/login');
  }
  
  // Redirect to appropriate dashboard if user is authenticated and tries to access login page
  if (to.path === '/login' && isAuthenticated) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const redirectPath = user.role === 'admin' ? '/dashboard' : '/emails';
    console.log(`Redirecting to ${redirectPath} - already authenticated`);
    return next(redirectPath);
  }
  
  // Check role-based access
  if (to.meta.roles && !to.meta.roles.includes(user.role)) {
    console.log('Role check failed - redirecting based on role');
    // Redirect to a default route if user doesn't have required role
    return next(user.role === 'user' ? '/mail' : '/dashboard');
  }
  
  console.log('Navigation allowed');
  next();
})

export default router

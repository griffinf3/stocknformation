import Home from './components/Home.jsx';
import SearchPage from './components/SearchPage.jsx';
import About from './components/About.jsx';
import Parent from './components/Parent.jsx';

const routes = {
  // base component (wrapper for the whole application).
  component: Parent,
  childRoutes: [
    {
      path: '/',
      component: Home
    },

    {
      path: '/search',
      component: SearchPage
    },
      
    {
      path: '/about',
      component: About
    }

  ]
};

export default routes;

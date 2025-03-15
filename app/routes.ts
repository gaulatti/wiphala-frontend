import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('./layouts/private.tsx', [
    index('pages/dashboard.tsx'),
    route('/playlists', 'pages/playlists/list.tsx'),
    route('/playlists/:slug', 'pages/playlists/detail.tsx'),
    route('/strategies', 'pages/strategies/list.tsx'),
    route('/strategies/:slug', 'pages/strategies/detail.tsx'),
    route('/logout', './pages/auth/logout.tsx'),
  ]),
  route('/login', './pages/auth/login.tsx'),
] satisfies RouteConfig;

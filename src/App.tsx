/**
 * Root application component.
 * Renders the router which handles all page rendering through MainLayout.
 */

import { RouterProvider } from 'react-router';
import { router } from '@/router';

function App() {
  return <RouterProvider router={router} />;
}

export default App;

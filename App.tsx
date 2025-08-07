import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AppNavigation } from './src/navigations/AppNavigation';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <Provider store={store}>
      <AppNavigation />;
    </Provider>
  );
}

export default App;

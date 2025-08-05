import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { StyleSheet } from 'react-native';
import { AppNavigation } from './src/navigations/AppNavigation';

const Tab = createBottomTabNavigator();

function App() {
  return <AppNavigation />;
}

export default App;

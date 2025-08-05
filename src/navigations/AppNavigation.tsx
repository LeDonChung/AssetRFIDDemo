import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import {
  NavigationContainer,
  useLinkBuilder,
  useTheme,
} from '@react-navigation/native';
import { Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SettingScreen } from '../screens/SettingScreen';
import { InventoryScreen } from '../screens/InventoryScreen';
import { IdentificationScreen } from '../screens/IdentificationScreen';
import { AlertModeScreen } from '../screens/AlertModeScreen';

const MyTabBar = ({ state, descriptors, navigation }) => {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();
  const getIconName = (routeName: string, focused: boolean) => {
    switch (routeName) {
      case 'setting':
        return focused ? 'settings' : 'settings-outline';
      case 'inventory':
        return focused ? 'list' : 'list-outline';
      case 'identification':
        return focused ? 'person' : 'person-outline';
      case 'alertMode':
        return focused ? 'alert' : 'alert-outline';
      default:
        return 'ellipse';
    }
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.background,
        padding: 5,
      }}
    >
      {state.routes.map(
        (
          route: { key: string; name: string; params?: object },
          index: number,
        ) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <PlatformPressable
              href={buildHref(route.name, route.params)}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1, alignItems: 'center' }}
            >
              <Ionicons
                name={getIconName(route.name, isFocused)}
                size={24}
                color={isFocused ? colors.primary : colors.text}
              />
              <Text
                style={{
                  color: isFocused ? colors.primary : colors.text,
                  fontSize: 12,
                }}
              >
                {label}
              </Text>
            </PlatformPressable>
          );
        },
      )}
    </View>
  );
};
const Tab = createBottomTabNavigator();

export const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={props => <MyTabBar {...props} />}
        screenOptions={{ headerShown: false }}
        initialRouteName="setting"
        backBehavior="history"
      >
        <Tab.Screen name="setting" component={SettingScreen} />
        <Tab.Screen name="inventory" component={InventoryScreen} />
        <Tab.Screen name="identification" component={IdentificationScreen} />
        <Tab.Screen name="alertMode" component={AlertModeScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

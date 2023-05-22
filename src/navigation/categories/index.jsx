import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { theme } from '../../constants';
import { Categories } from '../../screens';

const Stack = createNativeStackNavigator();

const CategoriesNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Categories"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.terciary,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontFamily: 'Josefin-Bold',
        },
      }}>
      <Stack.Screen name="Categories" component={Categories} />
    </Stack.Navigator>
  );
};

export default CategoriesNavigator;
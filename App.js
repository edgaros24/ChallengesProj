import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChallengesScreen from './Screens/ChallengesScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Challenges">
        <Stack.Screen name="Challenges" component={ChallengesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
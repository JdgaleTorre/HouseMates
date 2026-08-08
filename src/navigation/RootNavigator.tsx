import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { useHouseContext } from '../context/HouseContext';
import CreateHouseScreen from '../screens/CreateHouseScreen';
import HouseGateScreen from '../screens/HouseGateScreen';
import JoinHouseScreen from '../screens/JoinHouseScreen';
import LoginScreen from '../screens/LoginScreen';
import NeedsListScreen from '../screens/NeedsListScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" />
    </View>
  );
}

export default function RootNavigator() {
  const { user, loading: authLoading } = useAuth();
  const { currentHouseId, loading: houseLoading } = useHouseContext();

  if (authLoading || (user && houseLoading)) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Sign in' }} />
        ) : !currentHouseId ? (
          <>
            <Stack.Screen name="HouseGate" component={HouseGateScreen} options={{ title: 'Your house' }} />
            <Stack.Screen name="CreateHouse" component={CreateHouseScreen} options={{ title: 'Create house' }} />
            <Stack.Screen name="JoinHouse" component={JoinHouseScreen} options={{ title: 'Join house' }} />
          </>
        ) : (
          <Stack.Screen name="NeedsList" component={NeedsListScreen} options={{ title: 'Needs list' }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

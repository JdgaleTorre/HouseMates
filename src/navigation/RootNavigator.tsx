import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import CreateHouseScreen from '../screens/CreateHouseScreen';
import HousesScreen from '../screens/HousesScreen';
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

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ title: 'HouseMates' }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Houses" component={HousesScreen} />
            <Stack.Screen name="CreateHouse" component={CreateHouseScreen} options={{ title: 'Create house' }} />
            <Stack.Screen name="JoinHouse" component={JoinHouseScreen} options={{ title: 'Join house' }} />
            <Stack.Screen name="NeedsList" component={NeedsListScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import CleaningConfigScreen from '../screens/CleaningConfigScreen';
import CleaningScreen from '../screens/CleaningScreen';
import CreateHouseScreen from '../screens/CreateHouseScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import HouseDashboardScreen from '../screens/HouseDashboardScreen';
import HousesScreen from '../screens/HousesScreen';
import JoinHouseScreen from '../screens/JoinHouseScreen';
import LoginScreen from '../screens/LoginScreen';
import MembersScreen from '../screens/MembersScreen';
import NeedsListScreen from '../screens/NeedsListScreen';
import SectionsScreen from '../screens/SectionsScreen';
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
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit profile' }} />
            <Stack.Screen name="CreateHouse" component={CreateHouseScreen} options={{ title: 'Create house' }} />
            <Stack.Screen name="JoinHouse" component={JoinHouseScreen} options={{ title: 'Join house' }} />
            <Stack.Screen name="HouseDashboard" component={HouseDashboardScreen} />
            <Stack.Screen name="NeedsList" component={NeedsListScreen} options={{ title: 'Needs list' }} />
            <Stack.Screen name="Members" component={MembersScreen} options={{ title: 'Members' }} />
            <Stack.Screen name="Sections" component={SectionsScreen} options={{ title: 'Sections' }} />
            <Stack.Screen name="Cleaning" component={CleaningScreen} options={{ title: 'Cleaning' }} />
            <Stack.Screen
              name="CleaningConfig"
              component={CleaningConfigScreen}
              options={{ title: 'Configure cleaning' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

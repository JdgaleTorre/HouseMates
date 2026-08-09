import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AccountMenu from '../components/AccountMenu';
import HouseActionTile from '../components/HouseActionTile';
import HouseCard from '../components/HouseCard';
import { useAuth } from '../context/AuthContext';
import { useUserHouses } from '../hooks/useUserHouses';
import { RootStackParamList } from '../navigation/types';
import { House } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Houses'>;

export default function HousesScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  const { houses, loading } = useUserHouses(user?.uid ?? null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={() => setMenuVisible(true)} hitSlop={8}>
          <Ionicons name="menu-outline" size={24} color="#0f172a" />
        </Pressable>
      ),
    });
  }, [navigation]);

  function renderHouse({ item }: { item: House }) {
    return <HouseCard house={item} onPress={() => navigation.navigate('HouseDashboard', { houseId: item.id })} />;
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <View className="flex-1 gap-4 px-6 pt-4">
        <Text className="text-2xl font-bold text-slate-900">Your houses</Text>

        <View className="flex-row gap-3">
          <HouseActionTile
            label="Create house"
            icon="add-circle-outline"
            tone="solid"
            onPress={() => navigation.navigate('CreateHouse')}
          />
          <HouseActionTile
            label="Join house"
            icon="key-outline"
            tone="outline"
            onPress={() => navigation.navigate('JoinHouse')}
          />
        </View>

        {loading ? (
          <ActivityIndicator />
        ) : houses.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-center text-slate-500">
              You're not in a house yet. Create or join one to get started.
            </Text>
          </View>
        ) : (
          <FlatList
            data={houses}
            keyExtractor={(item) => item.id}
            renderItem={renderHouse}
            ItemSeparatorComponent={() => <View className="h-3" />}
          />
        )}
      </View>

      <AccountMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        profile={{ displayName: user?.displayName ?? null, photoURL: user?.photoURL ?? null }}
        email={user?.email ?? null}
        onEditProfile={() => navigation.navigate('EditProfile')}
        onSignOut={signOut}
      />
    </SafeAreaView>
  );
}

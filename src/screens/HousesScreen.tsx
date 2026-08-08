import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={signOut} hitSlop={8} className="flex-row items-center gap-1">
          <Ionicons name="log-out-outline" size={18} color="#94a3b8" />
          <Text className="text-base font-semibold text-slate-400">Sign out</Text>
        </Pressable>
      ),
    });
  }, [navigation, signOut]);

  function renderHouse({ item }: { item: House }) {
    return <HouseCard house={item} onPress={() => navigation.navigate('NeedsList', { houseId: item.id })} />;
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
    </SafeAreaView>
  );
}

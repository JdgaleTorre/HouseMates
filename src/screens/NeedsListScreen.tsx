import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AddItemInput from '../components/AddItemInput';
import InviteCodeBanner from '../components/InviteCodeBanner';
import ItemRow from '../components/ItemRow';
import { useAuth } from '../context/AuthContext';
import { useHouseContext } from '../context/HouseContext';
import { addItem, markItemBought } from '../firebase/items';
import { useHouse } from '../hooks/useHouse';
import { useNeedsList } from '../hooks/useNeedsList';

export default function NeedsListScreen() {
  const { user, signOut } = useAuth();
  const { currentHouseId } = useHouseContext();
  const { house, loading: houseLoading } = useHouse(currentHouseId);
  const { items, loading: itemsLoading } = useNeedsList(currentHouseId);

  if (houseLoading || !house || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  function handleAddItem(name: string) {
    if (!user) return;
    addItem(house!.id, name, user.uid, user.displayName ?? 'A roommate');
  }

  function handleMarkBought(itemId: string) {
    markItemBought(house!.id, itemId);
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <View className="flex-1 gap-4 px-6 pt-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-slate-900">{house.name}</Text>
          <Pressable onPress={signOut}>
            <Text className="font-semibold text-slate-400">Sign out</Text>
          </Pressable>
        </View>
        <InviteCodeBanner houseName={house.name} inviteCode={house.inviteCode} />
        <AddItemInput onSubmit={handleAddItem} />
        {itemsLoading ? (
          <ActivityIndicator />
        ) : items.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-slate-500">Nothing needed right now 🎉</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ItemRow item={item} onMarkBought={handleMarkBought} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

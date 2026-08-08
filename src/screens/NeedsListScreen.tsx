import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AddItemInput from '../components/AddItemInput';
import ItemRow from '../components/ItemRow';
import { useAuth } from '../context/AuthContext';
import { addItem, markItemBought } from '../firebase/items';
import { useHouse } from '../hooks/useHouse';
import { useNeedsList } from '../hooks/useNeedsList';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'NeedsList'>;

export default function NeedsListScreen({ route }: Props) {
  const { houseId } = route.params;
  const { user } = useAuth();
  const { house, loading: houseLoading } = useHouse(houseId);
  const { items, loading: itemsLoading } = useNeedsList(houseId);

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

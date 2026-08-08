import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ItemRow from '../components/ItemRow';
import NeedsItemInput from '../components/NeedsItemInput';
import { useAuth } from '../context/AuthContext';
import { addItem, deleteItem, setItemBought, toggleItemUrgent } from '../firebase/items';
import { useHouse } from '../hooks/useHouse';
import { useNeedsList } from '../hooks/useNeedsList';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'NeedsList'>;

export default function NeedsListScreen({ route }: Props) {
  const { houseId } = route.params;
  const { user } = useAuth();
  const { house, loading: houseLoading } = useHouse(houseId);
  const { items, loading: itemsLoading } = useNeedsList(houseId);

  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Purge bought items when leaving this screen. The callback's deps are
  // kept to just [houseId] -- @react-navigation/core's useFocusEffect fires
  // this cleanup whenever the memoized callback's identity changes, not
  // only on a true blur, so including `items` here would purge bought items
  // the moment the list updates for any reason while still on the screen.
  // Reading the latest items via a ref avoids that while still cleaning up
  // stale closures correctly on real navigation-away.
  useFocusEffect(
    useCallback(() => {
      return () => {
        itemsRef.current.filter((item) => item.bought).forEach((item) => deleteItem(houseId, item.id));
      };
    }, [houseId])
  );

  if (houseLoading || !house || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  function handleAddItem(name: string, urgent: boolean) {
    if (!user) return;
    addItem(house!.id, name, user.uid, user.displayName ?? 'A roommate', urgent);
  }

  function handleSetBought(itemId: string, bought: boolean) {
    setItemBought(house!.id, itemId, bought);
  }

  function handleToggleUrgent(itemId: string, urgent: boolean) {
    toggleItemUrgent(house!.id, itemId, urgent);
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <View className="flex-1 gap-4 px-6 pt-4">
        <NeedsItemInput onSubmit={handleAddItem} />
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
            renderItem={({ item }) => (
              <ItemRow item={item} onSetBought={handleSetBought} onToggleUrgent={handleToggleUrgent} />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

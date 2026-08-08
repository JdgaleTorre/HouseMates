import { Pressable, Text, View } from 'react-native';

import { NeedsItem } from '../types';

interface ItemRowProps {
  item: NeedsItem;
  onMarkBought: (itemId: string) => void;
}

export default function ItemRow({ item, onMarkBought }: ItemRowProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-slate-100 py-3">
      <View>
        <Text className="text-base text-slate-900">{item.name}</Text>
        <Text className="text-xs text-slate-400">Added by {item.createdByName}</Text>
      </View>
      <Pressable onPress={() => onMarkBought(item.id)} className="rounded-full bg-green-100 px-3 py-1.5">
        <Text className="font-semibold text-green-700">Got it</Text>
      </Pressable>
    </View>
  );
}

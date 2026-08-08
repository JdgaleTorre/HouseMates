import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { NeedsItem } from '../types';

interface ItemRowProps {
  item: NeedsItem;
  onSetBought: (itemId: string, bought: boolean) => void;
  onToggleUrgent: (itemId: string, urgent: boolean) => void;
}

export default function ItemRow({ item, onSetBought, onToggleUrgent }: ItemRowProps) {
  const addedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <View className="flex-row items-center justify-between border-b border-slate-100 py-3">
      <View className="flex-1 flex-row items-center gap-2">
        <Pressable onPress={() => onToggleUrgent(item.id, !item.urgent)} hitSlop={8} className="p-1">
          <Ionicons name={item.urgent ? 'flag' : 'flag-outline'} size={20} color={item.urgent ? '#ef4444' : '#94a3b8'} />
        </Pressable>
        <View className="flex-1">
          <Text className={`text-base ${item.bought ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
            {item.name}
          </Text>
          <Text className="text-xs text-slate-400">
            Added by {item.createdByName} · {addedDate}
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() => onSetBought(item.id, !item.bought)}
        className={`rounded-full px-3 py-1.5 ${item.bought ? 'bg-slate-100' : 'bg-green-100'}`}
      >
        <Text className={`font-semibold ${item.bought ? 'text-slate-500' : 'text-green-700'}`}>
          {item.bought ? 'Undo' : 'Got it'}
        </Text>
      </Pressable>
    </View>
  );
}

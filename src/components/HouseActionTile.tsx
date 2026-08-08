import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, Text } from 'react-native';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface HouseActionTileProps {
  label: string;
  icon: IoniconName;
  onPress: () => void;
  tone?: 'solid' | 'outline';
}

export default function HouseActionTile({ label, icon, onPress, tone = 'solid' }: HouseActionTileProps) {
  const isSolid = tone === 'solid';
  return (
    <Pressable
      onPress={onPress}
      className={`h-28 flex-1 items-center justify-center gap-2 rounded-2xl px-3 ${
        isSolid ? 'bg-blue-600' : 'border-2 border-blue-600 bg-white'
      }`}
    >
      <Ionicons name={icon} size={28} color={isSolid ? '#ffffff' : '#2563eb'} />
      <Text className={`text-sm font-semibold ${isSolid ? 'text-white' : 'text-blue-600'}`}>{label}</Text>
    </Pressable>
  );
}

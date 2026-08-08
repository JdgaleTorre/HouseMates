import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { House } from '../types';

interface HouseCardProps {
  house: House;
  onPress: () => void;
}

export default function HouseCard({ house, onPress }: HouseCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
    >
      <View className="h-11 w-11 items-center justify-center rounded-full bg-blue-100">
        <Ionicons name="home" size={22} color="#2563eb" />
      </View>
      <Text className="flex-1 text-base font-semibold text-slate-900" numberOfLines={1}>
        {house.name}
      </Text>
      <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
    </Pressable>
  );
}

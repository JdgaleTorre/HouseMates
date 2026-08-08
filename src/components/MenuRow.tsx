import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface MenuRowProps {
  label: string;
  icon: IoniconName;
  onPress: () => void;
}

export default function MenuRow({ label, icon, onPress }: MenuRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
    >
      <View className="h-11 w-11 items-center justify-center rounded-full bg-blue-100">
        <Ionicons name={icon} size={22} color="#2563eb" />
      </View>
      <Text className="flex-1 text-base font-semibold text-slate-900">{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
    </Pressable>
  );
}

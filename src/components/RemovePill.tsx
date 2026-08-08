import { Pressable, Text } from 'react-native';

interface RemovePillProps {
  onPress: () => void;
  label?: string;
}

export default function RemovePill({ onPress, label = 'Remove' }: RemovePillProps) {
  return (
    <Pressable onPress={onPress} className="rounded-full bg-red-100 px-3 py-1.5">
      <Text className="font-semibold text-red-700">{label}</Text>
    </Pressable>
  );
}

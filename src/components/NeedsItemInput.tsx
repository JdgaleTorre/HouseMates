import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

interface NeedsItemInputProps {
  onSubmit: (name: string, urgent: boolean) => void;
}

export default function NeedsItemInput({ onSubmit }: NeedsItemInputProps) {
  const [name, setName] = useState('');
  const [urgent, setUrgent] = useState(false);

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed, urgent);
    setName('');
    setUrgent(false);
  }

  return (
    <View className="flex-row items-center gap-2">
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="What does the house need?"
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
        className="h-12 min-w-0 flex-1 rounded-xl border border-slate-300 px-4 text-base"
      />
      <Pressable
        onPress={() => setUrgent((u) => !u)}
        hitSlop={8}
        className={`h-12 w-12 items-center justify-center rounded-xl border ${urgent ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-white'}`}
      >
        <Ionicons name={urgent ? 'flag' : 'flag-outline'} size={20} color={urgent ? '#ef4444' : '#94a3b8'} />
      </Pressable>
      <Pressable
        onPress={handleSubmit}
        disabled={!name.trim()}
        className={`h-12 items-center justify-center rounded-xl border border-blue-600 bg-blue-600 px-4 ${!name.trim() ? 'opacity-50' : ''}`}
      >
        <Text className="text-base font-semibold text-white">Add</Text>
      </Pressable>
    </View>
  );
}

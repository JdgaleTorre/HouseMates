import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

interface AddItemInputProps {
  onSubmit: (name: string) => void;
}

export default function AddItemInput({ onSubmit }: AddItemInputProps) {
  const [name, setName] = useState('');

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setName('');
  }

  return (
    <View className="flex-row items-center gap-2">
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="What does the house need?"
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
        className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-base"
      />
      <Pressable
        onPress={handleSubmit}
        disabled={!name.trim()}
        className={`rounded-xl bg-blue-600 px-4 py-3 ${!name.trim() ? 'opacity-50' : ''}`}
      >
        <Text className="font-semibold text-white">Add</Text>
      </Pressable>
    </View>
  );
}

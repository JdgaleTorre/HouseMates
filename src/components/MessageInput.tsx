import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

const MAX_LENGTH = 255;

interface MessageInputProps {
  onSubmit: (text: string) => void;
}

export default function MessageInput({ onSubmit }: MessageInputProps) {
  const [text, setText] = useState('');
  const remaining = MAX_LENGTH - text.length;

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText('');
  }

  return (
    <View className="gap-2">
      <View className="flex-row items-end gap-2">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Leave a message for your roommates"
          maxLength={MAX_LENGTH}
          multiline
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-base"
        />
        <Pressable
          onPress={handleSubmit}
          disabled={!text.trim()}
          className={`rounded-xl bg-blue-600 px-4 py-3 ${!text.trim() ? 'opacity-50' : ''}`}
        >
          <Text className="font-semibold text-white">Send</Text>
        </Pressable>
      </View>
      <Text className={`text-right text-xs ${remaining <= 20 ? 'text-red-500' : 'text-slate-400'}`}>
        {remaining} characters left
      </Text>
    </View>
  );
}

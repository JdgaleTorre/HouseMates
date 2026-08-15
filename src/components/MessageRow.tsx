import { Text, View } from 'react-native';

import { Message } from '../types';

interface MessageRowProps {
  message: Message;
}

export default function MessageRow({ message }: MessageRowProps) {
  const postedDate = new Date(message.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <View className="border-b border-slate-100 py-3">
      <Text className="text-xs font-semibold text-slate-500">
        {message.createdByName} · {postedDate}
      </Text>
      <Text className="text-base text-slate-900">{message.text}</Text>
    </View>
  );
}

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MessageInput from '../components/MessageInput';
import MessageRow from '../components/MessageRow';
import { useAuth } from '../context/AuthContext';
import { markMessagesRead } from '../firebase/houses';
import { addMessage } from '../firebase/messages';
import { useHouse } from '../hooks/useHouse';
import { useMessages } from '../hooks/useMessages';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Messages'>;

export default function MessagesScreen({ route }: Props) {
  const { houseId } = route.params;
  const { user } = useAuth();
  const { house, loading: houseLoading } = useHouse(houseId);
  const { messages, loading: messagesLoading } = useMessages(houseId);

  useEffect(() => {
    if (!user) return;
    markMessagesRead(houseId, user.uid);
  }, [houseId, user]);

  if (houseLoading || !house || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  function handleAddMessage(text: string) {
    if (!user) return;
    addMessage(houseId, text, user.uid, user.displayName ?? 'A roommate');
    markMessagesRead(houseId, user.uid);
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <View className="flex-1 gap-4 px-6 pt-4">
        <MessageInput onSubmit={handleAddMessage} />
        {messagesLoading ? (
          <ActivityIndicator />
        ) : messages.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-slate-500">No messages yet.</Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(message) => message.id}
            renderItem={({ item }) => <MessageRow message={item} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

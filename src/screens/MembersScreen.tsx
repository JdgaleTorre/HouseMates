import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Alert, FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import RemovePill from '../components/RemovePill';
import { useAuth } from '../context/AuthContext';
import { removeMember } from '../firebase/houses';
import { useHouse } from '../hooks/useHouse';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Members'>;

function initials(displayName: string | null) {
  if (!displayName) return '?';
  return displayName.trim().charAt(0).toUpperCase();
}

export default function MembersScreen({ route }: Props) {
  const { houseId } = route.params;
  const { user } = useAuth();
  const { house, loading } = useHouse(houseId);

  function handleRemove(targetUid: string, name: string) {
    Alert.alert('Remove member?', `${name} will lose access to this house.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeMember(houseId, targetUid) },
    ]);
  }

  if (loading || !house || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16 }}
        data={house.memberIds}
        keyExtractor={(uid) => uid}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item: uid }) => {
          const profile = house.memberProfiles[uid];
          const name = profile?.displayName ?? 'Unknown roommate';
          const isOwner = uid === house.createdBy;
          const canRemove = !isOwner && uid !== user.uid;

          return (
            <View className="flex-row items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              {profile?.photoURL ? (
                <Image source={{ uri: profile.photoURL }} className="h-11 w-11 rounded-full" />
              ) : (
                <View className="h-11 w-11 items-center justify-center rounded-full bg-blue-100">
                  <Text className="text-base font-bold text-blue-600">{initials(profile?.displayName ?? null)}</Text>
                </View>
              )}
              <View className="flex-1">
                <Text className="text-base font-semibold text-slate-900">{name}</Text>
                {isOwner ? <Text className="text-xs text-slate-400">Owner</Text> : null}
              </View>
              {canRemove ? <RemovePill onPress={() => handleRemove(uid, name)} /> : null}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

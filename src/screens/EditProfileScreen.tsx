import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import MemberAvatar from '../components/MemberAvatar';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { updateUserDisplayInfo } from '../firebase/auth';
import { refreshMemberProfile } from '../firebase/houses';
import { ensureUserProfile } from '../firebase/users';
import { useUserHouses } from '../hooks/useUserHouses';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation }: Props) {
  const { user, refreshUser } = useAuth();
  const { houses } = useUserHouses(user?.uid ?? null);
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!user || !displayName.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const name = displayName.trim();
      await updateUserDisplayInfo(user, { displayName: name });
      refreshUser();
      await ensureUserProfile(user);
      await Promise.all(
        houses.map((house) => refreshMemberProfile(house.id, user.uid, { displayName: name, photoURL: user.photoURL }))
      );
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save changes, please try again.');
      setSubmitting(false);
    }
  }

  return (
    <View className="flex-1 items-center gap-4 bg-white px-6 pt-8">
      <MemberAvatar profile={{ displayName, photoURL: user?.photoURL ?? null }} size={96} />

      <TextInput
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Your name"
        autoCapitalize="words"
        editable={!submitting}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base"
      />

      {error ? <Text className="text-center text-red-600">{error}</Text> : null}

      <PrimaryButton
        label={submitting ? 'Saving…' : 'Save changes'}
        onPress={handleSave}
        disabled={submitting || !displayName.trim()}
      />
    </View>
  );
}

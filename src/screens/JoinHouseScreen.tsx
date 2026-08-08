import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { joinHouseByCode } from '../firebase/houses';

export default function JoinHouseScreen() {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoin() {
    if (!user || !code.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await joinHouseByCode(code.trim(), user.uid);
      // HouseContext's listener picks up the new currentHouseId and RootNavigator
      // switches to the needs list automatically -- no manual navigation here.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong, please try again.');
      setSubmitting(false);
    }
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white px-6">
      <Text className="mb-2 text-2xl font-bold text-slate-900">Join a house</Text>
      <Text className="mb-2 text-center text-slate-500">Enter the invite code a roommate shared with you.</Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="e.g. 7K3PQR"
        autoCapitalize="characters"
        autoCorrect={false}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-base tracking-widest"
      />
      {error ? <Text className="text-center text-red-600">{error}</Text> : null}
      <PrimaryButton label={submitting ? 'Joining…' : 'Join'} onPress={handleJoin} disabled={submitting || !code.trim()} />
    </View>
  );
}

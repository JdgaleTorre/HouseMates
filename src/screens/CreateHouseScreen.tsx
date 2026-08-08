import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { createHouse } from '../firebase/houses';

export default function CreateHouseScreen() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!user || !name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await createHouse(name.trim(), user.uid);
      // HouseContext's listener picks up the new currentHouseId and RootNavigator
      // switches to the needs list automatically -- no manual navigation here.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong, please try again.');
      setSubmitting(false);
    }
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white px-6">
      <Text className="mb-2 text-2xl font-bold text-slate-900">Create a house</Text>
      <Text className="mb-2 text-center text-slate-500">Give your house a name to get an invite code.</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="e.g. The Treehouse"
        autoCapitalize="words"
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base"
      />
      {error ? <Text className="text-center text-red-600">{error}</Text> : null}
      <PrimaryButton label={submitting ? 'Creating…' : 'Create'} onPress={handleCreate} disabled={submitting || !name.trim()} />
    </View>
  );
}

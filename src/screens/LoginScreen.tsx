import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';

// TODO: Apple Sign-In is required before App Store submission (App Store
// Review Guideline 4.8, since Google Sign-In is offered) -- not built yet.
export default function LoginScreen() {
  const { signInWithGoogle, signingIn, signInError } = useAuth();

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Image
          source={require('../../assets/icon.png')}
          className="h-24 w-24 rounded-3xl"
          resizeMode="cover"
        />
        <Text className="text-2xl font-bold text-slate-900">HouseMates</Text>
        <Text className="text-center text-slate-500">Sign in to see what your house needs.</Text>
        {signInError ? <Text className="text-center text-red-600">{signInError}</Text> : null}
        <PrimaryButton
          label={signingIn ? 'Signing in…' : 'Continue with Google'}
          onPress={signInWithGoogle}
          disabled={signingIn}
        />
      </View>
    </SafeAreaView>
  );
}

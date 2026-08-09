import { useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';

type Mode = 'signIn' | 'signUp';

// TODO: Apple Sign-In is required before App Store submission (App Store
// Review Guideline 4.8, since Google Sign-In is offered) -- not built yet.
export default function LoginScreen() {
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signingIn,
    signInError,
    resetEmailSent,
    clearSignInError,
  } = useAuth();

  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  function switchMode(next: Mode) {
    setMode(next);
    setValidationError(null);
    clearSignInError();
  }

  function validate(): string | null {
    if (!email.trim()) return 'Please enter your email.';
    if (!password) return 'Please enter your password.';
    if (password.length < 6) return 'Password should be at least 6 characters.';
    if (mode === 'signUp' && !displayName.trim()) return 'Please enter your name.';
    return null;
  }

  async function handleSubmit() {
    const err = validate();
    setValidationError(err);
    if (err) return;
    if (mode === 'signIn') {
      await signInWithEmail(email.trim(), password);
    } else {
      await signUpWithEmail(email.trim(), password, displayName.trim());
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setValidationError('Enter your email above first, then tap "Forgot password?".');
      return;
    }
    setValidationError(null);
    await resetPassword(email.trim());
  }

  const shownError = validationError ?? signInError;

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <Image
          source={require('../../assets/icon.png')}
          style={{ width: 96, height: 96, borderRadius: 24 }}
          resizeMode="cover"
        />
        <Text className="text-2xl font-bold text-slate-900">HouseMates</Text>
        <Text className="text-center text-slate-500">Sign in to see what your house needs.</Text>

        {mode === 'signUp' ? (
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your name"
            autoCapitalize="words"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base"
          />
        ) : null}
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          textContentType={mode === 'signUp' ? 'newPassword' : 'password'}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base"
        />

        {shownError ? <Text className="text-center text-red-600">{shownError}</Text> : null}
        {!shownError && resetEmailSent ? (
          <Text className="text-center text-green-600">Password reset email sent. Check your inbox.</Text>
        ) : null}

        <PrimaryButton
          label={signingIn ? 'Please wait…' : mode === 'signIn' ? 'Sign in' : 'Create account'}
          onPress={handleSubmit}
          disabled={signingIn}
        />

        <View className="w-full flex-row items-center justify-between">
          <Pressable onPress={() => switchMode(mode === 'signIn' ? 'signUp' : 'signIn')} hitSlop={8}>
            <Text className="text-sm font-semibold text-slate-400">
              {mode === 'signIn' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
            </Text>
          </Pressable>
          {mode === 'signIn' ? (
            <Pressable onPress={handleForgotPassword} hitSlop={8}>
              <Text className="text-sm font-semibold text-slate-400">Forgot password?</Text>
            </Pressable>
          ) : null}
        </View>

        <View className="w-full flex-row items-center gap-3">
          <View className="h-px flex-1 bg-slate-200" />
          <Text className="text-sm text-slate-400">or</Text>
          <View className="h-px flex-1 bg-slate-200" />
        </View>

        <PrimaryButton
          label={signingIn ? 'Signing in…' : 'Continue with Google'}
          onPress={signInWithGoogle}
          disabled={signingIn}
        />
      </View>
    </SafeAreaView>
  );
}

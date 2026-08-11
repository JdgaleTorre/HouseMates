import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Modal, Pressable, Share, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MenuRow from './MenuRow';

interface InviteMenuProps {
  visible: boolean;
  onClose: () => void;
  houseName: string;
  inviteCode: string;
}

export default function InviteMenu({ visible, onClose, houseName, inviteCode }: InviteMenuProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await Clipboard.setStringAsync(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleShare() {
    onClose();
    Share.share({ message: `Join "${houseName}" on HouseMates! Use invite code ${inviteCode}.` });
  }

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/30" onPress={onClose}>
        <SafeAreaView edges={['top']}>
          <Pressable onPress={() => {}} className="mx-4 mt-2 gap-4 rounded-2xl bg-white p-4 shadow-lg">
            <View>
              <Text className="text-xs uppercase tracking-wide text-slate-500">Invite code</Text>
              <Text className="text-lg font-bold tracking-widest text-slate-900">{inviteCode}</Text>
            </View>
            <View className="gap-2">
              <MenuRow label={copied ? 'Copied!' : 'Copy code'} icon="copy-outline" onPress={handleCopy} />
              <MenuRow label="Share" icon="share-outline" onPress={handleShare} />
            </View>
          </Pressable>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
}

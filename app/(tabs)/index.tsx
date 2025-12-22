import { ThemedText } from '@/components/themed-text';
import TabScreen from '@/components/ui/tabScreen';
import TopBar from '@/components/ui/topbar';
import { useAuthStore } from '@/store/useAuthStore';

export default function HomeScreen() {
  const profile = useAuthStore((state) => state.profile);
  const fullName = profile?.full_name ?? 'Atleta';
  return (
    <TabScreen renderHeader={<TopBar onPress={() => {}} fullName={fullName} />}>
      <ThemedText>Benvenuto! Questo è il tuo blocco principale.</ThemedText>
    </TabScreen>
  );
}
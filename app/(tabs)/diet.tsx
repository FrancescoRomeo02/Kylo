import { ThemedText } from '@/components/themed-text';
import TabScreen from '@/components/ui/tabScreen';

export default function DietScreen() {
  return (
    <TabScreen title="La tua Dieta">
      <ThemedText>Benvenuto! Questo è il tuo blocco principale.</ThemedText>
    </TabScreen>
  );
}
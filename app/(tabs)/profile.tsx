import { ThemedText } from '@/components/themed-text';
import TabScreen from '@/components/ui/tabScreen';
import { supabase } from '@/lib/supabase';
import { Button } from '@react-navigation/elements';


export default function ProfileScreen() {
  return (
    <TabScreen title="Il tuo Profilo">
      <ThemedText>Benvenuto! Questo è il tuo blocco principale.</ThemedText>
      <Button onPress={() => {
        supabase.auth.signOut();
      }}> Logout</Button>
    </TabScreen>
  );
}
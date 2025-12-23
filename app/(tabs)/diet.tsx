import DietSetup from '@/components/pages/dietSetup';
import DietView from '@/components/pages/dietView';
import { ThemedText } from '@/components/themed-text';
import TabScreen from '@/components/ui/tabScreen';
import TopBar from '@/components/ui/topbar';
import { getDietByUserId, insertDiet } from '@/lib/api/deiet';
import { Diet } from '@/lib/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect, useState } from 'react';
import { View } from 'react-native';



export default function DietScreen() {
  const profile = useAuthStore((state) => state.profile);
  const userId = profile?.id ?? null;
  const fullName = profile?.full_name ?? 'Atleta';

  const [diet, setDiet] = useState<Diet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchDiet();
    }
  }, [userId]);

  const fetchDiet = async () => {
    try {
      const fetchedDiet = await getDietByUserId(userId);
      setDiet(fetchedDiet);
    } catch (error) {
      console.error('Error fetching diet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    if (!userId) return;
    setLoading(true);
    console.log('Saving diet data:', data);
    try {
      const payload = { id: userId, ...data };
      const savedDiet = await insertDiet(payload);
      setDiet(savedDiet);
    } catch (error) {
      console.error('Error saving diet:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <TabScreen renderHeader={<TopBar onPress={() => {}} fullName={fullName} />}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText>Caricamento...</ThemedText>
        </View>
      </TabScreen>
    );
  }


  if (!diet) {
    return <DietSetup onSave={handleSave} />;
  }

  return <DietView diet={diet} />;
}
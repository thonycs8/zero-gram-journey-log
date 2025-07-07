import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileService } from '@/services/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import ProfileHeader from './ProfileHeader';
import PersonalInfoTab from './tabs/PersonalInfoTab';
import GoalsTab from './tabs/GoalsTab';
import StatsTab from './tabs/StatsTab';
import SettingsTab from './tabs/SettingsTab';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    display_name: '',
    email: '',
    age: 0,
    height: 0,
    weight: 0,
    gender: 'female',
    activity_level: 'moderate',
    goal: 'maintain',
    bio: '',
    notifications: {
      meals: true,
      progress: true,
      tips: true,
      reminders: false
    }
  });

  const [goals, setGoals] = useState({
    currentWeight: 0,
    targetWeight: 0,
    weeklyGoal: 0.5,
    calories: 2000,
    water: 2.5,
    exercise: 4
  });

  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState({
    totalCalculations: 0,
    recipesViewed: 0,
    plansCreated: 0,
    daysActive: 0,
    averageCalories: 0,
    weightLoss: 0,
    level: 1,
    totalPoints: 0
  });

  // Carrega dados do perfil
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Carrega perfil
        const profile = await ProfileService.getProfile(user.id);
        if (profile) {
          setProfileData({
            ...profileData,
            ...profile,
            notifications: profile.notifications || profileData.notifications
          });
        }

        // Carrega objetivos
        const userGoals = await ProfileService.getGoals(user.id);
        if (userGoals) {
          setGoals({
            currentWeight: userGoals.currentWeight || 0,
            targetWeight: userGoals.targetWeight || 0,
            weeklyGoal: userGoals.weeklyGoal || 0.5,
            calories: userGoals.calories || 2000,
            water: userGoals.water || 2.5,
            exercise: userGoals.exercise || 4
          });
        }

        // Carrega conquistas
        const userAchievements = await ProfileService.getAchievements(user.id);
        setAchievements(userAchievements);

        // Carrega estatísticas
        const userStats = await ProfileService.getStats(user.id);
        if (userStats) {
          setStats({
            totalCalculations: userStats.totalCalculations || 0,
            recipesViewed: userStats.recipesViewed || 0,
            plansCreated: userStats.plansCreated || 0,
            daysActive: userStats.daysActive || 0,
            averageCalories: userStats.averageCalories || 0,
            weightLoss: userStats.weightLoss || 0,
            level: userStats.level || 1,
            totalPoints: userStats.totalPoints || 0
          });
        }

      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const updatedProfile = await ProfileService.updateProfile(user.id, profileData);
      if (updatedProfile) {
        setProfileData(prev => ({ ...prev, ...updatedProfile }));
        // Mostrar toast de sucesso
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      // Mostrar toast de erro
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoals = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const updatedGoals = await ProfileService.updateGoals(user.id, goals);
      if (updatedGoals) {
        setGoals({
          currentWeight: updatedGoals.currentWeight || 0,
          targetWeight: updatedGoals.targetWeight || 0,
          weeklyGoal: updatedGoals.weeklyGoal || 0.5,
          calories: updatedGoals.calories || 2000,
          water: updatedGoals.water || 2.5,
          exercise: updatedGoals.exercise || 4
        });
        // Mostrar toast de sucesso
      }
    } catch (error) {
      console.error('Error saving goals:', error);
      // Mostrar toast de erro
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12">Carregando perfil...</div>;
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
      <ProfileHeader 
        name={profileData.display_name} 
        email={profileData.email} 
        joinDate={user?.created_at}
        level={stats.level || 1}
        totalPoints={stats.totalPoints || 0}
      />

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Pessoal</TabsTrigger>
          <TabsTrigger value="goals">Objectivos</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          <TabsTrigger value="settings">Definições</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <PersonalInfoTab 
            profileData={profileData}
            setProfileData={setProfileData}
            onSave={handleSaveProfile}
            achievements={achievements}
          />
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <GoalsTab 
            goals={goals}
            setGoals={setGoals}
            onSave={handleSaveGoals}
            stats={stats}
          />
        </TabsContent>

        <TabsContent value="stats">
          <StatsTab stats={stats} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SettingsTab 
            profileData={profileData}
            setProfileData={setProfileData}
            onSave={handleSaveProfile}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
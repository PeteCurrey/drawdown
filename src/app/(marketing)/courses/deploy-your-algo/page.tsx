import { createClient } from '@/lib/supabase/server';
import DeployAlgoPageContent from './DeployAlgoPageContent';

export default async function DeployYourAlgoPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  let accessState: 'no-auth' | 'no-access' | 'has-access' = 'no-auth';
  
  if (user) {
    // Check purchase record first
    const { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', 'deploy-your-algo')
      .single();

    if (course) {
      const { data: purchase } = await supabase
        .from('course_purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .single();
      
      if (purchase) {
        accessState = 'has-access';
      } else {
        // Check subscription tier
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();
        
        if (profile?.subscription_tier === 'floor') {
          // Auto-grant access
          await (supabase as any).rpc('grant_floor_courses', { p_user_id: user.id });
          accessState = 'has-access';
        } else {
          accessState = 'no-access';
        }
      }
    }
  }
  
  return <DeployAlgoPageContent accessState={accessState} />;
}

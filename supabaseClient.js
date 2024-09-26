import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://apelwwmjzhjbhmkbqpyp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZWx3d21qemhqYmhta2JxcHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxMTc0MzAsImV4cCI6MjAzODY5MzQzMH0.N9HMSth3yIVQw9P9VsAdvhLLObJ4etEL3MPDu52PVVo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  localStorage: AsyncStorage,
  detectSessionInUrl: false,
});

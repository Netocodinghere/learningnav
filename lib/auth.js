import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function signInWithGoogle() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
         
        });

        if (error) {
            throw error;
        }

        return { user: data.user, session: data.session };
    } catch (error) {
        console.error('Error signing in with Google:', error.message);
        return { error: error.message };
    }
}

async function signInWithTwitter() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'twitter',
        });

        if (error) {
            throw error;
        }

        return { user: data.user, session: data.session };
    } catch (error) {
        console.error('Error signing in with Twitter:', error.message);
        return { error: error.message };
    }
}

async function signInWithLinkedIn() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'linkedin_oidc',
        });

        if (error) {
            throw error;
        }

        return { user: data.user, session: data.session };
    } catch (error) {
        console.error('Error signing in with LinkedIn:', error.message);
        return { error: error.message };
    }
}

async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw error;
        }

        return { success: true };
    } catch (error) {
        console.error('Error signing out:', error.message);
        return { error: error.message };
    }
}

async function resendConfirmation(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!email || !emailRegex.test(email)) {
        return { error: 'Invalid email address' };
}
 const { error } = await supabase.auth.resend({
  type: 'signup',
  email:email,
  options: {
    emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}` || 'http://localhost:3000/',
  }
})
if (error) {
    console.error('Error sending confirmation email:', error.message);
    return { error: error.message };
} else {
    return { success: true };
}
}
export { signOut, signInWithGoogle, signInWithTwitter, signInWithLinkedIn, supabase, resendConfirmation }

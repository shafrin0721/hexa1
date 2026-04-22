// src/lib/mockApi.js
export const mockApi = {
  async getProfile(email) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock profile data
    return {
      first_name: "John",
      last_name: "Doe",
      phone: "+1 (555) 000-0000",
      dark_mode: false,
      font_size: 50,
      language: "English (US)",
      email_notif: true,
      sms_alerts: false,
      newsletter: true,
      avatar_url: null
    };
  },

  async saveProfile(profileData) {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Profile saved (mock):', profileData);
    return { success: true };
  }
};
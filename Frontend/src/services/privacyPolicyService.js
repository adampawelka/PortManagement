
export const getCurrentPolicy = async () => {
    const res = await api.get('/privacy-policy/current');
    return res.json();
  };
  
export const getPolicyHistory= async () => {
    const res = await api.get('/privacy-policy/versions');
    return res.json();
  };
  
export const updatePolicy= async (content, version) => {
    const res = await api.post('/privacy-policy', { content, version });
    return res.json();
  };
  
export const notifyUsersOfUpdate= async (policyId) => {
    const res = await api.post(`/privacy-policy/${policyId}/notify`);
    return res.json();
  };
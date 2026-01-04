
export const submitAccessRequest = async (requestData) => {
    const res = await api.post('/data-rights/access-request', requestData);
    return res.json();
  };
  
export const submitRectificationRequest = async (requestData) => {
    const res = await api.post('/data-rights/rectification-request', requestData);
    return res.json();
  };
  
export const  submitDeletionRequest = async (requestData) => {
    const res = await api.post('/data-rights/deletion-request', requestData);
    return res.json();
  };
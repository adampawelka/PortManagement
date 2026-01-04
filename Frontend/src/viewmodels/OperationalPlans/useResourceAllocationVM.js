import { ref } from "vue";
import api from "@/services/api";

export function useResourceAllocationVM() {
  const result = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchAllocation = async (params) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await api.get("/operation-plans/resource-allocation", { params });
      result.value = res.data;
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  return { result, loading, error, fetchAllocation };
}

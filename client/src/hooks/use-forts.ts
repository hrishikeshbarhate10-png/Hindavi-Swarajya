import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useForts(params?: { region?: string; search?: string }) {
  const queryKey = [api.forts.list.path, params];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.region) searchParams.append("region", params.region);
      if (params?.search) searchParams.append("search", params.search);
      
      const url = `${api.forts.list.path}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const res = await fetch(url, { credentials: "include" });
      
      if (!res.ok) throw new Error("Failed to fetch forts");
      
      const data = await res.json();
      return api.forts.list.responses[200].parse(data);
    },
  });
}

export function useFort(id: number) {
  return useQuery({
    queryKey: [api.forts.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.forts.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch fort details");
      
      const data = await res.json();
      return api.forts.get.responses[200].parse(data);
    },
    enabled: !!id,
  });
}

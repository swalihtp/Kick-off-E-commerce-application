import { useEffect, useState } from "react";
import api from "../api/axios";
export default function useDashboardAnalytics(days = 30) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api
      .get(`dashboard/analytics/?days=${days}`)
      .then(res => setData(res.data))
      .finally(() => setLoading(false));    
  }, [days]);

  return { data, loading };
}

import { useState, useEffect } from "react";
import { message } from "antd";
import { kitchenService } from "../../../models/KItchen";

export const useKitchenController = () => {
  const [loading, setLoading] = useState(false);
  const [kitchens, setKitchens] = useState([]);

  // const fetchKitchens = async () => {
  //   try {
  //     setLoading(true);

  //     const res = await kitchenService.list({ page: 1, limit: 20 });
  //     console.log("Fetched Kitchen Orders:", res?.data);

  //     setKitchens(res.data.data || []);
  //   } catch (err) {
  //     console.error("Kitchen not fetched", err);
  //     message.error("Failed to fetch kitchen orders");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchKitchens = async () => {
    try {
      setLoading(true);

      let allOrders = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const res = await kitchenService.list({ page: currentPage, limit: 50 }); 
        console.log("Fetched Kitchen Orders:", res?.data);
        console.log("API structure check", res.data);

        allOrders = [...allOrders, ...(res.data.data || [])];
        totalPages = res.data.totalPages;
        currentPage++;
      } while (currentPage <= totalPages);

      setKitchens(allOrders);
    } catch (err) {
      console.error("Kitchen not fetched", err);
      message.error("Failed to fetch kitchen orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await kitchenService.update(orderId, { status: newStatus.toLowerCase() });
      fetchKitchens();
      console.error("Status updatd", newStatus);
    } catch (err) {
      console.error("Status update failed", err);
      message.error("Failed to update kitchen order status");
    }
  };

  useEffect(() => {
    fetchKitchens();
  }, []);

  return {
    loading,
    kitchens,
    fetchKitchens,
    updateStatus,
  };
};

import { tableService } from "../../../models/qrcode";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { paymentService } from "../../../models/sales";
import { reportService } from "../../../models/Report";

export const useTableController = () => {
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]);

  const fetchTables = async () => {
  try {
    setLoading(true);
    const res = await tableService.list();

    console.log("🔍 Full QR API Response:", res);

    // const result = Array.isArray(res.data) ? res.data : [];

    const rows = res.data.data || [];
    const total = res.data?.data?.count || rows.length;

    console.log("✅ Normalized Table Result:", rows);

    setTables(rows);
  } catch (err) {
    console.error("❌ Failed to fetch QR tables", err);
    message.error("Failed to fetch QR tables");
    setTables([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchTables();
  }, []);

  return { loading, tables, fetchTables };
};


export function useDailySales() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPerDay, setTotalPerDay] = useState(0);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await paymentService.list();
        if (response.data?.success) {
          const allPayments = response.data.rows || [];
          setPayments(allPayments);
          console.log("allPayments", allPayments[0]?.status);
          const today = dayjs().format("YYYY-MM-DD");
          const todayTotal = allPayments
            .filter((p) => dayjs(p.createdAt).format("YYYY-MM-DD") === today)
            .reduce((sum, p) => sum + (p.bill_amount || 0), 0);

          setTotalPerDay(todayTotal);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return { payments, loading, totalPerDay };
}


export function useDailyPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({
    day: 0,
    week: 0,
    month: 0,
  });

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await paymentService.list();
        if (response.data?.success) {
          const allPayments = response.data.rows || [];
          setPayments(allPayments);

          console.log("second all payments", allPayments)

          const today = dayjs();
          let dayTotal = 0;
          let weekTotal = 0;
          let monthTotal = 0;

          allPayments.forEach((p) => {
            const created = dayjs(p.createdAt);
            if (created.isSame(today, "day")) dayTotal += p.bill_amount;
            if (created.isSame(today, "week")) weekTotal += p.bill_amount;
            if (created.isSame(today, "month")) monthTotal += p.bill_amount;
          });

          setTotals({ day: dayTotal, week: weekTotal, month: monthTotal });
        }
      } catch (err) {
        console.error("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return { payments, totals, loading };

  
}


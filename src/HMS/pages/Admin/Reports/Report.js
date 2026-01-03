import { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { message } from "antd";
import { reportService } from "../../../models/Report";

export default function useReportLogic() {
  const [rows, setRows] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState(dayjs().format("YYYY-MM-DD"));

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await reportService.list();
        console.log("📌 Raw API Response:", res);

        // ✅ Correct path: res.data.data
        if (Array.isArray(res.data?.data)) {
          const mapped = res.data.data.map((item) => ({
            id: nanoid(), // no id from API, generate one
            menuItem: item.item_name,
            qty: Number(item.total_quantity) || 0,
            price: Number(item.total_amount) / (Number(item.total_quantity) || 1),
            date: dayjs(item.order_day).format("YYYY-MM-DD"),
            cashReceived: Number(item.total_amount) || 0, // adjust if API gives payment info
            paymentType: "CASH", // or derive if available
            status: "Collected", // static until API provides status
          }));

          console.log("📌 Mapped Rows:", mapped);
          setRows(mapped);
        }
      } catch (err) {
        console.error("❌ Error fetching reports:", err);
        message.error("Failed to load reports");
      }
    }

    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    try {
      await reportService.delete(id);
      setRows((prev) => prev.filter((row) => row.id !== id));
      message.success("Payment deleted successfully");
    } catch (err) {
      console.error(err);
      message.error("Failed to delete payment");
    }
  };

  const calculateRowTotal = (row) => row.qty * row.price;

  const filteredRows = useMemo(() => {
    if (filterType === "all") return rows;
    const selectedDate = dayjs(filterDate);
    return rows.filter((row) => {
      const rowDate = dayjs(row.date);
      if (filterType === "daily") return rowDate.isSame(selectedDate, "day");
      if (filterType === "weekly") return rowDate.isSame(selectedDate, "week");
      if (filterType === "monthly") return rowDate.isSame(selectedDate, "month");
      return true;
    });
  }, [rows, filterType, filterDate]);

  const calculateGrandTotal = () =>
    filteredRows.reduce((sum, row) => sum + calculateRowTotal(row), 0);

  return {
    rows,
    filteredRows,
    filterType,
    filterDate,
    calculateRowTotal,
    calculateGrandTotal,
    setFilterType,
    setFilterDate,
    handleDelete,
  };
}

// import { useState, useEffect } from "react";
// import { message } from "antd";
// import { tableService } from "../../../models/Table";

// export const useTableController = () => {
//   const [loading, setLoading] = useState(false);
//   const [tables, setTables] = useState([]);
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//     total: 0,
//   });

//   const fetchTables = async () => {
//     try {
//       setLoading(true);
//       const res = await tableService.list({
//         page: pagination.current,
//         limit: pagination.pageSize,
//       });

//       console.log("API Response:", res); // Log the full API response

//       const rows = res.data?.data?.rows || res.data || [];
//       const total = res.data?.data?.count || rows.length;

//       console.log("Rows:", rows); // Log the extracted rows
//       console.log("Total Count:", total); // Log total count

//       setTables(rows);
//       setPagination((prev) => ({ ...prev, total }));
//     } catch (err) {
//       console.error("Error fetching tables:", err);
//       message.error("Failed to fetch tables");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreate = async (payload) => {
//     try {
//       await tableService.create(payload);
//       message.success("Table created successfully");
//     } catch (err) {
//       console.error(err);
//       message.error(err.response?.data?.error || "Failed to create table");
//     }
//   };

//   const handleUpdate = async (id, payload) => {
//     try {
//       await tableService.update(id, payload);
//       message.success("Table updated successfully");
//     } catch (err) {
//       console.error(err);
//       message.error(err.response?.data?.error || "Failed to update table");
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await tableService.delete(id);
//       message.success("Table deleted successfully");
//       fetchTables();
//     } catch (err) {
//       console.error(err);
//       message.error(err.response?.data?.error || "Failed to delete table");
//     }
//   };

//   useEffect(() => {
//     fetchTables();
//   }, [pagination.current, pagination.pageSize]);

//   return {
//     loading,
//     tables,
//     pagination,
//     setPagination,
//     fetchTables,
//     handleCreate,
//     handleUpdate,
//     handleDelete,
//   };
// };
import { useState, useEffect } from "react";
import { tableService } from "../../../models/Table";

export const useTableController = (messageApi) => {
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await tableService.list({
        page: pagination.current,
        limit: pagination.pageSize,
      });

      console.log("API Response:", res);

      // Correctly access the tables array
      const rows = res.data?.data || [];
      const total = res.data?.total || rows.length;

      // 🔹 Normalize is_active to boolean
      const normalizedRows = rows.map((r) => ({
        ...r,
        is_active:
          r.is_active === true ||
          r.is_active === "true" ||
          r.is_active === 1 ||
          r.is_active === "1",
      }));

      setTables(normalizedRows);
      setPagination((prev) => ({ ...prev, total }));
    } catch (err) {
      console.error("Error fetching tables:", err);
      messageApi.error("Failed to fetch tables");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (payload) => {
    try {
      const res = await tableService.create(payload);
      const newTable = res.data; // 👈 created table with id

      messageApi.success("Table created successfully");

      // Refresh list
      fetchTables();
    } catch (err) {
      console.error(err);
      messageApi.error(err.response?.data?.error || "Failed to create table");
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      await tableService.update(id, payload);
      messageApi.success("Table updated successfully");

      // 🔹 Update local table state if is_active changed
      if ("is_active" in payload) {
        setTables((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...payload } : t))
        );
      } else {
        fetchTables();
      }
    } catch (err) {
      console.error(err);
      messageApi.error(err.response?.data?.error || "Failed to update table");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await tableService.delete(id);

      // Show backend response message (soft delete success)
      messageApi.success(res.data?.message || "Table deleted successfully");

      // Refresh the table list
      fetchTables();
    } catch (err) {
      console.error(err);
      messageApi.error(err.response?.data?.error || "Failed to delete table");
    }
  };

  useEffect(() => {
    fetchTables();
  }, [pagination.current, pagination.pageSize]);

  return {
    loading,
    tables,
    pagination,
    setPagination,
    fetchTables,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};

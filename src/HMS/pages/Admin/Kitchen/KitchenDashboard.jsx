import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useKitchenController } from "../Kitchen/KitchenDashboard.js";
// import { kitchenSchema } from "../Kitchen/KitchenDashboard.js";
import dayjs from "dayjs";
import { Select } from "antd";

import {
  useTableController,
  useDailyPayments,
} from "../AdminDashboard/Dashboard.js";

const KitchenDashboard = () => {
  const { Option } = Select;

  const [filterType, setFilterType] = useState("all");

  const { kitchens, loading, updateStatus } = useKitchenController();
  const { payments } = useDailyPayments();

  const location = useLocation();
  const cart = location.state?.cart || [];

  const [sampleTables, setSampleTables] = useState([]);
  const isFirstLoad = useRef(true);

  const { tables } = useTableController();

  // Helper function to check if order is paid
  const isOrderPaid = (orderId) => {
    const payment = payments.find((p) => p.order_id === orderId);
    const status = payment?.status?.toLowerCase();
    return status === "completed" || status === "success";
  };

  const shouldHideOrder = (order) => {
    if (order.status === "served") return true;
    // if (isOrderPaid(order.id)) return true;
    return false;
  };

  const countByStatus = (status) =>
    kitchens.filter((o) => o.status === status && !isOrderPaid(o.id)).length;

  // const normalizeOrderType = (type) => {
  //   if (!type) return "";
  //   return type.toLowerCase().replace(/[_\s]/g, "-");
  // };

  // const filteredOrders = kitchens.filter((order) => {
  //   if (shouldHideOrder(order)) return false;

  //   if (filterType === "all") return true;
  //   return normalizeOrderType(order.order_type) === filterType.toLowerCase();
  // });

  // const dineInOrders = filteredOrders.filter(
  //   (order) => normalizeOrderType(order.order_type) === "dine-in"
  // );

  // const takeawayOrders = filteredOrders.filter(
  //   (order) => normalizeOrderType(order.order_type) === "takeaway"
  // );

  const filteredOrders = kitchens.filter((order) => {
    if (shouldHideOrder(order)) return false;

    // Then apply existing filter
    if (filterType === "all") return true;
    return order.order_type?.toLowerCase() === filterType.toLowerCase();
  });

  // Separate dine-in and takeaway orders
  const dineInOrders = filteredOrders.filter(
    (order) => order.order_type?.toLowerCase() === "dine-in"
  );

  const takeawayOrders = filteredOrders.filter(
    (order) => order.order_type?.toLowerCase() === "takeaway"
  );

  console.log("Tables:", tables);
  console.log("DineIn Orders:", dineInOrders);

  // Render Order Card Component
  const renderOrderCard = (order) => (
    <div
      key={order.id}
      className="border border-gray-100 rounded-lg p-3 shadow-sm bg-gray-50 space-y-2"
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold text-sm text-gray-700">
          {order.order_code}
        </span>
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            order.status === "pending"
              ? "bg-orange-100 text-orange-600"
              : order.status === "ready"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      <p className="text-xs text-gray-500">
        {dayjs(order.createdAt).format("DD-MM-YYYY HH:mm:ss")}
      </p>

      <p className="text-md text-gray-500">
        Order Type{" "}
        <span className="bg-blue-500 text-white py-1 px-2 rounded-md text-md">
          <span>{order.order_type.charAt(0).toUpperCase()}</span>
          {order.order_type.slice(1)}
        </span>
      </p>

      <p className="text-xs text-gray-600 my-4">
        Payment Status:
        <span
          className={`ml-1 px-2 py-1 rounded-lg text-xs font-medium ${(() => {
            const payment = payments.find((p) => p.order_id === order.id);
            const status = payment?.status?.toLowerCase();
            return status === "completed" || status === "success"
              ? "bg-green-100 text-green-600"
              : status === "pending"
              ? "bg-yellow-100 text-yellow-600"
              : status === "failed"
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-600";
          })()}`}
        >
          {(() => {
            const payment = payments.find((p) => p.order_id === order.id);
            return (
              payment?.status?.charAt(0).toUpperCase() +
                payment?.status?.slice(1) || "No Payment"
            );
          })()}
        </span>
      </p>

      <ul className="text-xs list-disc pl-4 text-gray-700">
        {order.items?.length > 0 ? (
          order.items.map((item, i) => (
            <li key={i}>
              {item.item_name} ×{" "}
              <span className="font-medium">{item.quantity}</span>
            </li>
          ))
        ) : (
          <li className="text-gray-400">No items</li>
        )}
      </ul>

      <div className="flex gap-2 pt-2">
        {order.status === "pending" && (
          <button
            onClick={() => updateStatus(order.id, "ready")}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-2 py-1 rounded-md text-xs font-medium transition"
          >
            Mark Ready
          </button>
        )}
        {order.status === "ready" && (
          <button
            onClick={() => updateStatus(order.id, "served")}
            className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded-md text-xs font-medium transition"
          >
            Mark Served
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen relative">
      <h1 className="text-xl font-bold text-gray-800 mb-6">
        Kitchen Dashboard
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 space-y-6 text-center">
          <h2 className="font-semibold text-lg mb-4 text-gray-700">
            📊 Live Overview
          </h2>
          <div className="bg-white shadow-lg rounded-2xl p-5 border border-gray-100">
            <div className="space-y-3 text-sm">
              {["pending", "ready"].map((status) => {
                const statusStyles = {
                  pending: {
                    bg: "bg-orange-50 border border-orange-200",
                    dot: "bg-orange-500",
                    text: "text-orange-600",
                  },
                  ready: {
                    bg: "bg-yellow-50 border border-yellow-200",
                    dot: "bg-yellow-500",
                    text: "text-yellow-600",
                  },
                };
                return (
                  <p
                    key={status}
                    className={`flex justify-between items-center px-3 py-2 rounded-lg transition ${statusStyles[status].bg}`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${statusStyles[status].dot}`}
                      ></span>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    <span
                      className={`font-semibold ${statusStyles[status].text}`}
                    >
                      {countByStatus(status)}
                    </span>
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Main Section */}
        <div className="lg:col-span-9">
          <h2 className="text-center font-semibold text-lg mb-4 text-gray-700">
            🧾 Live Orders
          </h2>

          <div className="flex w-100 justify-start mb-4">
            <Select
              value={filterType}
              onChange={setFilterType}
              style={{ width: 140 }}
            >
              <Option value="all">All</Option>
              <Option value="dine-in">Dine-In</Option>
              <Option value="takeaway">Take Away</Option>
            </Select>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">
              Loading kitchen orders...
            </p>
          ) : (
            <div className="space-y-6">
              {/* Dine-In Orders (grouped by tables) */}
              {(filterType === "all" || filterType === "dine-in") &&
                dineInOrders.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      🍽️ Dine-In Orders
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {tables.map((table) => {
                        const tableOrders = dineInOrders.filter((order) => {
                          // const orderTable = `Table_${order.table_no}`;
                          return (
                            String(order.table_no) ===
                            table.table_number.replace("Table_", "")
                          );
                          // && !shouldHideOrder(order);
                        });

                        if (tableOrders.length === 0) return null;

                        return (
                          <div
                            key={table.id}
                            className={`flex flex-col rounded-xl p-4 gap-2 transition hover:shadow-md hover:-translate-y-0.5 duration-200 ring-1 ring-green-200 bg-green-50 border border-green-200 h-fit`}
                          >
                            <h3 className="text-md font-bold text-gray-800 mb-2">
                              🍽️ Table{" "}
                              {table.table_number.replace("Table_", "")}
                            </h3>
                            {tableOrders.map((order) => renderOrderCard(order))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Takeaway Orders (not grouped by tables) */}
              {(filterType === "all" || filterType === "takeaway") &&
                takeawayOrders.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      🥡 Takeaway Orders
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {takeawayOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex flex-col rounded-xl p-4 gap-2 transition hover:shadow-md hover:-translate-y-0.5 duration-200 ring-1 ring-blue-200 bg-blue-50 border border-blue-200 h-fit"
                        >
                          <h3 className="text-md font-bold text-gray-800 mb-2">
                            🥡 Takeaway Order
                          </h3>
                          {renderOrderCard(order)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* No orders message */}
              {filteredOrders.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No orders found matching the current filter.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenDashboard;

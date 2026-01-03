import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { LineChart } from "@mui/x-charts/LineChart";
import { message, Modal, Form, Input, Pagination, Select } from "antd";

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

import { notification } from "antd";
import useMenuController from "../Menu/Menus.js";

dayjs.extend(isoWeek);

import {
  useTableController,
  useDailySales,
  useDailyPayments,
} from "./Dashboard.js";

import { useKitchenController } from "../Kitchen/KitchenDashboard";

const AdminDashboard = () => {
  const { makePayment, printBill, generateBill, placeOrder } =
    useMenuController();

  const { kitchens, loading, updateStatus } = useKitchenController();
  const { rows, totalPerDay } = useDailySales();
  const { totals, payments } = useDailyPayments();
  const [chartView, setChartView] = useState("day");

  const [billRequested, setBillRequested] = useState({});

  const [isBillModalOpen, setIsBillModalOpen] = useState(false);

  const [billData, setBillData] = useState(null);

  const [form] = Form.useForm();

  const paymentMethod = Form.useWatch("paymentMethod", form);

  // Guest OTP requests (from Guest Login)
  const [guestOtps, setGuestOtps] = useState([]);

  useEffect(() => {
    const loadOtps = () => {
      try {
        const list = JSON.parse(
          localStorage.getItem("guest_otp_requests") || "[]"
        );
        // Sort newest first
        list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setGuestOtps(list);
      } catch (e) {
        // ignore
      }
    };
    loadOtps();
    const id = setInterval(loadOtps, 5000);
    return () => clearInterval(id);
  }, []);

  // Guest Bill requests (from Guest Checkout)
  const [billRequests, setBillRequests] = useState([]);
  useEffect(() => {
    const loadBills = () => {
      try {
        const list = JSON.parse(
          localStorage.getItem("guest_bill_requests") || "[]"
        );
        list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setBillRequests(list);
      } catch (e) {
        // ignore
      }
    };
    loadBills();
    const id = setInterval(loadBills, 5000);
    return () => clearInterval(id);
  }, []);

  const getDataset = () => {
    if (!totals || totals.length === 0) return [];

    if (chartView === "day") {
      // Group by day
      const grouped = payments.reduce((acc, p) => {
        const day = dayjs(p.createdAt).format("DD-MM-YYYY");
        if (!acc[day]) acc[day] = 0;
        acc[day] += p.bill_amount;
        return acc;
      }, {});

      return Object.entries(grouped).map(([label, value]) => ({
        label,
        value,
      }));
    }

    if (chartView === "week") {
      // Group by ISO week
      const grouped = payments.reduce((acc, p) => {
        const week = `Week ${dayjs(p.createdAt).isoWeek()}`;
        if (!acc[week]) acc[week] = 0;
        acc[week] += p.bill_amount;
        return acc;
      }, {});

      return Object.entries(grouped).map(([label, value]) => ({
        label,
        value,
      }));
    }

    if (chartView === "month") {
      // Group by month
      const grouped = payments.reduce((acc, p) => {
        const month = dayjs(p.createdAt).format("MMM YYYY");
        if (!acc[month]) acc[month] = 0;
        acc[month] += p.bill_amount;
        return acc;
      }, {});

      return Object.entries(grouped).map(([label, value]) => ({
        label,
        value,
      }));
    }

    return [];
  };

  const dataset = getDataset();

  const location = useLocation();
  const cart = location.state?.cart || [];

  const [sampleTables, setSampleTables] = useState([]);
  const isFirstLoad = useRef(true);

  const [orders, setOrders] = useState([]);
  const { tables } = useTableController();

  useEffect(() => {
    setOrders(kitchens || []);
  }, [kitchens]);

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
    orders.filter((o) => o.status == status && !shouldHideOrder(o)).length;

  const totalOrders = kitchens.filter((o) => !shouldHideOrder(o)).length;

  const chartData = {
    day: [{ label: "Today", value: totals.day }],
    week: [{ label: "This Week", value: totals.week }],
    month: [{ label: "This Month", value: totals.month }],
  };

  const handleBillFormSubmit = async () => {
    console.log("Submit clicked");
    try {
      const values = await form.validateFields();

      // Get the correct order based on billData
      let currentOrder;

      // console.log("All orders:", orders.map(o => ({ id: o.id, table_no: o.table_no, order_code: o.order_code, status: o.status, createdAt: o.createdAt })));
      // console.log("Looking for bill data:", billData);

      if (billData && billData.order_id) {
        // Find the order that matches the bill's order_id
        currentOrder = orders.find((order) => order.id === billData.order_id);
        // console.log("Found by order_id:", currentOrder?.id);
      } else if (billData && billData.table) {
        // Extract table number from "Table_X" format
        const tableNumber = parseInt(billData.table.replace("Table_", ""));

        // Get ALL orders for this table, then find the most recent PENDING one
        const tableOrders = orders.filter(
          (order) => order.table_no === tableNumber
        );
        console.log(
          `All orders for table ${tableNumber}:`,
          tableOrders.map((o) => ({
            id: o.id,
            status: o.status,
            createdAt: o.createdAt,
          }))
        );

        // Find the most recent pending order for this table
        const pendingOrders = tableOrders.filter(
          (order) => order.status === "pending"
        );

        if (pendingOrders.length > 0) {
          // Get the most recent pending order
          currentOrder = pendingOrders.reduce((latest, current) => {
            return new Date(current.createdAt) > new Date(latest.createdAt)
              ? current
              : latest;
          });
          // console.log(`Found most recent pending order for table ${tableNumber}:`, currentOrder.id);
        } else {
          // Fallback: get the most recent order regardless of status
          currentOrder = tableOrders.reduce((latest, current) => {
            return new Date(current.createdAt) > new Date(latest.createdAt)
              ? current
              : latest;
          });
          // console.log(`No pending orders, using most recent order for table ${tableNumber}:`, currentOrder?.id);
        }
      } else if (billData && billData.tableId) {
        // Try to find by tableId (this might be a different field)
        currentOrder = orders.find((order) => order.id === billData.tableId);
        // console.log("Found by tableId:", currentOrder?.id);
      } else {
        // Fallback to last order only if no bill data available
        currentOrder = orders[orders.length - 1];
        // console.log("Using fallback last order:", currentOrder?.id);
      }

      console.log("Current order:", currentOrder);
      console.log("Bill data:", billData);

      if (!currentOrder) {
        return message.error("❌ Could not find matching order for this bill!");
      }

      // Use the correct order ID
      const orderId = currentOrder.id;

      if (!orderId) {
        return message.error("❌ No order_id found!");
      }

      // Get bill ID from billData or generate fallback
      const billId = billData?.id || billData?.tableId || Date.now();

      // Default status if not selected
      const status = values.status || "SUCCESS";

      // Amount calculations for cash
      let amountReceived = Number(values.amountReceived) || 0;

      // Calculate the correct bill amount from order items
      const calculatedTotal =
        currentOrder.items?.reduce((sum, item) => {
          return sum + Number(item.price) * Number(item.quantity);
        }, 0) || 0;

      // Use calculated total instead of form value if there's a mismatch
      const finalBillAmount =
        calculatedTotal > 0 ? calculatedTotal : Number(values.billAmount);

      const paymentData = {
        order_id: orderId,
        bill_id: billId,
        bill_amount: finalBillAmount,
        amount_received: Number(amountReceived),
        method: values.paymentMethod.toUpperCase(),
        status: status.toUpperCase(),
      };

      console.log("Payment data:", paymentData);
      console.log("Calculated total from items:", calculatedTotal);
      console.log("Form bill amount:", Number(values.billAmount));

      // Pass the current order items to makePayment
      await makePayment(paymentData, currentOrder.items);

      message.success("🎉 Payment recorded successfully!");

      // Assuming billData.bill_id is the unique id of the bill being printed

      // setBillRequests((prev) =>
      //   prev.filter((b) => b.bill_id !== billData.bill_id)
      // );


      // ✅ Remove only the printed bill from the requests
      setBillRequests((prev) => {
        const updated = prev.filter((b) => b.tableId !== billData.tableId);
        localStorage.setItem("guest_bill_requests", JSON.stringify(updated));
        return updated;
      });

      // ✅ Remove related OTP request if exists
      setGuestOtps((prev) => {
        const updatedOtp = prev.filter((o) => o.table !== billData.table);
        localStorage.setItem("guest_otp_requests", JSON.stringify(updatedOtp));
        return updatedOtp;
      });

      setIsBillModalOpen(false);
      setBillData(null);
      form.resetFields();
    } catch (error) {
      console.error("Payment failed:", error);
      message.error("❌ Failed to process payment!");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen relative">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          {/* Guest OTPs Panel */}
          <div className="bg-white shadow-lg rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-lg text-gray-700">
                🔐 Guest OTP Requests
              </h2>
              {guestOtps.length > 0 && (
                <button
                  onClick={() => {
                    localStorage.removeItem("guest_otp_requests");
                    setGuestOtps([]);
                  }}
                  className="text-xs text-red-600 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            {guestOtps.length === 0 ? (
              <p className="text-gray-500 text-sm">No OTP requests.</p>
            ) : (
              <ul className="space-y-2">
                {guestOtps.slice(0, 5).map((o, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {o.table || "Unknown Table"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(o.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-base font-bold text-purple-700">
                      {o.code}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
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
                  // served: {
                  //   bg: "bg-green-50 border border-green-200",
                  //   dot: "bg-green-500",
                  //   text: "text-green-600",
                  // },
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
          <div className="bg-white shadow-lg rounded-2xl p-5 border border-gray-100 mb-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-700">
                🧾 Bill Requests
              </h2>

              {billRequests.length > 0 && (
                <button
                  onClick={() => {
                    localStorage.removeItem("guest_bill_requests");
                    setBillRequests((prev) => {
                      const updated = prev.filter(
                        (bill) => bill.tableId !== b.tableId
                      );
                      localStorage.setItem(
                        "guest_bill_requests",
                        JSON.stringify(updated)
                      );
                      return updated;
                    });
                  }}
                  className="text-xs text-red-600 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            {billRequests.length === 0 ? (
              <p className="text-gray-500 text-sm">No bill requests.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {billRequests.slice(0, 6).map((b, idx) => (
                  <li
                    key={idx}
                    className="rounded-lg px-3 py-3 bg-gray-50 border border-gray-100 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {b.table || "Unknown Table"} Bill
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(b.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-base font-bold text-blue-700">
                        ₹ {Number(b.total || 0).toFixed(2)}
                      </span>
                    </div>

                    {b.items && b.items.length > 0 && (
                      <ul className="text-xs text-gray-600 list-disc ml-4">
                        {b.items.map((item, i) => (
                          <li key={i}>
                            {item.item_name} × {item.qty} — ₹
                            {(item.price * item.qty).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    )}

                    <button
                      onClick={() => {
                        setBillData(b);
                        form.setFieldsValue({
                          // billAmount: Number(b.total || 0).toFixed(2),
                          billAmount: Number(
                            b.total || 0
                            // * 1.05
                          ).toFixed(2),
                        });
                        setIsBillModalOpen(true);
                      }}
                      className="mt-2 text-xs px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                    >
                      Request Bill
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <h2 className="text-center font-semibold text-lg mb-4 text-gray-700">
            💳 Transactions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Total Sales Card */}
            <div className=" rounded-xl p-4 shadow-lg bg-white hover:shadow-lg transition space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700 text-sm">
                  💰 Total Sales
                </h3>
                <span className="px-3 py-1 text-xs rounded-full font-medium bg-green-100 text-green-600">
                  Today
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                ₹{totalPerDay.toFixed(2)}
                {/* ₹{(totalPerDay || 0).toFixed(2)} */}
              </p>
            </div>

            {/* Total Orders Card */}
            <div className=" rounded-xl p-4 shadow-lg bg-white hover:shadow-lg transition space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700 text-sm">
                  🛒 Total Orders
                </h3>
                <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-600">
                  Today
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="my-4 ">
        <h2 className="font-semibold text-lg my-4 text-gray-700">🍽️ Tables</h2>
        {/* tables Section */}

        <div className="flex gap-3 w-full">
          {/* Grid */}

          {/* matched with order table number */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 w-full">
            {loading ? (
              <p className="text-gray-500 text-sm">Loading tables...</p>
            ) : Array.isArray(tables) && tables.length > 0 ? (
              tables.map((table) => {
                const tableOrders = Array.isArray(orders)
                  ? orders.filter(
                    (o) =>
                      o.order_type?.toLowerCase() === "dine-in" &&
                      `Table_${o.table_no}` === table.table_number &&
                      !shouldHideOrder(o)
                  )
                  : [];

                return (
                  <div
                    key={table.id}
                    className={`flex flex-col rounded-xl p-4 gap-3 bg-white border border-gray-200 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 duration-200
                    ${tableOrders.length > 0 ? "ring-1 ring-green-200" : ""
                      } h-fit`}
                  >
                    <div>
                      <p className="font-semibold text-gray-800 text-sm truncate">
                        {table.table_number}
                      </p>
                      <p
                        className={`text-MD mt-1 ${tableOrders.length > 0
                          ? "text-green-700 font-semibold"
                          : "text-gray-500"
                          }`}
                      >
                        {tableOrders.length > 0 ? "Occupied" : "Vacant"}
                      </p>
                    </div>

                    <div className="mt-1 space-y-3">
                      {tableOrders.length > 0 ? (
                        tableOrders.map((order) => (
                          <div
                            key={order.id}
                            className="rounded-lg p-3 space-y-2 bg-gray-50 border border-gray-100"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-semibold text-gray-700">
                                {order.order_code}
                              </span>
                              <span
                                className={`px-2 py-0.5 text-MD rounded-md font-medium ${order.status === "pending"
                                  ? "bg-orange-100 text-orange-600"
                                  : order.status === "ready"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-100 text-gray-600"
                                  }`}
                              >
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </span>
                            </div>

                            <p className="text-md text-gray-500 my-3">
                              Order Type{" "}
                              <span className="bg-blue-500 text-white py-1 px-2 rounded-md text-md">
                                <span>
                                  {order.order_type.charAt(0).toUpperCase()}
                                </span>
                                {order.order_type.slice(1)}
                              </span>
                            </p>

                            <p className="text-xs text-gray-600 my-4">
                              Payment Status:
                              <span
                                className={`ml-1 px-2 py-1 rounded-lg text-xs font-medium ${(() => {
                                  const payment = payments.find(
                                    (p) => p.order_id === order.id
                                  );
                                  const status = payment?.status?.toLowerCase();
                                  return status === "completed" ||
                                    status === "success"
                                    ? "bg-green-100 text-green-600"
                                    : status === "pending"
                                      ? "bg-yellow-100 text-yellow-600"
                                      : status === "failed"
                                        ? "bg-red-100 text-red-600"
                                        : "bg-gray-100 text-gray-600";
                                })()}`}
                              >
                                {(() => {
                                  const payment = payments.find(
                                    (p) => p.order_id === order.id
                                  );
                                  return (
                                    payment?.status?.charAt(0).toUpperCase() +
                                    payment?.status?.slice(1) || "No Payment"
                                  );
                                })()}
                              </span>
                              {/* {console.log(`Payment status for order ${order.id}:`, payments.find(p => p.order_id === order.id)?.status)} */}
                            </p>

                            <ul className="text-xs list-disc pl-4 space-y-0.5 text-gray-700">
                              {order.items?.length > 0 ? (
                                order.items.map((item, i) => (
                                  <li key={i}>
                                    {item.item_name} ×{" "}
                                    <span className="font-medium">
                                      {item.quantity}
                                    </span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-gray-400">No items</li>
                              )}
                            </ul>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-xs">
                          No active orders
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-sm">No tables found</p>
            )}
          </div>
        </div>
      </div>

      {/* graff */}
      <div className="grid grid-cols-1 gap-5 my-4">
        <div className="bg-white shadow-lg rounded-2xl p-5 border border-gray-100 mb-6">
          <h2 className="font-semibold text-lg mb-4 text-gray-700">
            📊 Sales Overview
          </h2>

          {/* Chart view buttons */}
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <button
              style={
                chartView === "day"
                  ? {
                    background:
                      "linear-gradient(90deg, rgb(114, 46, 209) 0%, rgb(146, 84, 222) 100%)",
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }
                  : {
                    background: "#f3f4f6",
                    color: "#1f2937",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }
              }
              onClick={() => setChartView("day")}
            >
              Day
            </button>
            <button
              style={
                chartView === "week"
                  ? {
                    background:
                      "linear-gradient(90deg, rgb(114, 46, 209) 0%, rgb(146, 84, 222) 100%)",
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }
                  : {
                    background: "#f3f4f6",
                    color: "#1f2937",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }
              }
              onClick={() => setChartView("week")}
            >
              Week
            </button>
            <button
              style={
                chartView === "month"
                  ? {
                    background:
                      "linear-gradient(90deg, rgb(114, 46, 209) 0%, rgb(146, 84, 222) 100%)",
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }
                  : {
                    background: "#f3f4f6",
                    color: "#1f2937",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }
              }
              onClick={() => setChartView("month")}
            >
              Month
            </button>
          </div>

          <LineChart
            dataset={dataset}
            xAxis={[
              {
                dataKey: "label",
                scaleType: "band",
              },
            ]}
            series={[
              {
                dataKey: "value",
                label: "Total Sales Amount",
                curve: "monotoneX",
              },
            ]}
            height={300}
            margin={{ left: 40 }}
          />
        </div>
      </div>
      <Modal
        title="Request Bill"
        open={isBillModalOpen}
        onCancel={() => setIsBillModalOpen(false)}
        onOk={handleBillFormSubmit}
        okText="Submit"
        confirmLoading={loading}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          {/* Bill Amount */}
          <Form.Item
            name="billAmount"
            label="Bill Amount"
            rules={[{ required: true, message: "Bill amount is required" }]}
          >
            <Input type="text" disabled />
          </Form.Item>

          {/* Payment Method */}
          <Form.Item
            name="paymentMethod"
            label="Payment Method"
            rules={[{ required: true, message: "Select a payment method" }]}
          >
            <Select placeholder="Select Method">
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="card">Card</Select.Option>
              <Select.Option value="upi">UPI</Select.Option>
            </Select>
          </Form.Item>

          {/* Show cash-specific fields only if cash is selected */}
          {paymentMethod === "cash" && (
            <>
              <Form.Item
                name="amountReceived"
                label="Amount Received"
                rules={[{ required: true, message: "Enter amount received" }]}
              >
                <Input
                  type="number"
                  placeholder="Enter amount received"
                  step="0.01"
                  onChange={(e) => {
                    const billAmount =
                      Number(form.getFieldValue("billAmount")) || 0;
                    const received = Number(e.target.value) || 0;
                    form.setFieldValue(
                      "balance",
                      (received - billAmount).toFixed(2)
                    );
                  }}
                />
              </Form.Item>

              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select placeholder="Select Status">
                  <Select.Option value="SUCCESS">Success</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;

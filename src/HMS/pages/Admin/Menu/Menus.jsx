// import React, { useState } from "react";
// import { message, Modal, Form, Input } from "antd";
// import useMenuController from "../Menu/Menus.js";
// import { useCategoryController } from "../Category/Category.js";

// // Skeleton for image loading
// const Skeleton = () => (
//   <div className="w-full h-32 bg-gray-200 animate-pulse rounded-t-xl"></div>
// );

// const Menu = () => {
//   const { categories } = useCategoryController();
//   const {
//     cart,
//     addToCart,
//     updateQty,
//     getCartItem,
//     total,
//     placeOrder,
//     generateBill,
//     clearCart,
//     makePayment,
//     tables,
//   } = useMenuController();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [orderType, setOrderType] = useState("dinein");
//   const [tableNo, setTableNo] = useState("");
//   const [orders, setOrders] = useState([]);
//   const [loadedImages, setLoadedImages] = useState({});
//   const [checkout, setCheckout] = useState(false);
//   const [billRequested, setBillRequested] = useState({});
//   const [isBillModalOpen, setIsBillModalOpen] = useState(false);
//   const [billData, setBillData] = useState(null);
//   const [form] = Form.useForm();
//   const paymentMethod = Form.useWatch("paymentMethod", form);

//   const filteredItems = categories.filter((item) =>
//     item.item_name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getBackendOrderType = () =>
//     orderType === "dinein" ? "dine-in" : "takeaway";

//   // const handlePlaceOrder = async () => {
//   //   if (cart.length === 0) return message.warning("⚠️ Please add items first!");
//   //   if (orderType === "dinein" && !tableNo)
//   //     return message.warning("⚠️ Please select a table!");

//   //   try {
//   //     const payload = {
//   //       order_code: `ORD-${Date.now()}`,
//   //       table_no: orderType === "dinein" ? Number(tableNo) : 1,
//   //       order_type: getBackendOrderType(),
//   //       items: cart.map((item) => ({ id: item.id, qty: item.qty })),
//   //     };

//   //     const fullOrder = await placeOrder(payload);

//   //     const orderWithItems = { ...fullOrder, originalItems: [...cart] };
//   //     setOrders((prev) => [...prev, orderWithItems]);
//   //     message.success("✅ Order placed successfully!");
//   //     setTableNo("");
//   //     setOrderType("dinein");
//   //     setCheckout(false);
//   //   } catch (error) {
//   //     console.error(error);
//   //     message.error("❌ Failed to place order!");
//   //   }
//   // };
//   const handlePlaceOrder = async () => {
//     if (cart.length === 0) return message.warning("⚠️ Please add items first!");
//     if (orderType === "dinein" && !tableNo)
//       return message.warning("⚠️ Please select a table!");

//     try {
//      const payload = {
//   order_code: `ORD-${Date.now()}`,
//   table_no: orderType === "dinein" ? Number(tableNo) : 1,
//   order_type: getBackendOrderType(),
//   items: cart.map((item) => ({
//     item_name: item.item_name,
//     quantity: item.qty,
//     price: Number(item.price), // make sure it's a number
//   })),
// };

//       const fullOrder = await placeOrder(payload);

//       setOrders((prev) => [
//         ...prev,
//         { ...fullOrder, originalItems: [...cart] },
//       ]);

//       message.success("✅ Order placed successfully!");
//       setTableNo("");
//       setOrderType("dinein");
//       setCheckout(false);
//       setCart([]); // clear cart
//     } catch (error) {
//       console.error(error);
//       message.error("❌ Failed to place order!");
//     }
//   };

// const handleBillFormSubmit = async () => {
//   try {
//     const values = await form.validateFields();
//     const lastOrder = orders[orders.length - 1];

//     if (!lastOrder?.id || !billData?.id) {
//       return message.error("❌ Missing order or bill details!");
//     }

//     await makePayment({
//       order_id: lastOrder.id,
//       bill_id: billData.id,
//       bill_amount: Number(values.billAmount),
//       amount_received: Number(values.amountReceived) || 0,
//       balance: Number(values.balance) || 0,
//       method: values.paymentMethod.toUpperCase(),
//       status: values.status,
//     });

//     message.success("🎉 Payment recorded successfully!");
//     setIsBillModalOpen(false);
//     setBillData(null);
//     form.resetFields();
//     setOrders([]);
//     setBillRequested({});
//     clearCart();
//   } catch (error) {
//     console.error("Payment failed:", error);
//     message.error("❌ Failed to process payment!");
//   }
// };

//   return (
//     <div className="flex flex-col lg:flex-row p-4 min-h-screen bg-gray-50 relative">
//       {/* Menu Section */}
//       <div className="flex-1">
//         <div className="mb-6 flex justify-start">
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="🔍 Search dishes..."
//             className="w-full md:w-72 px-4 py-2 border rounded-lg shadow focus:ring-2 focus:ring-indigo-400"
//           />
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {filteredItems.length > 0 ? (
//             filteredItems.map((item) => {
//               const cartItem = getCartItem(item.id);
//               return (
//                 <div
//                   key={item.id}
//                   className="bg-white rounded-xl shadow hover:shadow-lg transition"
//                 >
//                   {!loadedImages[item.id] && <Skeleton />}
//                   <img
//                     src={item.image}
//                     alt={item.item_name}
//                     onLoad={() =>
//                       setLoadedImages((prev) => ({ ...prev, [item.id]: true }))
//                     }
//                     className={`w-full h-32 object-cover rounded-t-xl transition-opacity ${
//                       loadedImages[item.id] ? "opacity-100" : "opacity-0"
//                     }`}
//                   />
//                   <div className="p-3 text-center">
//                     <h3 className="font-semibold">{item.item_name}</h3>
//                     <p className="text-gray-600">₹ {item.price}</p>
//                     {!cartItem ? (
//                       <button
//                         onClick={() => addToCart(item)}
//                         className="mt-2 w-full bg-blue-900 text-white py-2 rounded-lg"
//                       >
//                         ADD TO CART
//                       </button>
//                     ) : (
//                       <div className="mt-2 flex items-center justify-center gap-3">
//                         <button
//                           onClick={() => updateQty(item.id, cartItem.qty - 1)}
//                           className="bg-gray-300 px-3 py-1 rounded-lg"
//                         >
//                           -
//                         </button>
//                         <span className="font-semibold">{cartItem.qty}</span>
//                         <button
//                           onClick={() => updateQty(item.id, cartItem.qty + 1)}
//                           className="bg-gray-300 px-3 py-1 rounded-lg"
//                         >
//                           +
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <p className="col-span-full text-center text-gray-500">
//                No dishes found
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Cart & Orders Sidebar */}
//       <div className="w-full lg:w-96 lg:ml-4 bg-white rounded-xl shadow p-4 space-y-6">
//         {/* Cart */}
//         <div>
//           <h2 className="text-lg font-bold border-b pb-2">Cart</h2>
//           {cart.length === 0 ? (
//             <p className="text-center text-gray-500">Cart is empty</p>
//           ) : (
//             cart.map((item) => (
//               <div key={item.id} className="flex justify-between py-2 border-b">
//                 <span>
//                   {item.item_name} (x{item.qty})
//                 </span>
//                 <span>₹ {item.price * item.qty}</span>
//               </div>
//             ))
//           )}

//           {cart.length > 0 && (
//             <>
//               <p className="flex justify-between font-semibold mt-2">
//                 <span>Total</span>
//                 <span>₹ {(total + total * 0.05).toFixed(2)}</span>
//               </p>

//               <div className="mt-3 flex gap-2">
//                 <button
//                   onClick={() => setOrderType("dinein")}
//                   className={`w-1/2 py-2 rounded-lg ${
//                     orderType === "dinein"
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-100"
//                   }`}
//                 >
//                   Dine-in
//                 </button>
//                 <button
//                   onClick={() => setOrderType("takeaway")}
//                   className={`w-1/2 py-2 rounded-lg ${
//                     orderType === "takeaway"
//                       ? "bg-green-600 text-white"
//                       : "bg-gray-100"
//                   }`}
//                 >
//                   Takeaway
//                 </button>
//               </div>

//               {/* {orderType === "dinein" && (
//                 <select
//                   value={tableNo}
//                   onChange={(e) => setTableNo(Number(e.target.value))}
//                   className="w-full mt-3 border rounded-lg p-2"
//                 >
//                   <option value="">Select Table</option>
//                   {[1, 2, 3, 4, 5, 6, 7].map((num) => (
//                     <option key={num} value={num}>
//                       Table {num}
//                     </option>
//                   ))}
//                 </select>
//               )} */}
//               {orderType === "dinein" && (
//                 <select
//                   value={tableNo}
//                   onChange={(e) => {
//                     // Extract numeric part from "Table_1" => 1
//                     const num = Number(e.target.value.replace(/\D/g, ""));
//                     setTableNo(num);
//                   }}
//                   className="w-full mt-3 border rounded-lg p-2"
//                 >
//                   <option value="">Select Table</option>
//                   {tables.map((t) => (
//                     <option key={t.id} value={t.table_number}>
//                       {t.table_number}
//                     </option>
//                   ))}
//                 </select>
//               )}

//               <button
//                 onClick={handlePlaceOrder}
//                 className="mt-3 w-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-2 rounded-lg"
//               >
//                 Place Order
//               </button>
//             </>
//           )}
//         </div>

//         {/* Placed Orders Section */}
//         <div>
//           <h2 className="text-lg font-bold  pb-2">Placed Orders</h2>
//           {orders.length === 0 ? (
//             <p className="text-center text-gray-500">No orders placed yet</p>
//           ) : (
//             orders.map((ord, idx) => (
//               <div
//                 key={idx}
//                 className="border rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-100"
//               >
//                 <p className="font-semibold">{ord?.order_code || "—"}</p>
//                 <p className="text-gray-500 text-sm">
//                   Table: {ord?.table_no || "-"} | Type: {ord?.order_type || "-"}{" "}
//                   | Status: {ord?.status || "-"}
//                 </p>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Single Checkout Button */}
//         <button
//           onClick={async () => {
//             setCheckout((prev) => !prev);

//             if (orders.length > 0) {
//               const lastOrder = orders[orders.length - 1];
//               if (lastOrder && lastOrder.id) {
//                 try {
//                   const generatedBill = await generateBill(lastOrder.id);
//                   setBillData(generatedBill);

//                   // Calculate bill amount with two decimal places
//                   const billAmount = (
//                     generatedBill?.amount ||
//                     (lastOrder.originalItems?.length
//                       ? lastOrder.originalItems.reduce(
//                           (sum, item) => sum + item.price * item.qty,
//                           0
//                         ) * 1.05
//                       : 0)
//                   ).toFixed(2);

//                   // Autofill bill amount in modal
//                   form.setFieldsValue({
//                     billAmount: billAmount,
//                   });

//                   message.success("✅ Bill generated successfully!");
//                   setBillRequested((prev) => ({
//                     ...prev,
//                     [lastOrder.id]: true,
//                   }));
//                 } catch (error) {
//                   console.error(
//                     "Error generating bill:",
//                     error.response?.data || error.message
//                   );
//                   message.error("❌ Failed to generate bill!");
//                 }
//               } else {
//                 message.warning("⚠️ Invalid order ID!");
//               }
//             } else {
//               message.warning("⚠️ Please place an order first!");
//             }
//           }}
//           className="mt-2 w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
//         >
//           {checkout ? "Hide Checkout" : "Checkout & Generate Bill"}
//         </button>

//         {checkout && (
//           <div className="mt-3 p-3 border rounded-lg bg-yellow-50 text-yellow-800 space-y-2 relative z-50">
//             <h3 className="font-semibold mb-2">🛒 Checkout Items</h3>
//             {cart.length === 0 && orders.length > 0 ? (
//               <>
//                 {orders[orders.length - 1]?.originalItems?.map((item) => (
//                   <div key={item.id} className="flex justify-between py-1">
//                     <span>
//                       {item.item_name} x {item.qty}
//                     </span>
//                     <span>₹ {(item.price * item.qty).toFixed(2)}</span>
//                   </div>
//                 ))}
//                 <hr className="border-t border-yellow-300 my-2" />
//                 <div className="flex justify-between font-bold text-lg">
//                   <span>Total (incl. 5% tax)</span>
//                   <span>
//                     ₹
//                     {(
//                       orders[orders.length - 1]?.originalItems?.reduce(
//                         (sum, item) => sum + item.price * item.qty,
//                         0
//                       ) * 1.05
//                     ).toFixed(2)}
//                   </span>
//                 </div>
//               </>
//             ) : cart.length > 0 ? (
//               <>
//                 {cart.map((item) => (
//                   <div key={item.id} className="flex justify-between py-1">
//                     <span>
//                       {item.item_name} x {item.qty}
//                     </span>
//                     <span>₹ {(item.price * item.qty).toFixed(2)}</span>
//                   </div>
//                 ))}
//                 <hr className="border-t border-yellow-300 my-2" />
//                 <div className="flex justify-between font-bold text-lg">
//                   <span>Total (incl. 5% tax)</span>
//                   <span>₹ {(total + total * 0.05).toFixed(2)}</span>
//                 </div>
//               </>
//             ) : (
//               <p className="text-center text-yellow-600">
//                 No items in cart (Place an order to view!)
//               </p>
//             )}
//             {orders.length > 0 && (
//               <div className="mt-2 p-2 bg-white rounded text-sm">
//                 <p>
//                   <strong>Last Order:</strong>{" "}
//                   {orders[orders.length - 1]?.order_code}
//                 </p>
//                 <p>
//                   Table: {orders[orders.length - 1]?.table_no} | Type:{" "}
//                   {orders[orders.length - 1]?.order_type} | Status:{" "}
//                   {orders[orders.length - 1]?.status}
//                 </p>
//               </div>
//             )}
//             {orders.length > 0 &&
//               billRequested[orders[orders.length - 1]?.id] && (
//                 <button
//                   onClick={() => setIsBillModalOpen(true)}
//                   className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
//                 >
//                   Request Bill
//                 </button>
//               )}
//           </div>
//         )}
//       </div>

//       <Modal
//         title="Request Bill"
//         open={isBillModalOpen}
//         onCancel={() => setIsBillModalOpen(false)}
//         onOk={handleBillFormSubmit}
//         okText="Submit"
//         cancelText="Cancel"
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             name="billAmount"
//             label="Bill Amount"
//             rules={[{ required: true, message: "Bill amount is required" }]}
//           >
//             <Input type="text" disabled />
//           </Form.Item>

//           <Form.Item
//             name="paymentMethod"
//             label="Payment Method"
//             rules={[{ required: true, message: "Select a payment method" }]}
//           >
//             <select
//               className="w-full border rounded p-2"
//               onChange={(e) => setPaymentMethod(e.target.value)}
//             >
//               <option value="">Select Method</option>
//               <option value="cash">Cash</option>
//               <option value="card">Card</option>
//               <option value="upi">UPI</option>
//             </select>
//           </Form.Item>

//           {paymentMethod === "cash" && (
//             <>
//               <Form.Item
//                 name="amountReceived"
//                 label="Amount Received"
//                 rules={[{ required: true, message: "Enter amount received" }]}
//               >
//                 <Input
//                   type="number"
//                   placeholder="Enter amount received"
//                   step="0.01"
//                   onChange={(e) => {
//                     const billAmount =
//                       Number(form.getFieldValue("billAmount")) || 0;
//                     const received = Number(e.target.value) || 0;
//                     form.setFieldValue(
//                       "balance",
//                       (received - billAmount).toFixed(2)
//                     );
//                   }}
//                 />
//               </Form.Item>

//               <Form.Item name="balance" label="Balance">
//                 <Input type="text" disabled />
//               </Form.Item>
//               <Form.Item
//                 name="status"
//                 label="Status"
//                 rules={[{ message: "Please select status" }]}
//               >
//                 <select className="w-full border rounded p-2">
//                   <option value="">Select Status</option>
//                   <option value="PENDING">Pending</option>
//                   <option value="SUCCESS">Success</option>
//                   <option value="FAILED">Failed</option>
//                 </select>
//               </Form.Item>
//             </>
//           )}
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default Menu;
import React, { useState, useEffect } from "react";
import { message, Modal, Form, Input, Pagination } from "antd";
import useMenuController from "../Menu/Menus.js";
import { useCategoryController } from "../Category/Category.js";
import xtownlogo from "../../../../components/assets/Company_logo.png";
import { useProfileController } from "../Profile/Profile.js";
import { taxService } from "../../../models/tax.js";

// Mock categoryService (replace with your actual service)
const categoryService = {
  list: async ({ page, limit }) => {
    return {
      data: {
        data: {
          categories: [
            {
              id: 1,
              item_name: "Pizza",
              price: 250,
              image: "pizza.jpg",
              tax_id: 1,
            },
            {
              id: 2,
              item_name: "Burger",
              price: 150,
              image: "burger.jpg",
              tax_id: 1,
            },
          ].slice((page - 1) * limit, page * limit),
          total: 50,
        },
      },
    };
  },
};

// Skeleton for image loading
const Skeleton = () => (
  <div className="w-full h-32 bg-gray-200 animate-pulse rounded-t-xl"></div>
);

const Menu = () => {
  const { categories, setCategories, pagination, setPagination } =
    useCategoryController();

  const [loading, setLoading] = useState(false);

  const {
    cart,
    setCart,
    addToCart,
    updateQty,
    getCartItem,
    total,
    placeOrder,
    generateBill,
    makePayment,
    tables,
  } = useMenuController();

  const { profiles, fetchProfiles } = useProfileController();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const [taxes, setTaxes] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState("");
  const [orderType, setOrderType] = useState("dinein");
  const [tableNo, setTableNo] = useState("");
  const [orders, setOrders] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const [checkout, setCheckout] = useState(false);
  const [billRequested, setBillRequested] = useState({});
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [billData, setBillData] = useState(null);
  const [form] = Form.useForm();
  const paymentMethod = Form.useWatch("paymentMethod", form);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);

      // 1️⃣ Fetch all taxes
      const taxRes = await taxService.list();
      const taxList = taxRes?.data?.data?.taxes || [];

      // 2️⃣ Build a tax map: id → numeric tax percentage
      const taxMap = taxList.reduce((acc, tax) => {
        const val = parseFloat(tax.taxable_value);
        acc[tax.id] = isNaN(val) ? 0 : val; // fallback 0 if NaN
        return acc;
      }, {});

      // 3️⃣ Fetch categories
      const res = await categoryService.list({
        page: pagination.current,
        limit: pagination.pageSize,
      });
      const rows = res.data?.data?.categories || [];
      const total = res.data?.data?.total || rows.length;

      // 4️⃣ Map tax to category and calculate price_with_tax
      const updatedRows = rows.map((item) => {
        const price = parseFloat(item.price) || 0; // ensure number
        const taxPercent = taxMap[item.tax_id] || 0; // fallback if missing
        const taxAmount = (price * taxPercent) / 100;
        const priceWithTax = price + taxAmount;

        return {
          ...item,
          tax_percent: taxPercent,
          tax_amount: parseFloat(taxAmount.toFixed(2)), // numeric 2 decimals
          price_with_tax: parseFloat(priceWithTax.toFixed(2)), // numeric 2 decimals
        };
      });

      setCategories(updatedRows);
      setPagination((prev) => ({ ...prev, total }));
      console.log("✅ Categories with proper tax:", updatedRows);
    } catch (err) {
      console.error("❌ Error fetching categories:", err);
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.price_with_tax || item.price) || 0;
    const qty = parseFloat(item.qty) || 0;
    return sum + price * qty;
  }, 0);

  const fetchTaxes = async () => {
    try {
      setLoading(true);
      const res = await taxService.list();
      if (!res.data?.success) {
        messageApi.error("Failed to fetch taxes");
        setTaxes([]);
        return;
      }
      const rows = (res.data.data?.taxes || []).map((tax) => ({
        ...tax,
        taxable_value: parseFloat(tax.taxable_value) || 0,
        cgst_percent: parseFloat(tax.cgst_percent) || 0,
        cgst_amount: parseFloat(tax.cgst_amount) || 0,
        sgst_percent: parseFloat(tax.sgst_percent) || 0,
        sgst_amount: parseFloat(tax.sgst_amount) || 0,
        igst_percent: parseFloat(tax.igst_percent) || 0,
        igst_amount: parseFloat(tax.igst_amount) || 0,
        total_tax_amount: parseFloat(tax.total_tax_amount) || 0,
      }));
      setTaxes(rows);
    } catch (err) {
      console.error("Fetch taxes error:", err);
      messageApi.error("Failed to fetch taxes");
      setTaxes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTaxes();
  }, [pagination.current, pagination.pageSize]);

  const filteredItems = categories.filter((item) =>
    item.item_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBackendOrderType = () =>
    orderType === "dinein" ? "dine-in" : "takeaway";

  // const handlePlaceOrder = async () => {
  //   if (cart.length === 0) return message.warning("Please add items first!");
  //   if (orderType === "dinein" && !tableNo)
  //     return message.warning("Please select a table!");

  //   try {
  //     const payload = {
  //       order_code: `ORD-${Date.now()}`,
  //       table_no: orderType === "dinein" ? Number(tableNo) : 1,
  //       order_type: getBackendOrderType(),
  //       items: cart.map((item) => ({
  //         item_name: item.item_name,
  //         quantity: Number(item.qty),
  //         price: Number(item.price),
  //       })),
  //     };

  //     const fullOrder = await placeOrder(payload);
  //     setOrders((prev) => [
  //       ...prev,
  //       { ...fullOrder, originalItems: cart.map((item) => ({ ...item })) },
  //     ]);

  //     message.success("Order placed successfully!");
  //     setTableNo("");
  //     setOrderType("dinein");
  //     setCheckout(false);
  //     setCart([]);
  //   } catch (error) {
  //     console.error(error);
  //     message.error("Failed to place order!");
  //   }
  // };
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return message.warning("Please add items first!");
    if (orderType === "dinein" && !tableNo)
      return message.warning("Please select a table!");

    try {
      const payload = {
        order_code: `ORD-${Date.now()}`,
        table_no: orderType === "dinein" ? Number(tableNo) : 1,
        order_type: getBackendOrderType(),
        items: cart.map((item) => {
          const priceWithTax =
            parseFloat(item.price_with_tax || item.price) || 0;
          const taxAmount = parseFloat((priceWithTax - item.price).toFixed(2));
          return {
            item_name: item.item_name,
            quantity: Number(item.qty),
            price: priceWithTax, // ✅ use price including tax
            tax_percent: item.tax_percent || 0,
            tax_amount: taxAmount, // optional: send tax amount separately
          };
        }),
        total_amount: cart.reduce(
          (acc, item) =>
            acc +
            (parseFloat(item.price_with_tax || item.price) || 0) *
              Number(item.qty),
          0
        ),
      };

      const fullOrder = await placeOrder(payload);
      setOrders((prev) => [
        ...prev,
        { ...fullOrder, originalItems: cart.map((item) => ({ ...item })) },
      ]);

      message.success("Order placed successfully!");
      setTableNo("");
      setOrderType("dinein");
      setCheckout(false);
      setCart([]);
    } catch (error) {
      console.error(error);
      message.error("Failed to place order!");
    }
  };

  const handleBillFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      const lastOrder = orders[orders.length - 1];
      if (!lastOrder?.id || !billData?.id)
        return message.error("Missing order or bill details!");

      await makePayment({
        order_id: lastOrder.id,
        bill_id: billData.id,
        bill_amount: Number(values.billAmount),
        amount_received: Number(values.amountReceived) || 0,
        balance: Number(values.balance) || 0,
        method: values.paymentMethod.toUpperCase(),
        status: values.status,
      });

      message.success("Payment recorded successfully!");
      setIsBillModalOpen(false);
      setBillData(null);
      form.resetFields();
      setOrders([]);
      setBillRequested({});
    } catch (error) {
      console.error("Payment failed:", error);
      message.error("Failed to process payment!");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row p-4 min-h-screen bg-gray-50 relative">
      {contextHolder}
      <div className="flex-1">
        <div className="mb-6 flex justify-start">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder=" Search dishes..."
            className="w-full md:w-72 px-4 py-2 border rounded-lg shadow focus:ring-indigo-400"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: pagination.pageSize }).map((_, idx) => (
              <Skeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const cartItem = getCartItem(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow hover:shadow-lg transition"
                  >
                    {!loadedImages[item.id] && <Skeleton />}
                    <img
                      src={item.image}
                      alt={item.item_name}
                      onLoad={() =>
                        setLoadedImages((prev) => ({
                          ...prev,
                          [item.id]: true,
                        }))
                      }
                      className={`w-full h-32 object-cover rounded-t-xl transition-opacity ${
                        loadedImages[item.id] ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <div className="p-3 text-center">
                      <h3 className="font-semibold">{item.item_name}</h3>
                      <p className="text-gray-600">
                        ₹{" "}
                        {(
                          parseFloat(item.price_with_tax || item.price) || 0
                        ).toFixed(2)}
                      </p>
                      {!cartItem ? (
                        <button
                          onClick={() => addToCart(item)}
                          className="mt-2 w-full bg-blue-900 text-white py-2 rounded-lg"
                        >
                          ADD TO CART
                        </button>
                      ) : (
                        <div className="mt-2 flex items-center justify-center gap-3">
                          <button
                            onClick={() => updateQty(item.id, cartItem.qty - 1)}
                            className="bg-gray-300 px-3 py-1 rounded-lg"
                          >
                            -
                          </button>
                          <span className="font-semibold">{cartItem.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, cartItem.qty + 1)}
                            className="bg-gray-300 px-3 py-1 rounded-lg"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No dishes found
              </p>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={(page, pageSize) =>
              setPagination((prev) => ({ ...prev, current: page, pageSize }))
            }
            showSizeChanger
            pageSizeOptions={["12", "24", "36"]}
          />
        </div>
      </div>

      {/* Cart & Orders Sidebar */}
      <div className="w-full lg:w-96 lg:ml-4 bg-white rounded-xl shadow p-4 space-y-6">
        <div>
          <h2 className="text-lg font-bold border-b pb-2">Cart</h2>
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Cart is empty</p>
          ) : (
            cart.map((item) => {
              const price = parseFloat(item.price_with_tax || item.price) || 0;
              const qty = parseFloat(item.qty) || 0;
              return (
                <div
                  key={item.id}
                  className="flex justify-between py-2 border-b"
                >
                  <span>
                    {item.item_name} (x{item.qty})
                  </span>
                  <span>₹ {(price * qty).toFixed(2)}</span>
                </div>
              );
            })
          )}

          {cart.length > 0 && (
            <>
              <p className="flex justify-between font-semibold mt-2">
                <span>Total</span>
                <span>₹ {cartTotal.toFixed(2)}</span>
              </p>

              {/* Order type and table selection */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setOrderType("dinein")}
                  className={`w-1/2 py-2 rounded-lg ${
                    orderType === "dinein"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  Dine-in
                </button>
                <button
                  onClick={() => setOrderType("takeaway")}
                  className={`w-1/2 py-2 rounded-lg ${
                    orderType === "takeaway"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  Takeaway
                </button>
              </div>

              {orderType === "dinein" && (
                <select
                  value={tableNo}
                  onChange={(e) => {
                    const num = Number(e.target.value.replace(/\D/g, ""));
                    setTableNo(num);
                  }}
                  className="w-full mt-3 border rounded-lg p-2"
                >
                  <option value="">Select Table</option>
                  {tables.map((t) => (
                    <option key={t.id} value={t.table_number}>
                      {t.table_number}
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={handlePlaceOrder}
                className="mt-3 w-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white py-2 rounded-lg"
              >
                Place Order
              </button>
            </>
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold pb-2">Placed Orders</h2>
          {orders.length === 0 ? (
            <p className="text-center text-gray-500">No orders placed yet</p>
          ) : (
            orders.map((ord, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-100"
              >
                <p className="font-semibold">{ord?.order_code || "—"}</p>
                <p className="text-gray-500 text-sm">
                  Table: {ord?.table_no || "-"} | Type: {ord?.order_type || "-"}{" "}
                  | Status: {ord?.status || "-"}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Single Checkout Button */}
        <button
          onClick={async () => {
            setCheckout((prev) => !prev);

            if (orders.length > 0) {
              const lastOrder = orders[orders.length - 1];
              if (lastOrder && lastOrder.id) {
                try {
                  const generatedBill = await generateBill(lastOrder.id);
                  setBillData(generatedBill);

                  const billAmount = (
                    generatedBill?.amount ||
                    (lastOrder.originalItems?.length
                      ? lastOrder.originalItems.reduce(
                          (sum, item) =>
                            sum +
                            (item.price_with_tax || item.price) * item.qty,
                          0
                        )
                      : // * 1.05
                        0)
                  ).toFixed(2);

                  form.setFieldsValue({
                    billAmount: billAmount,
                  });

                  message.success("✅ Bill generated successfully!");
                  setBillRequested((prev) => ({
                    ...prev,
                    [lastOrder.id]: true,
                  }));
                } catch (error) {
                  console.error(
                    "Error generating bill:",
                    error.response?.data || error.message
                  );
                  message.error("❌ Failed to generate bill!");
                }
              } else {
                message.warning("⚠️ Invalid order ID!");
              }
            } else {
              message.warning("⚠️ Please place an order first!");
            }
          }}
          className="mt-2 w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
        >
          {checkout ? "Hide Checkout" : "Checkout & Generate Bill"}
        </button>

  {checkout && (
  <div className="mt-3 p-3 border rounded-lg bg-yellow-50 text-yellow-800 space-y-2 relative z-50">
    {/* Profile Image */}
    {profiles.length > 0 && profiles[0].profile_image ? (
      <div className="flex justify-center mb-3">
        <img
          src={profiles[0].profile_image}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400"
        />
      </div>
    ) : (
      <p className="text-center text-gray-500">No profile image available</p>
    )}

    <h3 className="font-semibold mb-2">🛒 Checkout Items</h3>

    {/* Display Items with Tax % only */}
    {cart.length > 0 ? (
      <>
        {cart.map((item) => {
          const qty = Number(item.qty) || 0;
          const totalPrice = Number(item.price_with_tax || item.price) || 0;
          const taxPercent = Number(item.tax_percent) || 0;

          return (
            <div key={item.id} className="flex justify-between py-1 border-b">
              <span>{item.item_name} x {qty} (Tax: {taxPercent}%)</span>
              <span>₹ {(totalPrice * qty).toFixed(2)}</span>
            </div>
          );
        })}

        {/* Grand Total */}
        <hr className="border-t border-yellow-300 my-2" />
        <div className="flex justify-between font-bold text-xl mt-2">
          <span>Grand Total</span>
          <span>
            ₹ {cart.reduce((sum, item) => sum + Number(item.price_with_tax) * Number(item.qty), 0).toFixed(2)}
          </span>
        </div>
      </>
    ) : orders.length > 0 ? (
      <>
        {orders[orders.length - 1]?.originalItems?.map((item) => {
          const qty = Number(item.qty) || 0;
          const totalPrice = Number(item.price_with_tax || item.price) || 0;
          const taxPercent = Number(item.tax_percent) || 0;

          return (
            <div key={item.id} className="flex justify-between py-1 border-b">
              <span>{item.item_name} x {qty} (Tax: {taxPercent}%)</span>
              <span>₹ {(totalPrice * qty).toFixed(2)}</span>
            </div>
          );
        })}

        {/* Grand Total */}
        <hr className="border-t border-yellow-300 my-2" />
        <div className="flex justify-between font-bold text-xl mt-2">
          <span>Grand Total</span>
          <span>
            ₹ {orders[orders.length - 1]?.originalItems?.reduce(
              (sum, item) => sum + Number(item.price_with_tax) * Number(item.qty),
              0
            ).toFixed(2)}
          </span>
        </div>
      </>
    ) : (
      <p className="text-center text-yellow-600">No items in cart (Place an order to view!)</p>
    )}

    {/* Request Bill Button */}
    {orders.length > 0 && billRequested[orders[orders.length - 1]?.id] && (
      <>
        <button
          onClick={() => setIsBillModalOpen(true)}
          className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Request Bill
        </button>

        <p className="text-2xs text-black text-center">Powered by</p>
        <div className="mt-4 flex flex-col items-center text-center">
          <img src={xtownlogo} alt="XTOWN Logo" className="h-10 object-contain mb-2" />
        </div>
      </>
    )}
  </div>
)}


      </div>

      <Modal
        title="Request Bill"
        open={isBillModalOpen}
        onCancel={() => setIsBillModalOpen(false)}
        onOk={handleBillFormSubmit}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="billAmount"
            label="Bill Amount"
            rules={[{ required: true, message: "Bill amount is required" }]}
          >
            <Input type="text" disabled />
          </Form.Item>

          <Form.Item
            name="paymentMethod"
            label="Payment Method"
            rules={[{ required: true, message: "Select a payment method" }]}
          >
            <select
              className="w-full border rounded p-2"
              onChange={(e) =>
                form.setFieldValue("paymentMethod", e.target.value)
              }
            >
              <option value="">Select Method</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
            </select>
          </Form.Item>

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

              {/* <Form.Item name="balance" label="Balance">
                <Input type="text" disabled />
              </Form.Item> */}
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <select className="w-full border rounded p-2">
                  <option value="">Select Status</option>
                  <option value="SUCCESS">Success</option>
                </select>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Menu;

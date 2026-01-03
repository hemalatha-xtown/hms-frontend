// import { useState, useEffect } from "react";
// import { message } from "antd";
// import {
//   menuService,
//   billService,
//   paymentService,
// } from "../../../models/Menus";
// import jsPDF from "jspdf";
// import { connectQZ } from "../Menu/qzHelper";
// import topLogo from "../../../../components/assets/HotelLogo.png";
// import bottomLogo from "../../../../components/assets/xtownlogo.png";
// import qz from "qz-tray";

// const useMenuController = () => {
//   const [loading, setLoading] = useState(false);
//   const [menus, setMenus] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [tables, setTables] = useState([]);

//   // Fetch menus
//   const fetchMenus = async () => {
//     try {
//       setLoading(true);
//       const res = await menuService.list();
//       setMenus(res.data?.data || []);
//     } catch (err) {
//       console.error("❌ Error fetching menu items:", err);
//       message.error("❌ Failed to fetch menu items");
//     } finally {
//       setLoading(false);
//     }
//   };
// const connectQZ = async () => {
//   if (!qz.websocket.isActive()) {
//     try {
//       await qz.websocket.connect();
//       console.log("✅ Connected to QZ Tray");
//     } catch (err) {
//       console.error("❌ Could not connect to QZ Tray:", err);
//     }
//   }
// };
// const getPrinters = async () => {
//   const printers = await qz.printers.find();
//   console.log("🖨️ Available printers:", printers);
// };

//   // Fetch tables
//   const fetchTables = async () => {
//     try {
//       const res = await menuService.getTables();
//       // Access the actual array of tables
//       const activeTables = res.data?.data?.filter((t) => t.is_active) || [];
//       setTables(activeTables);
//     } catch (err) {
//       console.error("❌ Failed to fetch tables:", err);
//       message.error("❌ Failed to load tables!");
//     }
//   };

//   useEffect(() => {
//     fetchMenus();
//     fetchTables();
//   }, []);

//   // Cart operations
//   const addToCart = (item, qty = 1) => {
//     setCart((prev) => {
//       const exists = prev.find((p) => p.id === item.id);
//       if (exists)
//         return prev.map((p) =>
//           p.id === item.id ? { ...p, qty: p.qty + qty } : p
//         );
//       return [...prev, { ...item, qty }];
//     });
//   };

//   const updateQty = (id, newQty) => {
//     setCart((prev) =>
//       prev
//         .map((p) => (p.id === id ? { ...p, qty: newQty } : p))
//         .filter((p) => p.qty > 0)
//     );
//   };

//   const getCartItem = (id) => cart.find((c) => c.id === id);

//   const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

//   // Place order
// const placeOrder = async ({ order_code, table_no, order_type, items }) => {
//     try {
//       console.log(
//         "Submitting items:",
//         cart.map((item) => ({ ...item, quantity: item.qty }))
//       );

//       const postRes = await menuService.create({
//         order_code,
//         table_no,
//         order_type,
//         items: items.map((item) => ({
//           item_name: item.item_name,
//           quantity: Number(item.qty ?? item.quantity ?? 0),
//           price: Number(item.price ?? 0),
//         })),
//       });

//       const orderId = postRes.data?.id || postRes.data?.order?.id;
//       if (!orderId) throw new Error("No order ID returned from POST");

//       const getRes = await menuService.get(orderId);
//       const fullOrder = getRes.data?.order || getRes.data;

//       console.log("✅ Order placed:", fullOrder);
//       setCart([]);
//       return fullOrder;
//     } catch (err) {
//       console.error("❌ Order failed:", err.response?.data || err.message);
//       message.error(`❌ Failed: ${err.response?.data?.message || err.message}`);
//       throw err;
//     }
//   };
//   // Generate Bill
//   const generateBill = async (order_id) => {
//     try {
//       const res = await billService.generate(order_id);
//       if (res.data.success) return res.data.data;
//       message.error("❌ Failed to generate bill!");
//     } catch (err) {
//       console.error(
//         "❌ Bill generation error:",
//         err.response?.data || err.message
//       );
//       message.error("❌ Failed to generate bill!");
//     }
//   };
// const printBill = async (billData, orderItems = []) => {
//   if (!billData) return;

//   // Step 1: Generate PDF
//   const totalAmount = billData.bill_amount || 0;
//   const width = 2.25 * 25.4;
//   const height = 3 * 25.4;
//   const doc = new jsPDF({ unit: "mm", format: [width, height], compress: true });

//   // ... your existing jsPDF drawing code here ...

//   // Step 2: Convert PDF to Base64
//   const pdfBase64 = doc.output("datauristring").split(",")[1];

//   // Step 3: Connect to QZ Tray
//   try {
//     await connectQZ();
//   } catch (err) {
//     console.error("⚠️ Cannot connect to QZ Tray:", err);
//     return;
//   }

//   // Step 4: Printer Configuration
//   const printerName = "POS-80-Series"; // use actual name from QZ Tray
//   const config = qz.configs.create(printerName, {
//     copies: 1,
//     colorType: "blackwhite",
//     orientation: "portrait",
//   });

//   // Step 5: Send PDF to printer
//   try {
//     await qz.print(config, [{ type: "pdf", format: "base64", data: pdfBase64 }]);
//     console.log("✅ Print sent successfully to", printerName);
//   } catch (err) {
//     console.error("❌ Printing failed:", err);
//   }
// };

//   // Make Payment
//   const makePayment = async (paymentData, orderItems = []) => {
//     const {
//       order_id,
//       bill_id,
//       bill_amount,
//       amount_received,
//       balance,
//       method,
//       status,
//     } = paymentData;

//     try {
//       let actualBillId = bill_id;

//       // Generate bill if not already
//       if (!bill_id) {
//         const generatedBill = await billService.generate(order_id);
//         actualBillId = generatedBill?.id;
//       }

//       // Create payment
//       const res = await paymentService.create({
//         order_id,
//         bill_id: actualBillId,
//         bill_amount,
//         amount_received,
//         balance,
//         method,
//         status,
//       });

//       if (res.data.success) {
//         const billData = res.data.data;
//         billData.method = method; // attach payment method

//         // Use the passed orderItems instead of fetching from backend
//         let itemsForPrint = orderItems;

//         // Fallback: fetch from backend only if no items were passed
//         if (!itemsForPrint || itemsForPrint.length === 0) {
//           try {
//             console.warn("⚠️ No items passed, fetching from backend...");
//             const orderRes = await menuService.get(order_id);
//             itemsForPrint =
//               orderRes.data?.items || orderRes.data?.order?.items || [];
//           } catch (err) {
//             console.warn("⚠️ Could not fetch order items for print");
//             itemsForPrint = [];
//           }
//         }

//         console.log("Items for print:", itemsForPrint);
//         await printBill(billData, itemsForPrint);
//         return billData;
//       }

//       message.error("❌ Payment failed!");
//     } catch (err) {
//       console.error("❌ Payment error:", err.response?.data || err.message);
//       message.error("❌ Failed to process payment!");
//     }
//   };

//   return {
//     loading,
//     menus,
//     cart,
//     setCart,
//     tables,
//     addToCart,
//     updateQty,
//     getCartItem,
//     total,
//     placeOrder,
//     generateBill,
//     makePayment,
//     printBill,
//   };
// };

// export default useMenuController;
import { useState, useEffect } from "react";
import { message } from "antd";
import {
  menuService,
  billService,
  paymentService,
} from "../../../models/Menus";
import jsPDF from "jspdf";
import qz from "qz-tray";
import topLogo from "../../../../components/assets/HotelLogo.png";
import bottomLogo from "../../../../components/assets/xtownlogo.png";

// QZ Tray Helpers
const connectQZ = async () => {
  if (qz.websocket.isActive()) return;
  try {
    await qz.websocket.connect();
    console.log("✅ Connected to QZ Tray");
  } catch (err) {
    console.error("❌ QZ Tray connection failed:", err);
    alert("⚠️ Please open QZ Tray on your system before printing.");
    throw err;
  }
};

const getPrinters = async () => {
  try {
    await connectQZ();
    const printers = await qz.printers.find();
    console.log("🖨️ Available printers:", printers);
    return printers;
  } catch (err) {
    console.error("❌ Failed to get printers:", err);
    return [];
  }
};

const useMenuController = () => {
  const [loading, setLoading] = useState(false);
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [tables, setTables] = useState([]);

  // Fetch menus
  const fetchMenus = async () => {
    try {
      console.log("📡 Fetching menu items...");
      setLoading(true);

      const res = await menuService.list();
      console.log("✅ Full API Response:", res);

      const menus = res.data?.data || [];
      console.log("🍽️ Parsed Menu List:", menus);

      setMenus(menus);
      console.log("🎯 Menu state updated successfully. Total:", menus.length);
    } catch (err) {
      console.error("❌ Error fetching menu items:", err);
      message.error("❌ Failed to fetch menu items");
    } finally {
      console.log("🔁 FetchMenus completed");
      setLoading(false);
    }
  };

  // Fetch tables
  const fetchTables = async () => {
    try {
      const res = await menuService.getTables();
      const activeTables = res.data?.data?.filter((t) => t.is_active) || [];
      setTables(activeTables);
    } catch (err) {
      console.error("❌ Failed to fetch tables:", err);
      message.error("❌ Failed to load tables!");
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchTables();
  }, []);

  // Cart operations
  const addToCart = (item, qty = 1) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      if (exists)
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + qty } : p
        );
      return [...prev, { ...item, qty }];
    });
  };

  const updateQty = (id, newQty) => {
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: newQty } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const getCartItem = (id) => cart.find((c) => c.id === id);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Place order
  const placeOrder = async ({ order_code, table_no, order_type, items }) => {
    try {
      const postRes = await menuService.create({
        order_code,
        table_no,
        order_type,
        items: items.map((item) => ({
          item_name: item.item_name,
          quantity: Number(item.qty ?? item.quantity ?? 0),
          price: Number(item.price ?? 0),
        })),
      });

      const orderId = postRes.data?.id || postRes.data?.order?.id;
      if (!orderId) throw new Error("No order ID returned from POST");

      const getRes = await menuService.get(orderId);
      const fullOrder = getRes.data?.order || getRes.data;

      console.log("✅ Order placed:", fullOrder);
      setCart([]);
      return fullOrder;
    } catch (err) {
      console.error("❌ Order failed:", err.response?.data || err.message);
      message.error(`❌ Failed: ${err.response?.data?.message || err.message}`);
      throw err;
    }
  };

  // Generate bill
  const generateBill = async (order_id) => {
    try {
      const res = await billService.generate(order_id);
      if (res.data.success) return res.data.data;
      message.error("❌ Failed to generate bill!");
    } catch (err) {
      console.error(
        "❌ Bill generation error:",
        err.response?.data || err.message
      );
      message.error("❌ Failed to generate bill!");
    }
  };

  // Print bill

  const printBill = async (billData, orderItems = [], useRawIP = false) => {
    if (!billData) return;

    await connectQZ();

    if (!useRawIP) {
      const width = 2.25 * 25.4; // 57mm paper
      const baseHeight = 80;
      const perItemHeight = 4;
      const height = baseHeight + orderItems.length * perItemHeight;

      const doc = new jsPDF({
        unit: "mm",
        format: [width, height],
        compress: true,
      });

      let y = 5;
      const center = width / 2;
      const columnWidth = width / 3; // Equal spacing for three columns

      // Top Logo
      try {
        doc.addImage(topLogo, "PNG", center - 6, y, 12, 12);
        y += 18;
      } catch {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text("SRI KRISHNA BHAVAN", center, y + 4, { align: "center" });
        y += 10;
      }

      // Store Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("SRI KRISHNA BHAVAN", center, y, { align: "center" });
      y += 4;

      // Line
      doc.setLineWidth(0.3);
      doc.line(5, y, width - 5, y);
      y += 4;

      // Date & Time
      const now = new Date();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text(`Date: ${now.toLocaleDateString("en-IN")}`, center, y, {
        align: "center",
      });
      doc.text(
        `Time: ${now.toLocaleTimeString("en-IN", {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        center,
        y + 4,
        { align: "center" }
      );
      y += 8;

      // Table Header
      doc.setLineWidth(0.2);
      doc.line(5, y, width - 5, y);
      y += 3;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.text("ITEM", 5 + columnWidth * 0, y, { align: "left" });
      doc.text("QTY", 5 + columnWidth * 1, y, { align: "left" });
      doc.text("AMOUNT", 5 + columnWidth * 2, y, { align: "left" });
      y += 2;

      doc.line(5, y, width - 5, y);
      y += 2;

      // Items List
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      const itemNameWidth = columnWidth - 5; // Adjust for padding

      orderItems.forEach((item) => {
        const itemName = item.item_name || "Unknown";
        const qty = Number(item.qty ?? item.quantity ?? 1);
        const price = Number(item.price ?? 0);
        const total = (price * qty).toFixed(2);

        const wrapped = doc.splitTextToSize(itemName, itemNameWidth);
        wrapped.forEach((line, idx) => {
          if (idx === 0) {
            doc.text(line, 5 + columnWidth * 0, y, { align: "left" }); // Left-align item name
            doc.text(`${qty}`, 5 + columnWidth * 1, y, { align: "left" }); // Left-align quantity
            doc.text(`RS. ${total}`, 5 + columnWidth * 2, y, { align: "left" }); // Left-align amount
          } else {
            doc.text(line, 5 + columnWidth * 0, y, { align: "left" }); // Left-align wrapped lines
          }
          y += 3;
        });
      });

      // Line before Total
      y += 2;
      doc.setLineWidth(0.3);
      doc.line(5, y, width - 5, y);
      y += 4;

      // Payment Method
      doc.setFontSize(7);
      doc.text(`Payment: ${billData.method || "CASH"}`, center, y, {
        align: "center",
      });
      y += 4;

      // Total
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(
        `TOTAL RS. ${billData.bill_amount?.toFixed(2) || 0}`,
        center,
        y,
        { align: "center" }
      );
      y += 6;

      // Footer
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.setTextColor(80, 80, 80);
      doc.text("Thank you for dining with us!", center, y, { align: "center" });
      y += 3;
      doc.text("Visit again soon!", center, y, { align: "center" });
      y += 4;

      // Bottom Branding
      try {
        doc.setFontSize(4);
        doc.setTextColor(0, 0, 0);
        doc.text("Powered by", center, y, { align: "center" });
        y += 1;
        doc.addImage(bottomLogo, "PNG", center - 4, y, 8, 4);
      } catch {}

      // Print via QZ Tray
      const pdfBase64 = doc.output("datauristring").split(",")[1];
      const printers = await getPrinters();
      if (!printers.length) throw new Error("No printers found");
      const printerName = printers[0];
      const config = qz.configs.create(printerName, {
        copies: 1,
        colorType: "blackwhite",
      });

      await qz.print(config, [
        { type: "pdf", format: "base64", data: pdfBase64 },
      ]);
      console.log("✅ PDF printed successfully");
    } else {
      // Raw ESC/POS logic remains unchanged
      const printerIP = "192.168.1.151";
      const port = 9100;
      const config = qz.configs.create(`raw://${printerIP}:${port}`, {
        copies: 1,
      });

      const data = [
        "\x1B@", // Initialize
        "SRI KRISHNA BHAVAN\n",
        "--------------------------\n",
        ...orderItems.map(
          (item) =>
            `${item.item_name.padEnd(12)} ${String(item.qty).padStart(3)} ${
              item.price
            }\n`
        ),
        "--------------------------\n",
        `TOTAL: RS. ${billData.bill_amount?.toFixed(2) || 0}\n`,
        `Payment: ${billData.method || "CASH"}\n\n`,
        "Thank you! Visit again!\n",
        "\x1D\x56\x41", // Cut
      ];

      await qz.print(config, data);
      console.log("✅ Raw print sent to", printerIP);
    }
  };
  // const printBill = async (billData, orderItems = [], useRawIP = false) => {
  //   if (!billData) return;

  //   await connectQZ();

  //   if (!useRawIP) {
  //     // ===== Dynamic PDF via installed printer =====
  //     const width = 2.25 * 25.4; // paper width in mm

  //     // dynamic height based on number of items
  //     const baseHeight = 60; // space for header/footer
  //     const perItemHeight = 4; // each item ~4mm
  //     const height = baseHeight + orderItems.length * perItemHeight;

  //     const doc = new jsPDF({ unit: "mm", format: [width, height], compress: true });

  //     let y = 5;
  //     const leftMargin = 2;
  //     const rightMargin = width - 2;
  //     const centerX = width / 2;

  //     // ===== Top Logo =====
  //     try {
  //       const logoWidth = 24;
  //       const logoHeight = 24;
  //       doc.addImage(topLogo, "PNG", centerX - logoWidth / 2, y, logoWidth, logoHeight);
  //       y += logoHeight + 6;
  //     } catch {
  //       doc.setFontSize(10);
  //       doc.setFont("helvetica", "bold");
  //       doc.text("XTOWN", centerX, y + 6, { align: "center" });
  //       y += 12;
  //     }

  //     // ===== Restaurant Name =====
  //     doc.setFontSize(8); // smaller font so XTOWN fits
  //     doc.setFont("helvetica", "bold");
  //     doc.text("SRI KRISHNA BHAVAN", centerX, y, { align: "center" });
  //     y += 4;

  //     // ===== Decorative Line =====
  //     doc.setLineWidth(0.5);
  //     doc.setDrawColor(100, 100, 100);
  //     doc.line(leftMargin + 5, y, rightMargin - 5, y);
  //     y += 4;

  //     // ===== Date & Time =====
  //     const now = new Date();
  //     const dateStr = now.toLocaleDateString("en-IN");
  //     const timeStr = now.toLocaleTimeString("en-IN", { hour12: true, hour: "2-digit", minute: "2-digit" });
  //     doc.setFontSize(7);
  //     doc.setFont("helvetica", "normal");
  //     doc.text(`Date: ${dateStr}`, leftMargin, y);
  //     doc.text(`Time: ${timeStr}`, rightMargin, y, { align: "right" });
  //     y += 4;

  //     // ===== Items Header =====
  //     doc.setLineWidth(0.3);
  //     doc.line(leftMargin, y, rightMargin, y);
  //     y += 3;
  //     doc.setFontSize(7);
  //     doc.setFont("helvetica", "bold");
  //     doc.text("ITEMS", leftMargin, y);
  //     doc.text("QTY", centerX, y, { align: "center" });
  //     doc.text("AMOUNT", rightMargin, y, { align: "right" });
  //     y += 3;
  //     doc.setLineWidth(0.2);
  //     doc.line(leftMargin, y, rightMargin, y);
  //     y += 3;

  //     // ===== Items List =====
  //     doc.setFont("helvetica", "normal");
  //     doc.setFontSize(6);
  //     orderItems.forEach((item) => {
  //       const itemName = item.item_name || "Unknown";
  //       const qty = Number(item.qty ?? item.quantity ?? 1);
  //       const price = Number(item.price ?? 0);
  //       const total = (price * qty).toFixed(2);

  //       const displayName = itemName.length > 12 ? itemName.substring(0, 12) + "..." : itemName;

  //       doc.text(displayName, leftMargin, y);
  //       doc.text(`${qty}`, centerX, y, { align: "center" });
  //       doc.text(`${total}`, rightMargin, y, { align: "right" }); // No RS for individual items
  //       y += 4; // individual item spacing
  //     });

  //     // ===== Total & Payment =====
  //     y += 2;
  //     doc.setLineWidth(0.3);
  //     doc.line(leftMargin, y, rightMargin, y);
  //     y += 3;
  //     doc.setFontSize(6);
  //     doc.text(`Payment: ${billData.method || "CASH"}`, leftMargin, y);
  //     y += 3;
  //     doc.setFontSize(8);
  //     doc.setFont("helvetica", "bold");
  //     doc.text("TOTAL:", centerX - 8, y);
  //     doc.text(`RS.${billData.bill_amount?.toFixed(2) || 0}`, rightMargin, y, { align: "right" }); // RS only for total
  //     y += 5;

  //     // ===== Thank You Note =====
  //     doc.setFontSize(6);
  //     doc.setFont("helvetica", "normal");
  //     doc.setTextColor(80, 80, 80);
  //     doc.text("Thank you for dining with us!", centerX, y, { align: "center" });
  //     y += 3;
  //     doc.text("Visit again soon!", centerX, y, { align: "center" });

  //     // ===== Bottom Logo =====
  //     try {
  //       y += 4;
  //       doc.setFontSize(4);
  //       doc.setTextColor(0, 0, 0);
  //       doc.text("Powered by", centerX, y, { align: "center" });
  //       y += 0.5;
  //       doc.addImage(bottomLogo, "PNG", centerX - 4, y, 8, 4);
  //     } catch {}

  //     // ===== Print PDF via QZ Tray =====
  //     const pdfBase64 = doc.output("datauristring").split(",")[1];
  //     const printers = await getPrinters();
  //     if (!printers.length) throw new Error("No printers found");
  //     const printerName = printers[0];
  //     const config = qz.configs.create(printerName, { copies: 1, colorType: "blackwhite" });
  //     await qz.print(config, [{ type: "pdf", format: "base64", data: pdfBase64 }]);
  //     console.log("✅ PDF printed successfully");

  //   } else {
  //     // ===== Raw ESC/POS printing =====
  //     const printerIP = "192.168.1.151";
  //     const port = 9100;
  //     const config = qz.configs.create(`raw://${printerIP}:${port}`, { copies: 1 });

  //     const data = [
  //       "\x1B@",               // Initialize printer
  //       "SRI KRISHNA BHAVAN\n",
  //       "----------------------\n",
  //       ...orderItems.map((item) => `${item.item_name} x${item.qty} ${item.price}\n`), // individual items
  //       "----------------------\n",
  //       `TOTAL: RS.${billData.bill_amount?.toFixed(2) || 0}\n`,
  //       `Payment: ${billData.method || "CASH"}\n`,
  //       "Thank you for dining with us!\nVisit again soon!\n",
  //       "\x1D\x56\x41",         // Cut paper
  //     ];

  //     await qz.print(config, data);
  //     console.log("✅ Raw print sent to", printerIP);
  //   }
  // };

  // Make payment
  const makePayment = async (paymentData, orderItems = []) => {
    const {
      order_id,
      bill_id,
      bill_amount,
      amount_received,
      balance,

      method,
      status,
    } = paymentData;

    try {
      let actualBillId = bill_id;

      if (!bill_id) {
        const generatedBill = await billService.generate(order_id);
        actualBillId = generatedBill?.id;
      }

      const res = await paymentService.create({
        order_id,
        bill_id: actualBillId,
        bill_amount,
        amount_received,
        balance,
        method,
        status,
      });

      if (res.data.success) {
        const billData = res.data.data;
        billData.method = method;

        let itemsForPrint = orderItems;
        if (!itemsForPrint || itemsForPrint.length === 0) {
          const orderRes = await menuService.get(order_id);
          itemsForPrint =
            orderRes.data?.items || orderRes.data?.order?.items || [];
        }

        console.log("Items for print:", itemsForPrint);
        await printBill(billData, itemsForPrint);
        return billData;
      }

      message.error("❌ Payment failed!");
    } catch (err) {
      console.error("❌ Payment error:", err.response?.data || err.message);
      message.error("❌ Failed to process payment!");
    }
  };

  return {
    loading,
    menus,
    cart,
    setCart,
    tables,
    addToCart,
    updateQty,
    getCartItem,
    total,
    placeOrder,
    generateBill,
    makePayment,
    printBill,
    connectQZ,
    getPrinters,
  };
};

export default useMenuController;

// import qz from "qz-tray";

// // ✅ Establish connection with QZ Tray
// export const connectQZ = async () => {
//   if (qz.websocket.isActive()) {
//     console.log("✅ QZ Tray already connected");
//     return;
//   }

//   try {
//     await qz.websocket.connect();
//     console.log("✅ Connected to QZ Tray");
//   } catch (err) {
//     console.error("❌ QZ Tray connection failed:", err);
//     alert("⚠️ Please open QZ Tray on your system before printing.");
//     throw err;
//   }
// };

// // 🔌 Optional disconnect helper
// export const disconnectQZ = async () => {
//   if (qz.websocket.isActive()) {
//     await qz.websocket.disconnect();
//     console.log("🔌 QZ Tray disconnected");
//   }
// };

// // 🖨️ Fetch all available printers
// export const getPrinters = async () => {
//   try {
//     await connectQZ();
//     const printers = await qz.printers.find();
//     console.log("🖨️ Available printers:", printers);
//     return printers;
//   } catch (err) {
//     console.error("❌ Failed to get printers:", err);
//     return [];
//   }
// };

import qz from "qz-tray";
import { message } from "antd";
import jsPDF from "jspdf";
import topLogo from "./assets/HotelLogo.png"; // adjust path
import bottomLogo from "./assets/xtownlogo.png"; // adjust path

// ✅ Connect to QZ Tray
export const connectQZ = async () => {
  if (!qz.websocket.isActive()) {
    try {
      await qz.websocket.connect();
      console.log("✅ Connected to QZ Tray");
    } catch (err) {
      console.error("❌ QZ Tray connection failed:", err);
      alert("⚠️ Please open QZ Tray before printing.");
      throw err;
    }
  }
};

// 🔌 Get installed printers
export const getPrinters = async () => {
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

// 🖨️ Print bill function
export const printBill = async (billData, orderItems = [], useRawIP = false) => {
  if (!billData) return;

  await connectQZ();

  if (!useRawIP) {
    // ===== PDF via installed printer =====
    const width = 2.25 * 25.4;
    const height = 3 * 25.4;
    const doc = new jsPDF({ unit: "mm", format: [width, height], compress: true });

    let y = 5;
    const leftMargin = 2;
    const rightMargin = width - 2;
    const centerX = width / 2;

    // Top logo
    try {
      doc.addImage(topLogo, "PNG", centerX - 12 / 2, y, 12, 12);
      y += 18;
    } catch {
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("XTOWN", centerX, y + 4, { align: "center" });
      y += 8;
    }

    // Restaurant name
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("SRI KRISHNA BHAVAN", centerX, y, { align: "center" });
    y += 4;

    // Decorative line
    doc.setLineWidth(0.5);
    doc.setDrawColor(100, 100, 100);
    doc.line(leftMargin + 5, y, rightMargin - 5, y);
    y += 4;

    // Date & Time
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN");
    const timeStr = now.toLocaleTimeString("en-IN", { hour12: true, hour: "2-digit", minute: "2-digit" });
    doc.text(`Date: ${dateStr}`, leftMargin, y);
    doc.text(`Time: ${timeStr}`, rightMargin, y, { align: "right" });
    y += 4;

    // Items header
    doc.setLineWidth(0.3);
    doc.line(leftMargin, y, rightMargin, y);
    y += 3;
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("ITEMS", leftMargin, y);
    doc.text("QTY", centerX, y, { align: "center" });
    doc.text("AMOUNT", rightMargin, y, { align: "right" });
    y += 3;
    doc.setLineWidth(0.2);
    doc.line(leftMargin, y, rightMargin, y);
    y += 3;

    // Items
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    orderItems.forEach((item) => {
      const itemName = item.item_name || "Unknown";
      const qty = Number(item.qty ?? item.quantity ?? 1);
      const price = Number(item.price ?? 0);
      const total = (price * qty).toFixed(2);

      const displayName = itemName.length > 12 ? itemName.substring(0, 12) + "..." : itemName;

      doc.text(displayName, leftMargin, y);
      doc.text(`${qty}`, centerX, y, { align: "center" });
      doc.text(`₹${total}`, rightMargin, y, { align: "right" });
      y += 3.5;
    });

    // Total & Payment
    y += 2;
    doc.setLineWidth(0.3);
    doc.line(leftMargin, y, rightMargin, y);
    y += 3;
    doc.setFontSize(6);
    doc.text(`Payment: ${billData.method || "CASH"}`, leftMargin, y);
    y += 3;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL:", centerX - 8, y);
    doc.text(`₹${billData.bill_amount?.toFixed(2) || 0}`, rightMargin, y, { align: "right" });
    y += 5;

    // Thank you note
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text("Thank you for dining with us!", centerX, y, { align: "center" });
    y += 3;
    doc.text("Visit again soon!", centerX, y, { align: "center" });

    // Bottom logo
    try {
      y += 4;
      doc.setFontSize(4);
      doc.setTextColor(0, 0, 0);
      doc.text("Powered by", centerX, y, { align: "center" });
      y += 0.5;
      doc.addImage(bottomLogo, "PNG", centerX - 4, y, 8, 4);
    } catch {
      // ignore if logo fails
    }

    // Convert to base64 and print via QZ Tray
    const pdfBase64 = doc.output("datauristring").split(",")[1];
    const printers = await getPrinters();
    if (!printers.length) throw new Error("No printers found");
    const printerName = printers[0];
    const config = qz.configs.create(printerName, { copies: 1, colorType: "blackwhite" });
    await qz.print(config, [{ type: "pdf", format: "base64", data: pdfBase64 }]);
    console.log("✅ PDF printed successfully");

  } else {
    // ===== Raw network printing =====
    const printerIP = "192.168.1.151";
    const port = 9100;
    const config = qz.configs.create(`raw://${printerIP}:${port}`, { copies: 1 });

    // ESC/POS commands for basic receipt
    const data = [
      "\x1B@",               // Initialize printer
      "SRI KRISHNA BHAVAN\n",
      "----------------------\n",
      ...orderItems.map((item) => `${item.item_name} x${item.qty} ₹${item.price}\n`),
      "----------------------\n",
      `TOTAL: ₹${billData.bill_amount?.toFixed(2) || 0}\n`,
      `Payment: ${billData.method || "CASH"}\n`,
      "\x1D\x56\x41",         // Cut paper
    ];

    await qz.print(config, data);
    console.log("✅ Raw print sent to", printerIP);
  }
};

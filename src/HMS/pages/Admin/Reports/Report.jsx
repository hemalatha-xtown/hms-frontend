import React, { useRef, useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  DatePicker,
  Select,
  Tag,
  Card,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  PrinterOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Dropdown } from "antd";
import jsPDF from "jspdf";
import dayjs from "dayjs";
import autoTable from "jspdf-autotable";
import useReportLogic from "../Reports/Report";
import { Content } from "rsuite";

const { Option } = Select;

const ReportPage = () => {
  const printRef = useRef();
  const {
    filteredRows,
    filterType,
    filterDate,
    setFilterType,
    setFilterDate,
    calculateRowTotal,
    calculateGrandTotal,
    handleDelete,
  } = useReportLogic();

  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState(1); // pagination current page
  const [pageSize, setPageSize] = useState(10); // pagination size

  const rupee = "\u20B9";
  const grandTotal = calculateGrandTotal();

  const searchedRows = filteredRows.filter((row) =>
    row.menuItem?.toLowerCase().includes(search.toLowerCase())
  );

  /** Reset pagination when search or filters change */
  useEffect(() => {
    setCurrent(1);
  }, [search, filterType, filterDate]);
  const getActionMenu = (record) => ({
    items: [
    
      {
        key: "delete",
        label: (
          <Popconfirm
            title="Confirm delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} block>
              Delete
            </Button>
          </Popconfirm>
        ),
      },
    ],
    selectable: false,
    mode: "vertical",
  });

  /** PDF Download */
  /** PDF Download */
  const handleDownloadPDF = () => {
    if (searchedRows.length === 0) return alert("No data to export");

    const doc = new jsPDF();

    // ✅ Use built-in font (no need to import .ttf)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("SRI KRISHNA BHAVAN", 105, 15, null, null, "center");
    doc.text("BLESSED FLAVOURS OF KRISHNA'S KITCHEN", 105, 22, null, null, "center");

    // Date range
    const dates = searchedRows.map((row) => row.date);
    const minDate = dates.length
      ? dayjs(Math.min(...dates.map((d) => new Date(d)))).format("DD MMM YYYY")
      : "";
    const maxDate = dates.length
      ? dayjs(Math.max(...dates.map((d) => new Date(d)))).format("DD MMM YYYY")
      : "";
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date Range: ${minDate} - ${maxDate}`, 150, 38, { align: "center" });

    const totalAmount = searchedRows.reduce(
      (sum, row) => sum + calculateRowTotal(row),
      0
    );
    const totalReceived = searchedRows.reduce(
      (sum, row) => sum + (row.cashReceived || 0),
      0
    );
    const totalBalance = totalAmount - totalReceived;

    autoTable(doc, {
      head: [
        [
          "Date",
          "Menu Item",
          "Qty",
          "Total (₹)",
          "Received (₹)",
          "Payment Type",
          "Status",
        ],
      ],
      body: [
        ...searchedRows.map((row) => [
          dayjs(row.date).format("YYYY-MM-DD"),
          row.menuItem,
          row.qty,
          `₹ ${calculateRowTotal(row)}`,
          `₹ ${row.cashReceived || 0}`,
          row.paymentType,
          row.status,
        ]),
        // ✅ Grand Total row
        [
          {
            content: "Grand Total",
            colSpan: 3,
            styles: { halign: "right", fontStyle: "bold" },
          },
          { content: `₹ ${totalAmount}`, styles: { fontStyle: "bold" } },
          { content: `₹ ${totalReceived}`, styles: { fontStyle: "bold" } },
          { content: `₹ ${totalBalance}`, styles: { fontStyle: "bold" } },
        ],
      ],
      startY: 45,
      styles: { fontSize: 11, cellPadding: 5 },
      headStyles: { fillColor: [22, 160, 133] },
      theme: "grid",
    });

    // Page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 10,
        { align: "right" }
      );
    }

    doc.save("payment-report.pdf");
  };



  /** Print */
  const handlePrint = () => {
    const win = window.open("", "", "height=700,width=900");
    win.document.write("<html><head><title>Print Report</title>");
    win.document.write(
      "<style>table { width:100%; border-collapse: collapse; } th, td { border: 1px solid #ccc; padding: 8px; }</style>"
    );
    win.document.write("</head><body>");
    win.document.write(printRef.current.innerHTML);
    win.document.write(
      `<div style="margin-top:16px;text-align:right;font-weight:bold;font-size:16px;">Grand Total: ${rupee} ${grandTotal}</div>`
    );
    win.document.write("</body></html>");
    win.document.close();
    win.onload = () => {
      win.focus();
      win.print();
      win.close();
    };
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (d) => dayjs(d).format("YYYY-MM-DD"),
    },
    { title: "Menu Item", dataIndex: "menuItem" },
    { title: "Qty", dataIndex: "qty" },
    {
      title: "Total (₹)",
      render: (_, row) => `${rupee} ${calculateRowTotal(row)}`,
    },
    {
      title: "Received (₹)",
      render: (_, row) => `${rupee} ${row.cashReceived || 0}`,
    },

    { title: "Payment Type", dataIndex: "paymentType" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          color={status === "Collected" ? "green" : "red"}
          style={{ fontWeight: "bold" }}
        >
          {status}
        </Tag>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown menu={getActionMenu(record)} trigger={["click"]}>
          <Button>⋮</Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Report</h1>
        <div className="flex flex-wrap gap-3 items-center">
          <Input
            placeholder="Search menu item"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
          />
          <Select
            value={filterType}
            onChange={setFilterType}
            style={{ width: 140 }}
          >
            <Option value="all">All</Option>
            <Option value="daily">Daily</Option>
            <Option value="weekly">Weekly</Option>
            <Option value="monthly">Monthly</Option>
          </Select>
          {filterType !== "all" && (
            <DatePicker
              value={filterDate ? dayjs(filterDate) : null}
              onChange={(d) => setFilterDate(d ? d.format("YYYY-MM-DD") : null)}
            />
          )}
          <Space>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              onClick={handlePrint}
            >
              Print Report
            </Button>
          </Space>
        </div>
      </div>

      {/* Table */}
      <div ref={printRef}>
        <Table
          dataSource={searchedRows}
          columns={columns}
          rowKey="id"
          bordered
          scroll={{ x: "max-content" }}
          pagination={{
            current,
            pageSize,
            total: searchedRows.length,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total, range) =>
              `${range[0]}–${range[1]} of ${total} items`,
            onChange: (page, size) => {
              setCurrent(page);
              setPageSize(size);
            },
          }}
        />
      </div>

      {/* Grand Total */}
      <div className="flex justify-end mt-4 w-full">
        <Card
          className="w-full sm:w-80 text-right bg-[#e7d8d8ff]"
          bodyStyle={{ padding: "12px" }}
        >
          <div className="font-bold text-lg">
            Grand Total: {rupee}{" "}
            {Math.floor(grandTotal).toLocaleString("en-IN")}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportPage;
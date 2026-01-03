import React, { useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  Space,
  Switch,
  Tooltip,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useTableController } from "../Table/Table";
import { QRCodeCanvas } from "qrcode.react";

const TablePage = () => {
  // Initialize AntD message API
  const [messageApi, contextHolder] = message.useMessage();

  // Controller with API logic
  const {
    loading,
    tables,
    pagination,
    setPagination,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useTableController(messageApi);

  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);
  const [qrModal, setQrModal] = useState({ open: false, record: null });

  // Extract existing table numbers for duplicate check
  const existingValues = tables
    .filter((row) => !row.is_deleted)
    .map((row) =>
      row.table_number?.replace(/^Table_/, "").toString().toLowerCase().trim()
    );

  const openModal = (record = null) => {
    setEditingRecord(record);
    setModalOpen(true);
    if (record) {
      const tableNumber = record.table_number?.replace(/^Table_/, "");
      form.setFieldsValue({ table_no: tableNumber });
    } else {
      form.resetFields();
    }
  };

  const handleSave = () => {
    form
      .validateFields()
      .then(async (values) => {
        if (!values.table_no) return;

        const inputValue = values.table_no.toString().toLowerCase().trim();

        // Duplicate check (exclude current record if editing)
        const isDuplicate =
          existingValues.includes(inputValue) &&
          (!editingRecord ||
            editingRecord.table_number?.replace(/^Table_/, "").toLowerCase() !==
            inputValue);

        if (isDuplicate) {
          messageApi.warning("Table number already exists");
          return;
        }

        const payload = { table_number: `Table_${values.table_no}` };

        try {
          if (editingRecord) {
            await handleUpdate(editingRecord.id, payload);
            messageApi.success("Table updated successfully");
          } else {
            await handleCreate(payload);
            messageApi.success("Table created successfully");
          }
        } catch (err) {
          console.error(err);
          messageApi.error("Failed to save table");
        }

        setModalOpen(false);
        form.resetFields();
      })
      .catch((err) => console.log("Validation Failed:", err));
  };

  const columns = [
    {
      title: "Table No",
      dataIndex: "table_number",
      key: "table_number",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Active",
      dataIndex: "is_active",
      key: "is_active",
      render: (active, record) => (
        <Switch
          checked={active}
          onChange={async (checked) => {
            try {
              await handleUpdate(record.id, { is_active: checked });
              messageApi.success("Table status updated");
            } catch (err) {
              console.error(err);
              messageApi.error("Failed to update status");
            }
          }}
        />
      ),
    },
    {
      title: "QR Code",
      key: "qr",
      render: (_, record) => {
        const base = import.meta.env.DEV
          ? "http://192.168.1.14:5174"
          : import.meta.env.VITE_PUBLIC_BASE_URL || window.location.origin;

        const qrValue = `${base}/GuestLogin?table=${record.table_number}&id=${record.id}`;
        const fileName = `${record.table_number}-qr.png`;

        return (
          <div style={{ textAlign: "center" }}>
            <QRCodeCanvas value={qrValue} size={64} />
            <div
              style={{
                marginTop: 8,
                display: "flex",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Tooltip title="View QR">
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => setQrModal({ open: true, record })}
                />
              </Tooltip>
              <Tooltip title="Download QR">
                <Button
                  type="text"
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    const canvas = document.getElementById(`qr-${record.id}`);
                    if (canvas) {
                      const pngUrl = canvas
                        .toDataURL("image/png")
                        .replace("image/png", "image/octet-stream");
                      const downloadLink = document.createElement("a");
                      downloadLink.href = pngUrl;
                      downloadLink.download = fileName;
                      downloadLink.click();
                    }
                  }}
                />
              </Tooltip>
            </div>
            {/* Hidden canvas for download */}
            <QRCodeCanvas
              id={`qr-${record.id}`}
              value={qrValue}
              size={256}
              style={{ display: "none" }}
            />
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
          <Popconfirm
            title="Confirm delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="p-6">
        <div className="flex justify-end mb-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            Add Table
          </Button>
        </div>

        <Table
          loading={loading}
          dataSource={tables.filter((row) => !row.is_deleted)}
          columns={columns}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) =>
              setPagination({ ...pagination, current: page, pageSize }),
          }}
        />

        {/* QR Modal */}
        <Modal
          open={qrModal.open}
          title={qrModal.record?.table_number}
          footer={null}
          onCancel={() => setQrModal({ open: false, record: null })}
          centered
        >
          {qrModal.record && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              {(() => {
                const base = import.meta.env.DEV
                  ? "http://192.168.1.14:5174"
                  : import.meta.env.VITE_PUBLIC_BASE_URL ||
                  window.location.origin;

                const qrValue = `${base}/GuestLogin?table=${qrModal.record.table_number}&id=${qrModal.record.id}`;
                const fileName = `${qrModal.record.table_number}-qr.png`;
                const canvasId = `modal-qr-${qrModal.record.id}`;

                return (
                  <>
                    <QRCodeCanvas id={canvasId} value={qrValue} size={256} />
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={() => {
                        const canvas = document.getElementById(canvasId);
                        if (canvas) {
                          const pngUrl = canvas
                            .toDataURL("image/png")
                            .replace("image/png", "image/octet-stream");
                          const downloadLink = document.createElement("a");
                          downloadLink.href = pngUrl;
                          downloadLink.download = fileName;
                          downloadLink.click();
                        }
                      }}
                    >
                      Download
                    </Button>
                  </>
                );
              })()}
            </div>
          )}
        </Modal>

        {/* Add/Edit Modal */}
        <Modal
          title={editingRecord ? "Edit Table" : "Add Table"}
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onOk={handleSave}
          okText={editingRecord ? "Update" : "Create"}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="table_no"
              label="Table Number"
              rules={[{ required: true, message: "Please enter table number" }]}
            >
              <Input placeholder="Enter table number" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default TablePage;

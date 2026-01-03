import React, { useState, useMemo } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Input,
  Modal,
  Form,
  Tag ,
  Switch,
  InputNumber,
  Dropdown,
  message,
  Pagination,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useTaxController } from "../Tax/Tax";

const TaxPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    loading,
    taxes,
    pagination,
    setPagination,
    modalOpen,
    setModalOpen,
    formData,
    setFormData,
    isEditMode,
    setIsEditMode,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useTaxController(messageApi);
  
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();

  // Filter taxes by search (tax_type or HSN code)
  const filteredTaxes = useMemo(
    () =>
      taxes.filter(
        (tax) =>
          (tax.tax_type || "").toLowerCase().includes(search.toLowerCase()) ||
          (tax.hsn_sac_code || "").toLowerCase().includes(search.toLowerCase())
      ),
    [taxes, search]
  );

  // Open Modal
  const openModal = (record = null) => {
    if (record) {
      setFormData(record);
      setIsEditMode(true);
      form.setFieldsValue(record);
    } else {
      const newData = {
        tax_type: "",
        hsn_sac_code: "",
        taxable_value: null,
        is_active: true,
      };
      setFormData(newData);
      setIsEditMode(false);
      form.setFieldsValue(newData);
    }
    setModalOpen(true);
  };

  // Submit Form
  const handleFormSubmit = (values) => {
    const payload = {
      ...values,
      taxable_value: Number(values.taxable_value),
    };
    isEditMode
      ? handleUpdate({ ...formData, ...payload })
      : handleCreate(payload);
    setModalOpen(false);
  };

  // Dropdown menu actions
  const getActionMenu = (record) => ({
    items: [
      {
        key: "edit",
        label: (
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            block
          >
            Edit
          </Button>
        ),
      },
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

  // Table columns
  const columns = [
    {
      title: "Tax Type",
      dataIndex: "tax_type",
      key: "tax_type",
    },
    {
      title: "HSN/SAC Code",
      dataIndex: "hsn_sac_code",
      key: "hsn_sac_code",
    },
    {
      title: "Tax Percentage (%)",
      dataIndex: "taxable_value",
      key: "taxable_value",
      render: (value) => `${value}%`,
    },
    {
      title: "Active",
      dataIndex: "is_active",
      key: "is_active",
      render: (active) =>
        active ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setFormData(record);
              setIsEditMode(true);
              setModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this tax?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="p-6">
        {/* Search + Add Button */}
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search by tax type or HSN code"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            Add Tax
          </Button>
        </div>

        {/* Table */}
        <Table
          loading={loading}
          dataSource={filteredTaxes}
          columns={columns}
          rowKey="id"
          pagination={false}
          scroll={{ x: true }}
        />

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <Pagination
            showSizeChanger
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={(page, newPageSize) => {
              setPagination((prev) => ({
                ...prev,
                current: page,
                pageSize: newPageSize,
              }));
            }}
            pageSizeOptions={["10", "20", "50", "100"]}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
            prevIcon={<span>⟨</span>}
            nextIcon={<span>⟩</span>}
          />
        </div>

        {/* Modal */}
        <Modal
          open={modalOpen}
          title={isEditMode ? "Edit Tax" : "Add Tax"}
          onCancel={() => setModalOpen(false)}
          onOk={() => form.submit()}
          okText={isEditMode ? "Update" : "Create"}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={formData}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="tax_type"
                label="Tax Type"
                rules={[{ required: true, message: "Tax Type is required" }]}
              >
                <Input placeholder="e.g., GST, VAT, Service Tax" />
              </Form.Item>

              <Form.Item
                name="hsn_sac_code"
                label="HSN/SAC Code"
                rules={[
                  {
                    pattern: /^[0-9]{4,8}$/,
                    message: "HSN/SAC code should be 4-8 digits",
                  },
                ]}
              >
                <Input placeholder="e.g., 1006, 998314" maxLength={8} />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="taxable_value"
                label="Tax Percentage (%)"
                rules={[
                  { required: true, message: "Tax percentage is required" },
                  {
                    type: "number",
                    min: 0,
                    max: 100,
                    message: "Enter a valid percentage (0-100)",
                  },
                ]}
              >
                <InputNumber
                 
                  placeholder="e.g., 5, 10, 18"
                  style={{ width: "100%" }}
                  controls={false}
                  precision={0}
                />
              </Form.Item>
              <Form.Item
                name="is_active"
                label="Active"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default TaxPage;

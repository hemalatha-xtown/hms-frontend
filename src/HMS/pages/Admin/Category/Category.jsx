import React, { useState, useMemo } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Input,
  Modal,
  Form,
  InputNumber,
  Switch,
  Upload,
  Select,
  Dropdown,
  Tag,
  message,
  Pagination,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  categorySchema,
  mealTypeOptions,
  foodTypeOptions,
} from "../../../models/category";
import { useCategoryController } from "../Category/Category";
import { useTaxController } from "../Tax/Tax";

const { Option } = Select;

const CategoryPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    loading,
    categories,
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
  } = useCategoryController(messageApi);

  const { taxes } = useTaxController(messageApi);

  const [search, setSearch] = useState("");
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // Filter categories by search
  const filteredCategories = useMemo(
    () =>
      categories.filter((cat) =>
        (cat.item_name || "").toLowerCase().includes(search.toLowerCase())
      ),
    [categories, search]
  );

  const openModal = (record = null) => {
    if (record) {
      setFormData(record);
      setIsEditMode(true);
      setFileList(
        record.image
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: record.image,
              },
            ]
          : []
      );
    } else {
      setFormData(categorySchema);
      setIsEditMode(false);
      setFileList([]);
    }
    setModalOpen(true);
    form.resetFields();
  };

  const handleUploadChange = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleFormSubmit = (values) => {
    if (!fileList.length && !formData.image) {
      return message.error("Image is required.");
    }

    const reader = new FileReader();
    if (fileList[0]?.originFileObj) {
      reader.readAsDataURL(fileList[0].originFileObj);
      reader.onload = () => {
        const payload = { ...values, image: reader.result };
        isEditMode
          ? handleUpdate({ ...formData, ...payload })
          : handleCreate(payload);
        setModalOpen(false);
      };
    } else {
      const payload = { ...values, image: formData.image };
      isEditMode
        ? handleUpdate({ ...formData, ...payload })
        : handleCreate(payload);
      setModalOpen(false);
    }
  };

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

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (img) =>
        img ? (
          <img
            src={img}
            alt="Item"
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        ) : (
          <span style={{ color: "#999" }}>No Image</span>
        ),
    },
    { title: "Item Name", dataIndex: "item_name", key: "item_name" },
    { title: "Food Type", dataIndex: "food_type", key: "food_type" },
    { title: "Meal Type", dataIndex: "meal_type", key: "meal_type" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (val) => `₹ ${val}`,
    },
    {
      title: "Tax",
      dataIndex: "tax_id",
      key: "tax_id",
      render: (tax_id) => {
        const tax = taxes.find((t) => t.id === tax_id);
        return tax ? `${tax.taxable_value} %` : "N/A";
      },
    },
    {
      title: "Available",
      dataIndex: "is_available",
      key: "is_available",
      render: (val) =>
        val ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown menu={getActionMenu(record)} trigger={["click"]}>
          <Button>{"⋮"}</Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search by item name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            Add Category
          </Button>
        </div>

        <Table
          loading={loading}
          dataSource={filteredCategories}
          columns={columns}
          rowKey="id"
          pagination={false}
        />

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

        <Modal
          open={modalOpen}
          title={isEditMode ? "Edit Category" : "Add Category"}
          onCancel={() => setModalOpen(false)}
          onOk={() => form.submit()}
          okText={isEditMode ? "Update" : "Create"}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            initialValues={formData}
          >
            <Form.Item
              name="item_name"
              label="Item Name"
              rules={[
                { required: true, message: "Item Name is required" },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const isDuplicate = categories.some(
                      (cat) =>
                        cat.item_name.toLowerCase() === value.toLowerCase() &&
                        (!isEditMode || cat.id !== formData.id)
                    );
                    if (isDuplicate)
                      return Promise.reject("Item name already exists.");
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="Enter item name" />
            </Form.Item>

            {/* ✅ Food Type */}
            <Form.Item
              name="food_type"
              label="Food Type"
              rules={[{ required: true, message: "Food type is required" }]}
            >
              <Select placeholder="Select food type" allowClear>
                {foodTypeOptions.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="meal_type" label="Meal Type">
              <Select placeholder="Select meal type" allowClear>
                {mealTypeOptions.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "Price is required" }]}
            >
              <InputNumber
                min={0}
                placeholder="Enter price"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name="tax_id"
              label="Tax (%)"
              rules={[{ required: true, message: "Tax is required" }]}
            >
              <Select placeholder="Select Tax">
                {taxes.map((tax) => (
                  <Option key={tax.id} value={tax.id}>
                    {tax.taxable_value}%
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="is_available"
              label="Available"
              valuePropName="checked"
            >
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>

            <Form.Item label="Upload Image" required>
              <Upload
                listType="picture"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default CategoryPage;

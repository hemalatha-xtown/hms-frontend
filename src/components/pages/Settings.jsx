
import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Divider,
  Select,
  Tabs,
  notification,
  Space,
  Upload,
  Radio,
  Row,
  Col,
  Avatar,
  Modal,
} from "antd";
import {
  SaveOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  SecurityScanOutlined,
  LockOutlined,
  UploadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext";

// ✅ Import only the HMS pages you need
import ProfilePage from "../../HMS/pages/Admin/Profile/Profile.jsx";
import TablePage from "../../HMS/pages/Admin/Table/Table.jsx";

const { Option } = Select;
const { TabPane } = Tabs;

/* -------------------------------
   SubFields Manager Component
-------------------------------- */
const SubFieldsManager = ({ rows, onAdd, onUpdate, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (editing) {
      form.setFieldsValue(editing);
    } else {
      form.resetFields();
    }
  }, [editing, form]);

  const openAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setOpen(true);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    if (editing) {
      onUpdate({ ...editing, ...values });
      notification.success({ message: "Subfield updated" });
    } else {
      onAdd({ id: `${Date.now()}`, ...values });
      notification.success({ message: "Subfield added" });
    }
    setOpen(false);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Delete subfield?",
      onOk() {
        onDelete(id);
        notification.success({ message: "Deleted" });
      },
    });
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => openEdit(record)} size="small">
            Edit
          </Button>
          <Button danger onClick={() => handleDelete(record.id)} size="small">
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        className="mb-4"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h3>Sub Fields</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Add Sub Field
        </Button>
      </div>

      <Card>
        <Table
          dataSource={rows.map((r) => ({ ...r, key: r.id }))}
          columns={columns}
          pagination={{ pageSize: 6 }}
          locale={{ emptyText: "No sub fields yet" }}
        />
      </Card>

      <Modal
        title={editing ? "Edit Sub Field" : "Add Sub Field"}
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText={editing ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Sub field name" />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select placeholder="Select type">
              <Option value="text">Text</Option>
              <Option value="number">Number</Option>
              <Option value="select">Select</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

/* -------------------------------
   Settings Page
-------------------------------- */
const Settings = ({ initialActiveTab = "profile" }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  // Demo subfield rows
  const [subFields, setSubFields] = useState([
    { id: "1", name: "Machine ID", type: "text", description: "Unique machine id" },
    { id: "2", name: "Warranty Months", type: "number", description: "Warranty period" },
  ]);

  const {
    theme,
    setTheme,
    primaryColor,
    setPrimaryColor,
    presetThemes,
    applyPresetTheme,
    currentPreset,
  } = useTheme();

  useEffect(() => {
    if (initialActiveTab) setActiveTab(initialActiveTab);
  }, [initialActiveTab]);

  const handleSubmit = (values) => {
    setLoading(true);
    setTimeout(() => {
      notification.success({
        message: "Settings Saved",
        description: "Your settings have been updated successfully.",
      });
      setLoading(false);
    }, 800);
  };

  const handleAvatarChange = (info) => {
    if (info?.file?.originFileObj) {
      setAvatarUrl(URL.createObjectURL(info.file.originFileObj));
    }
  };

  // SubFields handlers
  const addSubField = (row) => setSubFields((s) => [row, ...s]);
  const updateSubField = (row) =>
    setSubFields((s) => s.map((r) => (r.id === row.id ? row : r)));
  const deleteSubField = (id) =>
    setSubFields((s) => s.filter((r) => r.id !== id));

  return (
    <div className="settings-page p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      <Card bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "+1 (555) 123-4567",
            theme: theme,
            primaryColor: primaryColor,
            notificationsEnabled: true,
          }}
        >
          <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
            {/* Profile Master */}
            <TabPane tab="Profile" key="profilePage">
              <ProfilePage />
            </TabPane>

            {/* Table Master */}
            <TabPane tab="Table" key="tablePage">
              <TablePage />
            </TabPane>
          </Tabs>

          <Divider />

          {activeTab !== "subfields" && (
            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Save Settings
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default Settings;

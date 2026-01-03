import React from "react";
import {
  Button,
  Popconfirm,
  Input,
  Modal,
  Form,
  Upload,
  Dropdown,
  Card,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useProfileController } from "../Profile/Profile";

const ProfilePage = () => {
  const [form] = Form.useForm();
  const {
    loading,
    profiles,
    modalOpen,
    setModalOpen,
    formData,
    setFormData,
    isEditMode,
    setIsEditMode,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useProfileController();

  const handleAdd = () => {
    setFormData({});
    setIsEditMode(false);
    setModalOpen(true);
    form.resetFields();
  };

  const handleEdit = (record) => {
    const fileList = record.profile_image
      ? [
        {
          uid: "-1",
          name: "profile.png",
          status: "done",
          url: record.profile_image,
        },
      ]
      : [];
    form.setFieldsValue({ ...record, profile_image: fileList });
    setFormData(record);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then(async (values) => {
        const payload = { ...values };

        if (values.profile_image?.[0]?.originFileObj) {
          const reader = new FileReader();
          reader.onloadend = async () => {
            payload.profile_image = reader.result;
            if (isEditMode) await handleUpdate({ ...formData, ...payload });
            else await handleCreate(payload);
            setModalOpen(false);
            form.resetFields();
          };
          reader.readAsDataURL(values.profile_image[0].originFileObj);
        } else {
          payload.profile_image = values.profile_image?.[0]?.url || null;
          if (isEditMode) await handleUpdate({ ...formData, ...payload });
          else await handleCreate(payload);
          setModalOpen(false);
          form.resetFields();
        }
      })
      .catch((err) => console.log("Validation Failed:", err));
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full bg-indigo-200/30 blur-3xl top-[-150px] left-[-150px] animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-200/30 blur-3xl bottom-[-150px] right-[-100px] animate-pulse"></div>
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center px-6 pt-10 mb-12">
        <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight drop-shadow-md"></h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-xl rounded-xl"
          onClick={handleAdd}
        >
          Add Profile
        </Button>
      </div>


      {/* Profile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {profiles.map((profile) => (
          <Card
            key={profile.id}
            className="relative w-[400px] h-[520px] p-[3px] rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl transform transition-transform hover:scale-105"
          >
            <div className="absolute top-4 right-4 z-30">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "edit",
                      label: "Edit",
                      icon: <EditOutlined />,
                      onClick: () => handleEdit(profile),
                    },
                    {
                      key: "delete",
                      label: "Delete",
                      icon: <DeleteOutlined />,
                      onClick: () => handleDelete(profile.id),
                    },
                  ],
                }}
                placement="bottomRight"
                arrow
              >
                <Button
                  shape="circle"
                  icon={<MoreOutlined className="text-gray-800" />}
                  size="small"
                  className="bg-white/90 hover:bg-white shadow-lg border border-gray-300"
                />
              </Dropdown>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center -mt-20 mb-6 relative">
              <div className="w-36 h-36 rounded-full p-[3px] bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 shadow-lg overflow-hidden">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src={profile.profile_image || "/default-avatar.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

            </div>
          


            {/* Dark corner overlays for 3D effect */ }
          < div className = "absolute inset-0 pointer-events-none" >
              <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-black/20 to-transparent rounded-tl-3xl"></div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-black/20 to-transparent rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-black/20 to-transparent rounded-bl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-black/20 to-transparent rounded-br-3xl"></div>
            </div>

      {/* Info */}
      <div className="space-y-3 text-gray-700 text-base px-4 relative z-1">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-900">Hotel:</span>
          <span>{profile.company_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-900">Email:</span>
          <span className="truncate max-w-[150px]">{profile.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-900">Phone:</span>
          <span>{profile.phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-900">GST No:</span>
          <span>{profile.gst_number}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-900">Address:</span>
          <span className="max-w-[200px] break-words whitespace-normal">{profile.address}</span>
        </div>
      </div>

      {/* Actions
            <div className="flex justify-center gap-6 mt-8 mb-4 relative z-10">
              <Button
                type="primary"
                icon={<EditOutlined />}
                className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 rounded-full shadow-lg"
                onClick={() => handleEdit(profile)}
              />
              <Popconfirm
                title="Are you sure to delete this profile?"
                onConfirm={() => handleDelete(profile.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger icon={<DeleteOutlined />} className="rounded-full shadow-lg" />
              </Popconfirm>
            </div> */}
    </Card>
  ))
}
      </div >


  {/* Modal */ }
  < Modal
title = { isEditMode? "Edit Profile": "Add Profile" }
open = { modalOpen }
onCancel = {() => setModalOpen(false)}
onOk = { handleSave }
okText = { isEditMode? "Update": "Create" }
width = { window.innerWidth < 768 ? 350 : 600 }
style = {{ maxWidth: "85%" }}
className = "rounded-2xl"
centered
  >
  <Form form={form} layout="vertical" className="space-y-4">
    <Form.Item
      name="company_name"
      label="Hotel Name"
      rules={[{ required: true }]}
    >
      <Input placeholder="Enter company name" />
    </Form.Item>
    <Form.Item
      name="address"
      label="Address"
      rules={[{ required: true }]}
    >
      <Input.TextArea rows={3} placeholder="Enter address" />
    </Form.Item>
    <Form.Item
      name="gst_number"
      label="GST Number"
      rules={[{ required: true }]}
    >
      <Input placeholder="Enter GST number" />
    </Form.Item>
    <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
      <Input placeholder="Enter phone number" />
    </Form.Item>
    <Form.Item
      name="email"
      label="Email"
      rules={[{ required: true, type: "email" }]}
    >
      <Input placeholder="Enter email" />
    </Form.Item>
    <Form.Item
      name="profile_image"
      label="Profile Image / Logo"
      valuePropName="fileList"
      getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList || [])}
    >
      <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
        <Button icon={<UploadOutlined />}>Upload Image</Button>
      </Upload>
    </Form.Item>
  </Form>
      </Modal >
    </div >
  );
};

export default ProfilePage;

import { useState, useEffect } from "react";
import { message } from "antd";
import { profileSchema, profileService } from "../../../models/Profile";

// Convert Buffer to Base64
const bufferToBase64 = (buffer) => {
  if (!buffer?.data) return null;
  const bytes = new Uint8Array(buffer.data);
  let binary = "";
  const chunkSize = 0x8000; // 32KB chunks for large arrays
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return `data:image/jpeg;base64,${btoa(binary)}`;
};

export const useProfileController = () => {
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(profileSchema);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchProfiles = async () => {
  try {
    setLoading(true);
    const res = await profileService.list();

    // Log the full API response
    console.log("Full API Response:", res);

    const rows = res.data?.data?.profiles || [];

    // No conversion needed, API already gives base64
    const formattedRows = rows.map((p) => ({
      ...p,
      profile_image: p.profile_image || null, // use as-is
    }));

    console.log("Formatted Profiles:", formattedRows);

    setProfiles(formattedRows);
  } catch (err) {
    console.error(err);
    message.error("Failed to fetch profiles");
  } finally {
    setLoading(false);
  }
};


  const handleCreate = async (values) => {
    try {
      await profileService.create(values);
      message.success("Profile created successfully");
      fetchProfiles();
    } catch (err) {
      console.error(err);
      message.error("Failed to create profile");
    }
  };

  const handleUpdate = async (values) => {
    try {
      await profileService.update(values.id, values);
      message.success("Profile updated successfully");
      fetchProfiles();
    } catch (err) {
      console.error(err);
      message.error("Failed to update profile");
    }
  };

  const handleDelete = async (id) => {
    try {
      await profileService.delete(id);
      message.success("Profile deleted successfully");
      fetchProfiles();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete profile");
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return {
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
    fetchProfiles,
  };
};
import { useState, useEffect } from "react";
import { taxService } from "../../../models/tax";

export const useTaxController = (messageApi) => {
  const [loading, setLoading] = useState(false);
  const [taxes, setTaxes] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchTaxes = async () => {
    try {
      setLoading(true);

      const res = await taxService.list({
        page: pagination.current,
        limit: pagination.pageSize,
      });

      if (!res.data?.success) {
        messageApi.error("Failed to fetch taxes");
        setTaxes([]);
        return;
      }

      const data = res.data.data;

      // Convert string numbers to actual numbers
      const rows = (data.taxes || []).map((tax) => ({
        ...tax,
        taxable_value: parseFloat(tax.taxable_value),
        cgst_percent: tax.cgst_percent ? parseFloat(tax.cgst_percent) : null,
        cgst_amount: tax.cgst_amount ? parseFloat(tax.cgst_amount) : null,
        sgst_percent: tax.sgst_percent ? parseFloat(tax.sgst_percent) : null,
        sgst_amount: tax.sgst_amount ? parseFloat(tax.sgst_amount) : null,
        igst_percent: tax.igst_percent ? parseFloat(tax.igst_percent) : null,
        igst_amount: tax.igst_amount ? parseFloat(tax.igst_amount) : null,
        total_tax_amount: tax.total_tax_amount
          ? parseFloat(tax.total_tax_amount)
          : 0,
      }));

      setTaxes(rows);

      setPagination((prev) => ({
        ...prev,
        total: data.total || rows.length,
        current: data.currentPage || prev.current,
        pageSize: prev.pageSize,
      }));

      console.log("Fetched taxes:", rows);
      console.log("Pagination info:", data);
    } catch (err) {
      console.error("Fetch taxes error:", err);
      messageApi.error("Failed to fetch taxes");
      setTaxes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      // Convert string numbers to proper numbers before sending
      const payload = {
        ...values,
        taxable_value: parseFloat(values.taxable_value),
        cgst_percent: values.cgst_percent ? parseFloat(values.cgst_percent) : null,
        cgst_amount: values.cgst_amount ? parseFloat(values.cgst_amount) : null,
        sgst_percent: values.sgst_percent ? parseFloat(values.sgst_percent) : null,
        sgst_amount: values.sgst_amount ? parseFloat(values.sgst_amount) : null,
        igst_percent: values.igst_percent ? parseFloat(values.igst_percent) : null,
        igst_amount: values.igst_amount ? parseFloat(values.igst_amount) : null,
        total_tax_amount: values.total_tax_amount
          ? parseFloat(values.total_tax_amount)
          : 0,
      };

      console.log("Creating tax with payload:", payload);

      await taxService.create(payload);
      messageApi.success("Tax created successfully");
      fetchTaxes();
    } catch (err) {
      console.error("Create tax error:", err);
      if (err.response) {
        console.error("Backend response:", err.response.data);
        messageApi.error(
          err.response.data?.message || "Failed to create tax"
        );
      } else {
        messageApi.error("Failed to create tax");
      }
    }
  };

   const handleUpdate = async (values) => {
    try {
      const payload = {
        ...values,
        taxable_value: parseFloat(values.taxable_value),
        cgst_percent: values.cgst_percent ? parseFloat(values.cgst_percent) : null,
        cgst_amount: values.cgst_amount ? parseFloat(values.cgst_amount) : null,
        sgst_percent: values.sgst_percent ? parseFloat(values.sgst_percent) : null,
        sgst_amount: values.sgst_amount ? parseFloat(values.sgst_amount) : null,
        igst_percent: values.igst_percent ? parseFloat(values.igst_percent) : null,
        igst_amount: values.igst_amount ? parseFloat(values.igst_amount) : null,
        total_tax_amount: values.total_tax_amount
          ? parseFloat(values.total_tax_amount)
          : 0,
      };

      console.log("Updating tax with payload:", payload);

      await taxService.update(values.id, payload);
      messageApi.success("Tax updated successfully");
      fetchTaxes();
    } catch (err) {
      console.error("Update tax error:", err);
      if (err.response) {
        console.error("Backend response:", err.response.data);
        messageApi.error(
          err.response.data?.message || "Failed to update tax"
        );
      } else {
        messageApi.error("Failed to update tax");
      }
    }
  };


  const handleDelete = async (id) => {
    try {
      await taxService.delete(id);
      messageApi.success("Tax deleted successfully");
      fetchTaxes();
    } catch (err) {
      console.error(err);
      messageApi.error("Failed to delete tax");
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, [pagination.current, pagination.pageSize]);

  return {
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
  };
};

import { useState, useEffect } from "react";
import { message } from "antd";
import { categorySchema, categoryService } from "../../../models/category";
import { Alert } from "antd";
import { useTaxController } from "../Tax/Tax";
import { taxService } from "../../../models/tax";
export const useCategoryController = (messageApi, taxes = []) => {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(categorySchema);
  const [isEditMode, setIsEditMode] = useState(false);

  // const fetchCategories = async () => {

  //   try {
  //     setLoading(true);

  //     const res = await categoryService.list({
  //       page: pagination.current,
  //       limit: pagination.pageSize,
  //     });

  //     // Log the full response
  //     console.log("Category API Response:", res);

  //     const rows = res.data?.data?.categories || [];
  //     const total = res.data?.data?.total || rows.length;

  //     setCategories(rows);
  //     setPagination((prev) => ({ ...prev, total }));
  //   } catch (err) {
  //     console.error(err);
  //     messageApi.error("Failed to fetch categories");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
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
  const fetchCategories = async () => {
    try {
      setLoading(true);

      // 1️⃣ Fetch all taxes
      const taxRes = await taxService.list();
      const taxList = taxRes?.data?.data?.taxes || [];

      // 2️⃣ Build a tax map: id → numeric tax percentage
      const taxMap = taxList.reduce((acc, tax) => {
        const val = parseFloat(tax.taxable_value);
        acc[tax.id] = isNaN(val) ? 0 : val; // fallback 0 if NaN
        return acc;
      }, {});

      // 3️⃣ Fetch categories
      const res = await categoryService.list({
        page: pagination.current,
        limit: pagination.pageSize,
      });
      const rows = res.data?.data?.categories || [];
      const total = res.data?.data?.total || rows.length;

      // 4️⃣ Map tax to category and calculate price_with_tax
      const updatedRows = rows.map((item) => {
        const price = parseFloat(item.price) || 0; // ensure number
        const taxPercent = taxMap[item.tax_id] || 0; // fallback if missing
        const taxAmount = (price * taxPercent) / 100;
        const priceWithTax = price + taxAmount;

        return {
          ...item,
          tax_percent: taxPercent,
          tax_amount: parseFloat(taxAmount.toFixed(2)), // numeric 2 decimals
          price_with_tax: parseFloat(priceWithTax.toFixed(2)), // numeric 2 decimals
        };
      });

      setCategories(updatedRows);
      setPagination((prev) => ({ ...prev, total }));
      console.log("✅ Categories with proper tax:", updatedRows);
    } catch (err) {
      console.error("❌ Error fetching categories:", err);
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };
  const handleCreate = async (values) => {
    try {
      const selectedTax = taxes.find((t) => t.id === values.tax_id);

      const payload = {
        ...values,
        tax_id: values.tax_id,
        taxable_value: selectedTax?.taxable_value || 0,
      };
      console.log("tax id", tax_id);
      await categoryService.create(payload);
      fetchCategories();
      console.log("Payload for create:", payload);
      messageApi.success("Category created successfully");
    } catch (err) {
      console.error(err);
      messageApi.error("Failed to create category");
    }
  };

  const handleUpdate = async (values) => {
    try {
      await categoryService.update(values.id, values);
      messageApi.success("Category updated successfully");
      fetchCategories();
    } catch (err) {
      console.error(err);
      messageApi.error("Failed to update category");
    }
  };

  const handleDelete = async (id) => {
    try {
      await categoryService.delete(id);
      messageApi.success("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      console.error(err);
      messageApi.error("Failed to delete category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [pagination.current, pagination.pageSize]);

 return {
    loading,
    categories,
    setCategories, // <-- add this
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

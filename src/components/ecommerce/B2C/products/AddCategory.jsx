import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Space,
  Switch,
  Tree,
  Upload,
  Select,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  UploadOutlined,
  BranchesOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import CustomTable from "../../../CMS/pages/custom/CustomTable"; // Import your table component
import { FiRefreshCw } from "react-icons/fi";

const { Option } = Select;

const AddCategory = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [trashedCategories, setTrashedCategories] = useState([]);
  const [trashedLoading, setTrashedLoading] = useState(false);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/categories");
      if (res.data.success) {
        setCategories(res.data.categories);
        setTreeData(transformHierarchy(res.data.hierarchy));
      }
    } catch (err) {
      message.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Fetch trashed categories
  const fetchTrashedCategories = async () => {
    try {
      setTrashedLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/categories?includeDeleted=true&status=0"
      );
      if (res.data.success) {
        setTrashedCategories(res.data.categories);
      }
    } catch (err) {
      message.error("Failed to load trashed categories");
    } finally {
      setTrashedLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTrashedCategories();
  }, []);

  // Transform backend hierarchy to Ant Tree format
  const transformHierarchy = (data) =>
    data.map((item) => ({
      key: item._id,
      title: (
        <span>
          {item.icon && (
            <span
              dangerouslySetInnerHTML={{ __html: item.icon }}
              style={{ marginRight: 5 }}
            />
          )}
          {item.name}
        </span>
      ),
      children: item.children ? transformHierarchy(item.children) : [],
    }));

  const onTreeSelect = (selectedKeys) => {
    const selected = categories.find((c) => c._id === selectedKeys[0]);
    if (selected) {
      setSelectedCategory(selected);
      setSelectedParent(null);
      form.setFieldsValue({
        ...selected,
        metaKeywords: selected.metaKeywords || [],
      });
      setImagePreview(selected.image || null);
    } else {
      setSelectedCategory(null);
      setSelectedParent(null);
      form.resetFields();
      setImagePreview(null);
    }
  };

  const handleImageChange = (info) => {
    const file = info.file.originFileObj;
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      form.setFieldValue("image", file);
    }
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      if (key === "metaKeywords" && Array.isArray(values[key])) {
        values[key].forEach((kw, index) => {
          if (kw && kw.trim() !== "") {
            formData.append(`metaKeywords[${index}]`, kw.trim());
          }
        });
      } else if (key === "image" && values[key]) {
        formData.append("image", values[key]);
      } else if (values[key] !== undefined && values[key] !== null) {
        formData.append(key, values[key]);
      }
    });

    // Always send parent (empty string if no parent)
    formData.append("parent", selectedParent || "");

    try {
      setLoading(true);
      if (selectedCategory && !selectedParent) {
        await axios.put(
          `http://localhost:5000/api/categories/${selectedCategory._id}`,
          formData
        );
        message.success("Category updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/categories", formData);
        message.success("Category created successfully");
      }
      form.resetFields();
      setImagePreview(null);
      setSelectedCategory(null);
      setSelectedParent(null);
      fetchCategories();
      fetchTrashedCategories();
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      message.success("Category soft deleted successfully");
      fetchCategories();
      fetchTrashedCategories();
      setSelectedCategory(null);
      setSelectedParent(null);
      form.resetFields();
      setImagePreview(null);
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/categories/${id}/restore`);
      message.success("Category restored successfully");
      fetchCategories();
      fetchTrashedCategories();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to restore category");
    }
  };

  const trashedColumns = [
  {
    title: "S.No",
    key: "sno",
    render: (_, __, index) => index + 1, // Ensure index is properly received
  },
  { title: "Name", key: "name", sortable: true },
  { title: "Slug", key: "slug" },
  { title: "Status", key: "status", render: () => "Inactive" },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <Button onClick={() => handleRestore(record._id)} type="primary">
        Restore
      </Button>
    ),
  },
];
  return (
    <Row gutter={16} >
      {/* LEFT: Category Tree */}
      <Col span={8}>
        <Card
          title="Category Hierarchy"
          extra={
            <Button icon={<ReloadOutlined />} onClick={fetchCategories}>
              Refresh
            </Button>
          }
        >
          <Tree
            showLine
            defaultExpandAll
            treeData={treeData}
            onSelect={onTreeSelect}
            style={{ background: "#fff", padding: 10, borderRadius: 8, minHeight: 500 }}
          />
        </Card>
      </Col>

      {/* RIGHT: Add/Edit Form */}
      <Col span={16}>
        <Card
          title={
            selectedParent
              ? "Add Child Category"
              : selectedCategory
              ? "Edit Category"
              : "Add New Category"
          }
          extra={
            <Space>
              <Button
                icon={<DeleteOutlined />}
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedParent(null);
                  form.resetFields();
                  setImagePreview(null);
                }}
              >
                Trashed
              </Button>
              {selectedCategory && (
                <Button
                  icon={<BranchesOutlined />}
                  onClick={() => {
                    setSelectedParent(selectedCategory._id);
                    setSelectedCategory(null);
                    form.resetFields();
                    setImagePreview(null);
                  }}
                >
                  Add Child
                </Button>
              )}
              {selectedCategory && (
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(selectedCategory._id)}
                >
                  Delete
                </Button>
              )}
              <Button
                icon={<PlusOutlined />}
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedParent(null);
                  form.resetFields();
                  setImagePreview(null);
                }}
              >
                New
              </Button>
            </Space>
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              status: 1,
              isHighlighted: false,
              isSpecial: false,
              showInFilterMenu: false,
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Category Name"
                  name="name"
                  rules={[{ required: true, message: "Enter category name" }]}
                >
                  <Input placeholder="Enter category name" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Meta Title" name="metaTitle">
                  <Input placeholder="Enter meta title" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Meta Description" name="metaDescription">
                  <Input.TextArea placeholder="Enter meta description" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Meta Keywords" name="metaKeywords">
                  <Select
                    mode="tags"
                    style={{ width: "100%" }}
                    placeholder="Type and press Enter to add keywords"
                    tokenSeparators={[","]}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Icon HTML" name="icon">
                  <Input.TextArea placeholder="Enter icon HTML code" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Upload Image" name="image">
                  <Upload
                    listType="picture"
                    maxCount={1}
                    beforeUpload={() => false}
                    onChange={handleImageChange}
                  >
                    <Button icon={<UploadOutlined />}>Select Image</Button>
                  </Upload>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="preview"
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        marginTop: 10,
                        borderRadius: 5,
                        border: "1px solid #d9d9d9",
                      }}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item label="Highlighted" name="isHighlighted" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Special" name="isSpecial" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Show in Filter Menu"
                  name="showInFilterMenu"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<EditOutlined />}
                >
                  {selectedCategory ? "Update" : "Save"} Category
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                    setSelectedCategory(null);
                    setSelectedParent(null);
                    setImagePreview(null);
                  }}
                >
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* Trashed Categories Table */}
        <Card title="Trashed Categories" style={{ marginTop: 20 }}>
        <CustomTable
  columns={trashedColumns}
  data={trashedCategories.map((item, index) => ({ ...item, key: item._id || index }))}
  totalItems={trashedCategories.length}
  currentPage={1}
  itemsPerPage={10}
  onPageChange={(page) => {}}
  onFilter={() => {}}
  loading={trashedLoading}
/>
        </Card>
      </Col>
      <Col>
      </Col>
    </Row>
  );
};

export default AddCategory;
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheck, FiX, FiArrowLeft, FiShoppingBag, FiFile, FiDownload, FiZoomIn, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { apiService } from '../../../../../manageApi/utils/custom.apiservice';
import { showToast } from '../../../../../manageApi/utils/toast';
import { showConfirmDialog } from '../../../../../manageApi/utils/sweetAlert';
import { Button, Card, Spin, Row, Col, Descriptions, Empty, Tag, Modal, Input, Divider, Tooltip, Space, Progress, Alert, Tabs, Typography, Collapse } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Title, Paragraph, Text: TypographyText } = Typography;

const ProductReview = () => {
  const { user, token } = useSelector((state) => state.auth);
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifyingProduct, setVerifyingProduct] = useState(false); // New state for product verification loading
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionSuggestion, setRejectionSuggestion] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [verifyingAsset, setVerifyingAsset] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [assetType, setAssetType] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [reason, setReason] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [verificationProgress, setVerificationProgress] = useState({
    total: 0,
    verified: 0,
    percentage: 0,
  });

  // Sync token with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  // Calculate verification progress
  useEffect(() => {
    if (product) {
      let totalAssets = 0;
      let verifiedAssets = 0;

      // Count images in color variants
      product.color_variants?.forEach((variant) => {
        totalAssets += variant.images?.length || 0;
        verifiedAssets += variant.images?.filter((img) => img.verified)?.length || 0;
      });

      // Count documents
      Object.values(product.documents || {}).forEach((doc) => {
        if (doc) {
          totalAssets += 1;
          if (doc.verified) verifiedAssets += 1;
        }
      });

      // Count 3D model
      if (product.three_d_model) {
        totalAssets += 1;
        if (product.three_d_model.verified) verifiedAssets += 1;
      }

      const percentage = totalAssets > 0 ? Math.round((verifiedAssets / totalAssets) * 100) : 0;

      setVerificationProgress({
        total: totalAssets,
        verified: verifiedAssets,
        percentage,
      });
    }
  }, [product]);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const params = { product_id: productId };
        const response = await apiService.get('/products', params);
        if (response.success && response.products.length > 0) {
          setProduct(response.products[0]);
        } else {
          showToast('Product not found', 'error');
          navigate('/sawtar/cms/vendor/b2c/product-requests');
        }
      } catch (error) {
        showToast(error.response?.data?.message || 'Failed to fetch product', 'error');
        navigate('/sawtar/cms/vendor/b2c/product-requests');
      } finally {
        setLoading(false);
      }
    };

    if (user.id && productId) {
      fetchProduct();
    }
  }, [user.id, productId, navigate]);

  // Handle product status update (approve/reject)
  const handleStatusUpdate = async (newStatus, reason = '', suggestion = '') => {
    setVerifyingProduct(true);
    try {
      const data = { status: newStatus };
      if (reason) data.rejection_reason = reason;
      if (suggestion) data.suggestion = suggestion;

      // Use the verify-all endpoint
      await apiService.put(`/products/${productId}/verify-all`, data);
      showToast(`Product ${newStatus} successfully`, 'success');
      navigate('/sawtar/cms/vendor/b2c/product-requests');
    } catch (error) {
      showToast(error.response?.data?.message || `Failed to ${newStatus} product`, 'error');
    } finally {
      setVerifyingProduct(false);
    }
  };

  // Open/close reject modal for product
  const openRejectModal = () => {
    setRejectionReason('');
    setRejectionSuggestion('');
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectionReason('');
    setRejectionSuggestion('');
  };

  // Asset verification handlers
  const openVerificationModal = (assetId, type, approving) => {
    setSelectedAssetId(assetId);
    setAssetType(type);
    setIsApproving(approving);
    setReason('');
    setSuggestion('');
    setVerificationModalOpen(true);
  };

  const handleSubmitVerification = async () => {
    if (!isApproving && !reason.trim()) {
      showToast('Reason is required for rejection', 'error');
      return;
    }

    setVerifyingAsset(selectedAssetId);
    try {
      await apiService.put(`/products/${productId}/verify-asset/${selectedAssetId}`, {
        verified: isApproving,
        reason: reason.trim(),
        suggestion: suggestion.trim(),
      });
      showToast(`Asset ${isApproving ? 'approved' : 'rejected'} successfully`, 'success');
      // Refetch product to update asset status
      const response = await apiService.get('/products', { product_id: productId });
      if (response.success && response.products.length > 0) {
        setProduct(response.products[0]);
      }
      setVerificationModalOpen(false);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update asset', 'error');
    } finally {
      setVerifyingAsset(null);
    }
  };

  const downloadAsset = (path) => {
    window.open(`http://localhost:5000/${path}`, '_blank');
  };

  const openImageModal = (asset) => {
    setSelectedAsset(asset);
    setImageViewerOpen(true);
  };

  const closeImageModal = () => {
    setImageViewerOpen(false);
    setSelectedAsset(null);
  };

  const isImageFile = (filename) => {
    if (!filename) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
  };

  // Get verification status badge
  const getVerificationBadge = (verified, reason) => {
    if (verified) {
      return <FiCheckCircle className="text-green-600 text-lg" />;
    } else if (reason) {
      return <FiXCircle className="text-red-600 text-lg" />;
    }
    return null;
  };

  // Get asset status color
  const getAssetStatusColor = (verified, reason) => {
    if (verified) return 'green';
    if (reason) return 'red';
    return 'orange';
  };

  // Get asset status text
  const getAssetStatusText = (verified, reason) => {
    if (verified) return 'Approved';
    if (reason) return 'Rejected';
    return 'Pending';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
        <Spin size="large" />
        <Paragraph className="mt-4 text-gray-600">Loading product details...</Paragraph>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
        <div className="text-center">
          <Paragraph className="text-red-500">Product not found</Paragraph>
          <Button
            type="primary"
            className="mt-4"
            onClick={() => navigate('/sawtar/cms/vendor/b2c/product-requests')}
          >
            Back to Product Requests
          </Button>
        </div>
      </div>
    );
  }

  const documentTypes = {
    product_invoice: 'Product Invoice',
    product_certificate: 'Product Certificate',
    quality_report: 'Quality Report',
  };

  const getDocumentsByType = () => {
    const docs = {};
    Object.entries(documentTypes).forEach(([type, label]) => {
      if (product.documents[type]) {
        docs[type] = [{ ...product.documents[type], type }];
      } else {
        docs[type] = [];
      }
    });
    return docs;
  };

  const groupedDocuments = getDocumentsByType();

  // Check if all assets are verified
  const allAssetsVerified =
    Object.values(product.documents).every((doc) => !doc || doc.verified) &&
    product.color_variants.every((variant) => variant.images.every((img) => img.verified)) &&
    (!product.three_d_model || product.three_d_model.verified);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Card style={{ marginBottom: 24 }} bodyStyle={{ padding: '16px 24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Title level={2} style={{ margin: 0 }}>
                {product.name}
              </Title>
              <TypographyText type="secondary">{product.short_description}</TypographyText>
            </Space>
          </Col>
          <Col>
            <Tooltip title="Back to Product Requests">
              <FiArrowLeft
                onClick={() => navigate(-1)}
                style={{ fontSize: '24px', cursor: 'pointer', color: '#1890ff' }}
                className="hover:text-blue-600 transition-colors"
              />
            </Tooltip>
          </Col>
        </Row>
      </Card>

      <div style={{ marginBottom: 24 }}>
        <Alert
          message={`Verification Progress: ${verificationProgress.verified}/${verificationProgress.total} assets verified`}
          description={
            <div className="mt-2">
              <Progress
                percent={verificationProgress.percentage}
                status={allAssetsVerified ? 'success' : 'active'}
              />
              <Paragraph className="text-sm text-gray-600 mt-2">
                {allAssetsVerified
                  ? 'All assets verified. You can now approve or reject the product.'
                  : 'Verify all assets before approving the product.'}
              </Paragraph>
            </div>
          }
          type="info"
          showIcon
        />
      </div>

      <Tabs defaultActiveKey="details" type="card">
        <TabPane tab={<Space><FiShoppingBag /> Product Details</Space>} key="details">
          <Card className="shadow-md">
            <Title level={4} className="mb-4">
              Product Information
            </Title>
            <Descriptions bordered column={{ xs: 1, sm: 2 }}>
              <Descriptions.Item label="Name">{product.name || '--'}</Descriptions.Item>
              <Descriptions.Item label="Short Description">{product.short_description || '--'}</Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                <ReactQuill
                  value={product.description || '--'}
                  readOnly
                  theme="snow"
                  className="bg-white pointer-events-none"
                />
              </Descriptions.Item>
              <Descriptions.Item label="Care & Maintenance" span={2}>
                <ReactQuill
                  value={product.care_maintenance || '--'}
                  readOnly
                  theme="snow"
                  className="bg-white pointer-events-none"
                />
              </Descriptions.Item>
              <Descriptions.Item label="Warranty" span={2}>
                <ReactQuill
                  value={product.warranty || '--'}
                  readOnly
                  theme="snow"
                  className="bg-white pointer-events-none"
                />
              </Descriptions.Item>
              <Descriptions.Item label="Returns" span={2}>
                <ReactQuill
                  value={product.returns || '--'}
                  readOnly
                  theme="snow"
                  className="bg-white pointer-events-none"
                />
              </Descriptions.Item>
              <Descriptions.Item label="Quality Promise" span={2}>
                <ReactQuill
                  value={product.quality_promise || '--'}
                  readOnly
                  theme="snow"
                  className="bg-white pointer-events-none"
                />
              </Descriptions.Item>
              <Descriptions.Item label="Vendor">
                {product.vendor?.full_name || '--'} ({product.vendor?.email || '--'})
              </Descriptions.Item>
              <Descriptions.Item label="Category">{product.category?.name || '--'}</Descriptions.Item>
              <Descriptions.Item label="Brand">{product.brand?.name || '--'}</Descriptions.Item>
              <Descriptions.Item label="Material">{product.material?.name || '--'}</Descriptions.Item>
              <Descriptions.Item label="Attributes" span={2}>
                {product.attributes?.map((attr) => attr.name).join(', ') || '--'}
              </Descriptions.Item>
              <Descriptions.Item label="Tags" span={2}>
                {product.tags?.map((tag) => tag.name).join(', ') || '--'}
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                {product.pricing?.currency?.symbol} {product.pricing?.sale_price?.toFixed(2) || product.pricing?.final_price?.toFixed(2) || '--'}
              </Descriptions.Item>
              <Descriptions.Item label="Discount">
                {product.pricing?.discount?.value ? (
                  <>
                    {product.pricing.discount.type === 'percentage'
                      ? `${product.pricing.discount.value}%`
                      : `${product.pricing.currency.symbol} ${product.pricing.discount.value}`}{' '}
                    (Valid till {new Date(product.pricing.discount.valid_till).toLocaleDateString('en-GB')})
                  </>
                ) : (
                  '--'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    product.verification_status.status === 'pending'
                      ? 'orange'
                      : product.verification_status.status === 'approved'
                      ? 'green'
                      : 'red'
                  }
                >
                  {product.verification_status.status.charAt(0).toUpperCase() +
                    product.verification_status.status.slice(1)}
                </Tag>
                {product.verification_status.status === 'rejected' &&
                  product.verification_status.rejection_reason && (
                    <Paragraph type="secondary" className="mt-1">
                      Reason: {product.verification_status.rejection_reason}
                    </Paragraph>
                  )}
                {product.verification_status.status === 'rejected' &&
                  product.verification_status.suggestion && (
                    <Paragraph type="secondary" className="mt-1">
                      Suggestion: {product.verification_status.suggestion}
                    </Paragraph>
                  )}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-GB') : '--'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </TabPane>
        <TabPane tab={<Space><FiFile /> SEO Details</Space>} key="seo">
          <Card className="shadow-md">
            <Title level={4} className="mb-4">
              SEO Details
            </Title>
            <Descriptions bordered column={{ xs: 1, sm: 1 }}>
              <Descriptions.Item label="Meta Title">{product.seo?.meta_title || '--'}</Descriptions.Item>
              <Descriptions.Item label="Meta Description">{product.seo?.meta_description || '--'}</Descriptions.Item>
              <Descriptions.Item label="Keywords">{product.seo?.keywords?.join(', ') || '--'}</Descriptions.Item>
            </Descriptions>
          </Card>
        </TabPane>
        <TabPane tab={<Space><FiFile /> Color Variants</Space>} key="color_variants">
          <Card className="shadow-md">
            <Title level={4} className="mb-4">
              Color Variants
            </Title>
            <Collapse accordion>
              {product.color_variants?.length > 0 ? (
                product.color_variants.map((variant, index) => (
                  <Panel
                    header={
                      <div className="flex items-center">
                        <div
                          className="w-6 h-6 rounded-full mr-2"
                          style={{ backgroundColor: variant.color_code }}
                        />
                        <span>{variant.color_name || `Variant ${index + 1}`}</span>
                      </div>
                    }
                    key={index}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {variant.images?.map((img, imgIndex) => (
                        <Card
                          key={img._id}
                          hoverable
                          cover={
                            <img
                              alt={img.alt_text || `Image ${imgIndex + 1}`}
                              src={`http://localhost:5000/${img.url}`}
                              className="h-40 object-cover"
                            />
                          }
                        >
                          <Card.Meta
                            title={
                              <Space>
                                {img.is_primary && <Tag color="blue">Primary</Tag>}
                                <Tag color={getAssetStatusColor(img.verified, img.reason)}>
                                  {getAssetStatusText(img.verified, img.reason)}
                                </Tag>
                              </Space>
                            }
                            description={
                              <div>
                                {img.reason && <Paragraph type="danger">Reason: {img.reason}</Paragraph>}
                                {img.suggestion && <Paragraph type="secondary">Suggestion: {img.suggestion}</Paragraph>}
                              </div>
                            }
                          />
                          {user.is_superadmin &&
                            !img.verified &&
                            product.verification_status.status === 'pending' && (
                              <Space style={{ marginTop: 8 }}>
                                <Tooltip title="Approve Image">
                                  <Button
                                    type="text"
                                    icon={verifyingAsset === img._id ? <Spin size="small" /> : <FiCheck className="text-green-600" />}
                                    onClick={() => openVerificationModal(img._id, 'image', true)}
                                    disabled={verifyingAsset === img._id}
                                    className="border border-gray-300 rounded-md p-1 hover:bg-green-50 transition-colors text-green-600"
                                  >
                                    Approve
                                  </Button>
                                </Tooltip>
                                <Tooltip title="Reject Image">
                                  <Button
                                    type="text"
                                    icon={<FiX className="text-red-600" />}
                                    onClick={() => openVerificationModal(img._id, 'image', false)}
                                    disabled={verifyingAsset === img._id}
                                    className="border border-gray-300 rounded-md p-1 hover:bg-red-50 transition-colors text-red-600"
                                  >
                                    Reject
                                  </Button>
                                </Tooltip>
                              </Space>
                            )}
                          <Button
                            type="text"
                            icon={<FiZoomIn className="text-blue-600" />}
                            onClick={() => openImageModal(img)}
                            className="border border-gray-300 rounded-md p-1 hover:bg-blue-50 transition-colors text-blue-600"
                            style={{ marginTop: 8 }}
                          >
                            View
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </Panel>
                ))
              ) : (
                <Empty description="No color variants uploaded" imageStyle={{ height: 60 }} />
              )}
            </Collapse>
          </Card>
        </TabPane>
        <TabPane tab={<Space><FiFile /> 3D Model</Space>} key="three_d_model">
          <Card className="shadow-md">
            <Title level={4} className="mb-4">
              3D Model
            </Title>
            {product.three_d_model ? (
              <Card
                hoverable
                cover={
                  <div className="h-40 flex items-center justify-center bg-gray-100">
                    <FiFile size={48} className="text-gray-400" />
                  </div>
                }
              >
                <Card.Meta
                  title={product.three_d_model.url.split('\\').pop()}
                  description={
                    <Space direction="vertical">
                      <Tag color={getAssetStatusColor(product.three_d_model.verified, product.three_d_model.reason)}>
                        {getAssetStatusText(product.three_d_model.verified, product.three_d_model.reason)}
                      </Tag>
                      {product.three_d_model.reason && <Paragraph type="danger">Reason: {product.three_d_model.reason}</Paragraph>}
                      {product.three_d_model.suggestion && <Paragraph type="secondary">Suggestion: {product.three_d_model.suggestion}</Paragraph>}
                    </Space>
                  }
                />
                {user.is_superadmin &&
                  !product.three_d_model.verified &&
                  product.verification_status.status === 'pending' && (
                    <Space style={{ marginTop: 8 }}>
                      <Tooltip title="Approve 3D Model">
                        <Button
                          type="text"
                          icon={verifyingAsset === product.three_d_model._id ? <Spin size="small" /> : <FiCheck className="text-green-600" />}
                          onClick={() => openVerificationModal(product.three_d_model._id, 'three_d_model', true)}
                          disabled={verifyingAsset === product.three_d_model._id}
                          className="border border-gray-300 rounded-md p-1 hover:bg-green-50 transition-colors text-green-600"
                        >
                          Approve
                        </Button>
                      </Tooltip>
                      <Tooltip title="Reject 3D Model">
                        <Button
                          type="text"
                          icon={<FiX className="text-red-600" />}
                          onClick={() => openVerificationModal(product.three_d_model._id, 'three_d_model', false)}
                          disabled={verifyingAsset === product.three_d_model._id}
                          className="border border-gray-300 rounded-md p-1 hover:bg-red-50 transition-colors text-red-600"
                        >
                          Reject
                        </Button>
                      </Tooltip>
                    </Space>
                  )}
                <Button
                  type="text"
                  icon={<FiDownload className="text-blue-600" />}
                  onClick={() => downloadAsset(product.three_d_model.url)}
                  className="border border-gray-300 rounded-md p-1 hover:bg-blue-50 transition-colors text-blue-600"
                  style={{ marginTop: 8 }}
                >
                  Download
                </Button>
              </Card>
            ) : (
              <Empty description="No 3D model uploaded" imageStyle={{ height: 60 }} />
            )}
          </Card>
        </TabPane>
        <TabPane tab={<Space><FiFile /> Documents</Space>} key="documents">
          <Card className="shadow-md">
            <Title level={4} className="mb-4">
              Documents
            </Title>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(documentTypes).map(([type, label]) => (
                <div key={type}>
                  <Title level={5} className="mb-2">
                    {label}
                  </Title>
                  {groupedDocuments[type].length > 0 ? (
                    groupedDocuments[type].map((doc) => {
                      const isImage = doc.path && isImageFile(doc.path);
                      return (
                        <Card
                          key={doc._id}
                          hoverable
                          cover={
                            isImage ? (
                              <img
                                alt={label}
                                src={`http://localhost:5000/${doc.path}`}
                                className="h-40 object-cover"
                              />
                            ) : (
                              <div className="h-40 flex items-center justify-center bg-gray-100">
                                <FiFile size={48} className="text-gray-400" />
                              </div>
                            )
                          }
                        >
                          <Card.Meta
                            title={
                              <Space>
                                <Tag color={getAssetStatusColor(doc.verified, doc.reason)}>
                                  {getAssetStatusText(doc.verified, doc.reason)}
                                </Tag>
                              </Space>
                            }
                            description={
                              <div>
                                {doc.reason && <Paragraph type="danger">Reason: {doc.reason}</Paragraph>}
                                {doc.suggestion && <Paragraph type="secondary">Suggestion: {doc.suggestion}</Paragraph>}
                                {doc.uploaded_at && (
                                  <Paragraph type="secondary">
                                    Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                                  </Paragraph>
                                )}
                              </div>
                            }
                          />
                          {user.is_superadmin &&
                            !doc.verified &&
                            product.verification_status.status === 'pending' && (
                              <Space style={{ marginTop: 8 }}>
                                <Tooltip title={`Approve ${label}`}>
                                  <Button
                                    type="text"
                                    icon={verifyingAsset === doc._id ? <Spin size="small" /> : <FiCheck className="text-green-600" />}
                                    onClick={() => openVerificationModal(doc._id, 'document', true)}
                                    disabled={verifyingAsset === doc._id}
                                    className="border border-gray-300 rounded-md p-1 hover:bg-green-50 transition-colors text-green-600"
                                  >
                                    Approve
                                  </Button>
                                </Tooltip>
                                <Tooltip title={`Reject ${label}`}>
                                  <Button
                                    type="text"
                                    icon={<FiX className="text-red-600" />}
                                    onClick={() => openVerificationModal(doc._id, 'document', false)}
                                    disabled={verifyingAsset === doc._id}
                                    className="border border-gray-300 rounded-md p-1 hover:bg-red-50 transition-colors text-red-600"
                                  >
                                    Reject
                                  </Button>
                                </Tooltip>
                              </Space>
                            )}
                          <Space style={{ marginTop: 8 }}>
                            {isImage && (
                              <Button
                                type="text"
                                icon={<FiZoomIn className="text-blue-600" />}
                                onClick={() => openImageModal(doc)}
                                className="border border-gray-300 rounded-md p-1 hover:bg-blue-50 transition-colors text-blue-600"
                              >
                                View
                              </Button>
                            )}
                            <Button
                              type="text"
                              icon={<FiDownload className="text-blue-600" />}
                              onClick={() => downloadAsset(doc.path)}
                              disabled={!doc.path}
                              className="border border-gray-300 rounded-md p-1 hover:bg-blue-50 transition-colors text-blue-600"
                            >
                              Download
                            </Button>
                          </Space>
                        </Card>
                      );
                    })
                  ) : (
                    <Card>
                      <Empty description="No documents uploaded" imageStyle={{ height: 60 }} />
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabPane>
      </Tabs>

      {user.is_superadmin && product.verification_status.status === 'pending' && (
        <div className="mt-8 flex justify-end gap-4">
          <Tooltip title={allAssetsVerified ? 'Approve Product and All Assets' : 'All assets must be verified before approving'}>
            <Button
              type="text"
              icon={verifyingProduct ? <Spin size="small" /> : <FiCheck className="text-green-600" />}
              onClick={() =>
                showConfirmDialog(
                  'Approve Product',
                  'Are you sure you want to approve this product and all its assets? This action cannot be undone.',
                  () => handleStatusUpdate('approved')
                )
              }
              className="border border-gray-300 rounded-md p-1 hover:bg-green-50 transition-colors text-green-600"
              disabled={!allAssetsVerified || verifyingProduct}
              loading={verifyingProduct}
            >
              Approve Product
            </Button>
          </Tooltip>
          <Tooltip title="Reject Product and All Assets">
            <Button
              type="text"
              icon={<FiX className="text-red-600" />}
              onClick={openRejectModal}
              className="border border-gray-300 rounded-md p-1 hover:bg-red-50 transition-colors text-red-600"
              disabled={verifyingProduct}
            >
              Reject Product
            </Button>
          </Tooltip>
        </div>
      )}

      {product.verification_status.status === 'approved' && (
        <div className="mt-8 flex justify-end">
          <Tooltip title="Manage Inventory">
            <Button
              type="text"
              icon={<FiShoppingBag className="text-purple-600" />}
              onClick={() => navigate(`/sawtar/cms/products/inventory/${product._id}`)}
              className="border border-gray-300 rounded-md p-1 hover:bg-purple-50 transition-colors text-purple-600"
            >
              Manage Inventory
            </Button>
          </Tooltip>
        </div>
      )}

      {/* Product Reject Modal */}
      <Modal open={showRejectModal} onCancel={closeRejectModal} footer={null} centered>
        <Title level={4} className="mb-4">
          Reject Product
        </Title>
        <Paragraph>
          Product: <span className="font-medium">{product.name}</span>
        </Paragraph>
        <div className="mb-6">
          <Paragraph type="secondary" className="mb-2">
            Reason for Rejection
          </Paragraph>
          <TextArea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
            placeholder="Provide a reason for rejection..."
            disabled={verifyingProduct}
          />
        </div>
        <div className="mb-6">
          <Paragraph type="secondary" className="mb-2">
            Suggestion (Optional)
          </Paragraph>
          <TextArea
            value={rejectionSuggestion}
            onChange={(e) => setRejectionSuggestion(e.target.value)}
            rows={4}
            placeholder="Provide a suggestion..."
            disabled={verifyingProduct}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <Button onClick={closeRejectModal} disabled={verifyingProduct}>
            Cancel
          </Button>
          <Button
            type="primary"
            danger
            onClick={() =>
              showConfirmDialog(
                'Confirm Rejection',
                'Are you sure you want to reject this product and all its assets? This action cannot be undone.',
                () => handleStatusUpdate('rejected', rejectionReason, rejectionSuggestion)
              )
            }
            disabled={!rejectionReason.trim() || verifyingProduct}
            loading={verifyingProduct}
          >
            Confirm Rejection
          </Button>
        </div>
      </Modal>

      {/* Image Viewer Modal */}
      <Modal open={imageViewerOpen} onCancel={closeImageModal} footer={null} width={800} centered>
        <div className="flex justify-between items-center mb-4">
          <Title level={4}>
            {selectedAsset?.alt_text ||
              (selectedAsset?.is_primary ? 'Primary Image' : selectedAsset?.type || 'Asset')}
          </Title>
          <Button type="text" icon={<FiX className="text-gray-600" />} onClick={closeImageModal} />
        </div>
        <div className="flex justify-center mb-4">
          <img
            src={`http://localhost:5000/${selectedAsset?.url || selectedAsset?.path}`}
            alt={selectedAsset?.alt_text || 'Asset'}
            className="max-w-full max-h-[60vh] object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              const errorDiv = document.createElement('div');
              errorDiv.className = 'text-center text-gray-500 p-8';
              errorDiv.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="grey" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 3v5h5M12 18v-6M9 15h6"/></svg><p>Unable to load preview</p><p className="text-sm mt-2">Please download to view</p>';
              e.target.parentNode.appendChild(errorDiv);
            }}
          />
        </div>
        <Divider />
        <div className="flex justify-between items-center mt-4">
          <div>
            {selectedAsset?.is_primary && (
              <Tag color="blue" className="mr-2">
                Primary
              </Tag>
            )}
            <div className="flex items-center">
              {getVerificationBadge(selectedAsset?.verified, selectedAsset?.reason)}
              <Tag
                color={getAssetStatusColor(selectedAsset?.verified, selectedAsset?.reason)}
                className="ml-2"
              >
                {getAssetStatusText(selectedAsset?.verified, selectedAsset?.reason)}
              </Tag>
            </div>
            {(selectedAsset?.reason || selectedAsset?.suggestion) && (
              <div className="mt-2">
                {selectedAsset.reason && (
                  <Paragraph className="text-red-500 text-sm">
                    Reason: {selectedAsset.reason}
                  </Paragraph>
                )}
                {selectedAsset.suggestion && (
                  <Paragraph className="text-gray-500 text-sm">
                    Suggestion: {selectedAsset.suggestion}
                  </Paragraph>
                )}
              </div>
            )}
          </div>
          <Space>
            <Tooltip title="Download Asset">
              <Button
                type="text"
                icon={<FiDownload className="text-blue-600" />}
                onClick={() => downloadAsset(selectedAsset?.url || selectedAsset?.path)}
                className="border border-gray-300 rounded-md p-1 hover:bg-blue-50 transition-colors text-blue-600"
              >
                Download
              </Button>
            </Tooltip>
            {user.is_superadmin &&
              !selectedAsset?.verified &&
              product.verification_status.status === 'pending' && (
                <>
                  <Tooltip title="Approve Asset">
                    <Button
                      type="text"
                      icon={verifyingAsset === selectedAsset._id ? <Spin size="small" /> : <FiCheck className="text-green-600" />}
                      onClick={() =>
                        openVerificationModal(selectedAsset._id, selectedAsset.type || 'image', true)
                      }
                      disabled={verifyingAsset === selectedAsset._id}
                      className="border border-gray-300 rounded-md p-1 hover:bg-green-50 transition-colors text-green-600"
                    >
                      Approve
                    </Button>
                  </Tooltip>
                  <Tooltip title="Reject Asset">
                    <Button
                      type="text"
                      icon={<FiX className="text-red-600" />}
                      onClick={() =>
                        openVerificationModal(selectedAsset._id, selectedAsset.type || 'image', false)
                      }
                      disabled={verifyingAsset === selectedAsset._id}
                      className="border border-gray-300 rounded-md p-1 hover:bg-red-50 transition-colors text-red-600"
                    >
                      Reject
                    </Button>
                  </Tooltip>
                </>
              )}
          </Space>
        </div>
      </Modal>

      {/* Asset Verification Modal */}
      <Modal
        open={verificationModalOpen}
        onCancel={() => setVerificationModalOpen(false)}
        footer={null}
        centered
      >
        <Title level={4} className="mb-4">
          {isApproving ? `Approve ${assetType || 'Asset'}` : `Reject ${assetType || 'Asset'}`}
        </Title>
        {!isApproving && (
          <div className="mb-4">
            <Paragraph type="secondary" className="mb-2">
              Reason (Required)
            </Paragraph>
            <Input
              placeholder="Reason for rejection"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              status={!isApproving && !reason.trim() ? 'error' : ''}
              disabled={verifyingAsset === selectedAssetId}
            />
            {!isApproving && !reason.trim() && (
              <Paragraph className="text-red-500 text-sm mt-1">
                Reason is required for rejection
              </Paragraph>
            )}
          </div>
        )}
        <div className="mb-4">
          <Paragraph type="secondary" className="mb-2">
            Suggestion (Optional)
          </Paragraph>
          <TextArea
            placeholder="Provide a suggestion for improvement"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            disabled={verifyingAsset === selectedAssetId}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button onClick={() => setVerificationModalOpen(false)} disabled={verifyingAsset === selectedAssetId}>
            Cancel
          </Button>
          <Button
            type="primary"
            danger={!isApproving}
            onClick={handleSubmitVerification}
            disabled={verifyingAsset === selectedAssetId || (!isApproving && !reason.trim())}
            loading={verifyingAsset === selectedAssetId}
          >
            {isApproving ? 'Approve' : 'Reject'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductReview;
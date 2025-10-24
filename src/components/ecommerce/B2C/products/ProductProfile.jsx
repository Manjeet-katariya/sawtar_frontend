import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiFile, FiDownload, FiZoomIn, FiCheckCircle, FiXCircle, FiUpload } from 'react-icons/fi';
import { apiService } from '../../../../manageApi/utils/custom.apiservice';
import { showToast } from '../../../../manageApi/utils/toast';
import { Button, Card, Spin, Row, Col, Descriptions, Empty, Tag, Modal, Divider, Space, Progress, Alert, Tabs, Typography, Collapse, Upload } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Title, Paragraph, Text: TypographyText } = Typography;

const ProductProfile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [uploadingAssetId, setUploadingAssetId] = useState(null);
  const [verificationProgress, setVerificationProgress] = useState({
    total: 0,
    verified: 0,
    percentage: 0,
  });

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await apiService.get(`/products?product_id=${productId}`);
        if (response.success && response.products.length > 0) {
          setProduct(response.products[0]);
        } else {
          showToast('Product not found', 'error');
        }
      } catch (error) {
        showToast(error.response?.data?.message || 'Failed to fetch product', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && productId) {
      fetchProduct();
    }
  }, [user?.id, productId]);

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
      const documents = product.documents || {};
      Object.values(documents).forEach((doc) => {
        if (doc && doc.path) {
          totalAssets += 1;
          if (doc.verified) verifiedAssets += 1;
        }
      });

      // Count 3D model
      if (product.three_d_model?.url) {
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

  // Handle asset re-upload
  const handleAssetUpload = async (assetId, file, type) => {
    if (!file || !assetId) {
      showToast('Invalid file or asset ID', 'error');
      return;
    }

    setUploadingAssetId(assetId);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (type) formData.append('type', type);

      const response = await apiService.put(`/products/${productId}/update-asset/${assetId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.success) {
        showToast('Asset updated successfully', 'success');
        const fetchResponse = await apiService.get(`/products?product_id=${productId}`);
        if (fetchResponse.success && fetchResponse.products.length > 0) {
          setProduct(fetchResponse.products[0]);
        }
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update asset', 'error');
    } finally {
      setUploadingAssetId(null);
    }
  };

  // Handle product resubmit
  const handleResubmit = async () => {
    try {
      await apiService.put(`/products/${productId}`, { status: 'pending_verification' });
      showToast('Product resubmitted for verification', 'success');
      const response = await apiService.get(`/products?product_id=${productId}`);
      if (response.success && response.products.length > 0) {
        setProduct(response.products[0]);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to resubmit product', 'error');
    }
  };

  const downloadAsset = (path) => {
    if (path) {
      window.open(`http://localhost:5000/${path}`, '_blank');
    } else {
      showToast('No file path available for download', 'error');
    }
  };

  const openImageModal = (asset) => {
    if (asset && (asset.url || asset.path)) {
      setSelectedAsset(asset);
      setImageViewerOpen(true);
    }
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

  const getVerificationBadge = (verified, reason) => {
    if (verified) {
      return <FiCheckCircle className="text-green-600 text-lg" />;
    } else if (reason) {
      return <FiXCircle className="text-red-600 text-lg" />;
    }
    return null;
  };

  const getAssetStatusColor = (verified, reason) => {
    if (verified) return 'green';
    if (reason) return 'red';
    return 'orange';
  };

  const getAssetStatusText = (verified, reason) => {
    if (verified) return 'Approved';
    if (reason) return 'Rejected';
    return 'Pending';
  };

  const documentTypes = {
    product_invoice: 'Product Invoice',
    product_certificate: 'Product Certificate',
    quality_report: 'Quality Report',
  };

  const getDocumentsByType = () => {
    const docs = {};
    Object.entries(documentTypes).forEach(([type, label]) => {
      docs[type] = product.documents && product.documents[type] ? [{ ...product.documents[type], type }] : [];
    });
    return docs;
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

  const groupedDocuments = getDocumentsByType();
  const allAssetsVerified =
    Object.values(product.documents || {}).every((doc) => !doc || doc.verified) &&
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
              <TypographyText type="secondary">{product.short_description || '--'}</TypographyText>
            </Space>
          </Col>
          <Col>
            <FiArrowLeft
              onClick={() => navigate(-1)}
              style={{ fontSize: '24px', cursor: 'pointer', color: '#1890ff' }}
            />
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
                {product.verification_status?.status === 'approved'
                  ? 'Product is verified.'
                  : product.verification_status?.status === 'rejected'
                  ? 'Product is rejected. Please update assets and resubmit.'
                  : 'Product is pending verification.'}
              </Paragraph>
              {product.verification_status?.status === 'rejected' && (
                <>
                  {product.verification_status.rejection_reason && (
                    <Paragraph className="text-red-500 text-sm mt-1">
                      Reason: {product.verification_status.rejection_reason}
                    </Paragraph>
                  )}
                  {product.verification_status.suggestion && (
                    <Paragraph className="text-gray-500 text-sm mt-1">
                      Suggestion: {product.verification_status.suggestion}
                    </Paragraph>
                  )}
                </>
              )}
            </div>
          }
          type={product.verification_status?.status === 'approved' ? 'success' : product.verification_status?.status === 'rejected' ? 'error' : 'info'}
          showIcon
        />
      </div>

      <Tabs defaultActiveKey="details" type="card">
        <TabPane tab={<Space><FiFile /> Product Details</Space>} key="details">
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
              <Descriptions.Item label="Vendor">
                {product.vendor?.full_name || '--'} ({product.vendor?.email || '--'})
              </Descriptions.Item>
              <Descriptions.Item label="Category">{product.category?.name || '--'}</Descriptions.Item>
              <Descriptions.Item label="Brand">{product.brand?.name || '--'}</Descriptions.Item>
              <Descriptions.Item label="Material">{product.material?.name || '--'}</Descriptions.Item>
              <Descriptions.Item label="Attributes" span={2}>
                {product.attributes?.length > 0 ? product.attributes.map((attr) => attr.name).join(', ') : '--'}
              </Descriptions.Item>
              <Descriptions.Item label="Tags" span={2}>
                {product.tags?.length > 0 ? product.tags.map((tag) => tag.name).join(', ') : '--'}
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                {product.pricing?.currency?.symbol || '₹'} {product.pricing?.sale_price?.toFixed(2) || '--'}
              </Descriptions.Item>
              <Descriptions.Item label="Cost Price">
                {product.pricing?.currency?.symbol || '₹'} {product.pricing?.cost_price?.toFixed(2) || '--'}
              </Descriptions.Item>
              <Descriptions.Item label="MRP">
                {product.pricing?.currency?.symbol || '₹'} {product.pricing?.mrp?.toFixed(2) || '--'}
              </Descriptions.Item>
              <Descriptions.Item label="Discount">
                {product.pricing?.discount && product.pricing.discount.value > 0
                  ? `${product.pricing.discount.type === 'percentage' ? `${product.pricing.discount.value}%` : `${product.pricing.currency?.symbol || '₹'} ${product.pricing.discount.value}`}`
                  : '--'}
              </Descriptions.Item>
              <Descriptions.Item label="Tax">
                {product.pricing?.tax?.rate ? `${product.pricing.tax.rate}%` : '--'}
              </Descriptions.Item>
              <Descriptions.Item label="Shipping">
                {product.shipping?.free_shipping ? 'Free Shipping' : 'Paid Shipping'}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    product.verification_status?.status === 'pending'
                      ? 'orange'
                      : product.verification_status?.status === 'approved'
                      ? 'green'
                      : 'red'
                  }
                >
                  {product.verification_status?.status.charAt(0).toUpperCase() +
                    product.verification_status?.status.slice(1)}
                </Tag>
                {product.verification_status?.status === 'rejected' &&
                  product.verification_status.rejection_reason && (
                    <Paragraph type="secondary" className="mt-1">
                      Reason: {product.verification_status.rejection_reason}
                    </Paragraph>
                  )}
                {product.verification_status?.status === 'rejected' &&
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
              <Descriptions.Item label="Keywords">{product.seo?.keywords?.length > 0 ? product.seo.keywords.join(', ') : '--'}</Descriptions.Item>
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
                          style={{ backgroundColor: variant.color_code || '#000' }}
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
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                              }}
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
                          {!img.verified && product.verification_status?.status !== 'approved' && (
                            <Space style={{ marginTop: 8 }}>
                              <Upload
                                accept="image/*"
                                showUploadList={false}
                                beforeUpload={(file) => {
                                  handleAssetUpload(img._id, file, 'image');
                                  return false;
                                }}
                              >
                                <Button
                                  icon={<FiUpload />}
                                  size="small"
                                  loading={uploadingAssetId === img._id}
                                >
                                  Re-upload
                                </Button>
                              </Upload>
                            </Space>
                          )}
                          <Button
                            type="link"
                            icon={<FiZoomIn />}
                            onClick={() => openImageModal(img)}
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
            {product.three_d_model?.url ? (
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
                {!product.three_d_model.verified && product.verification_status?.status !== 'approved' && (
                  <Space style={{ marginTop: 8 }}>
                    <Upload
                      accept=".glb,.gltf,.obj,.fbx"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        handleAssetUpload(product.three_d_model._id, file, 'three_d_model');
                        return false;
                      }}
                    >
                      <Button
                        icon={<FiUpload />}
                        size="small"
                        loading={uploadingAssetId === product.three_d_model._id}
                      >
                        Re-upload
                      </Button>
                    </Upload>
                  </Space>
                )}
                <Button
                  type="link"
                  icon={<FiDownload />}
                  onClick={() => downloadAsset(product.three_d_model.url)}
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
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                                }}
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
                                    Uploaded: {new Date(doc.uploaded_at).toLocaleDateString('en-GB')}
                                  </Paragraph>
                                )}
                              </div>
                            }
                          />
                          {!doc.verified && product.verification_status?.status !== 'approved' && (
                            <Space style={{ marginTop: 8 }}>
                              <Upload
                                accept=".pdf,image/*"
                                showUploadList={false}
                                beforeUpload={(file) => {
                                  handleAssetUpload(doc._id, file, 'document');
                                  return false;
                                }}
                              >
                                <Button
                                  icon={<FiUpload />}
                                  size="small"
                                  loading={uploadingAssetId === doc._id}
                                >
                                  Re-upload
                                </Button>
                              </Upload>
                            </Space>
                          )}
                          <Space style={{ marginTop: 8 }}>
                            {isImage && (
                              <Button
                                type="link"
                                icon={<FiZoomIn />}
                                onClick={() => openImageModal(doc)}
                              >
                                View
                              </Button>
                            )}
                            <Button
                              type="link"
                              icon={<FiDownload />}
                              onClick={() => downloadAsset(doc.path)}
                              disabled={!doc.path}
                            >
                              Download
                            </Button>
                          </Space>
                        </Card>
                      );
                    })
                  ) : (
                    <Empty description={`No ${label.toLowerCase()} uploaded`} imageStyle={{ height: 60 }} />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabPane>
      </Tabs>

      {product.verification_status?.status === 'rejected' && (
        <div className="mt-8 flex justify-end">
          <Button
            type="primary"
            size="large"
            onClick={handleResubmit}
            className="bg-indigo-600"
          >
            Resubmit for Verification
          </Button>
        </div>
      )}

      {product.verification_status?.status === 'approved' && (
        <div className="mt-8 flex justify-end">
          <Button
            type="primary"
            icon={<FiFile />}
            onClick={() => navigate(`/sawtar/cms/products/inventory/${productId}`)}
          >
            Manage Inventory
          </Button>
        </div>
      )}

      <Modal
        open={imageViewerOpen}
        onCancel={closeImageModal}
        footer={null}
        width={800}
        centered
      >
        <div className="flex justify-between items-center mb-4">
          <Title level={4}>
            {selectedAsset?.alt_text ||
              (selectedAsset?.is_primary ? 'Primary Image' : selectedAsset?.type || 'Asset')}
          </Title>
          <Button type="text" icon={<FiXCircle />} onClick={closeImageModal} />
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
            <Button
              icon={<FiDownload />}
              type="primary"
              onClick={() => downloadAsset(selectedAsset?.url || selectedAsset?.path)}
              disabled={!selectedAsset || (!selectedAsset.url && !selectedAsset.path)}
            >
              Download
            </Button>
            {selectedAsset && !selectedAsset.verified && product.verification_status?.status !== 'approved' && selectedAsset._id && (
              <Upload
                accept={selectedAsset.type === 'document' ? '.pdf,image/*' : 'image/*'}
                showUploadList={false}
                beforeUpload={(file) => {
                  handleAssetUpload(selectedAsset._id, file, selectedAsset.type || 'image');
                  return false;
                }}
              >
                <Button icon={<FiUpload />} loading={uploadingAssetId === selectedAsset._id}>
                  Re-upload
                </Button>
              </Upload>
            )}
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default ProductProfile;
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../../../../../manageApi/utils/custom.apiservice';
import { showToast } from '../../../../../../manageApi/utils/toast';
import { FaArrowLeft, FaFile, FaBuilding, FaPhone, FaEnvelope, FaGlobe, FaClock, FaStar, FaChartLine, FaUsers, FaBox, FaServicestack, FaInfoCircle, FaHistory } from 'react-icons/fa';
import { ArrowDownOutlined } from '@ant-design/icons';
import {
  Card,
  Modal,
  Button,
  Input,
  Spin,
  Avatar,
  Tag,
  Divider,
  List,
  Tooltip,
  Table,
  Collapse,
  Typography,
  Image,
  Space,
  Row,
  Col,
  Empty,
  Badge,
} from 'antd';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;

const FreelancerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifyingDoc, setVerifyingDoc] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [reason, setReason] = useState('');
  const [suggestion, setSuggestion] = useState('');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
    fetchFreelancer();
  }, [id, token]);

  const fetchFreelancer = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(`/freelancer?freelancerId=${id}`);
      setFreelancer(response.freelancer);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to fetch freelancer details', 'error');
      navigate('/sawtar/cms/freelancer');
    } finally {
      setLoading(false);
    }
  };

  const openVerificationModal = (docId, approving) => {
    setSelectedDocId(docId);
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

    setVerifyingDoc(selectedDocId);
    try {
      await apiService.put('/freelancer/document/verification/check', {
        freelancerId: id,
        documentId: selectedDocId,
        verified: isApproving,
        reason: reason.trim(),
        suggestion: suggestion.trim(),
      });
      showToast(`Document ${isApproving ? 'approved' : 'rejected'} successfully`, 'success');
      fetchFreelancer();
      setVerificationModalOpen(false);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update document', 'error');
    } finally {
      setVerifyingDoc(null);
    }
  };

  const downloadDocument = (path) => {
    window.open(`http://localhost:5000/${path}`, '_blank');
  };

  const openImageModal = (document) => {
    setSelectedDocument(document);
    setImageViewerOpen(true);
  };

  const closeImageModal = () => {
    setImageViewerOpen(false);
    setSelectedDocument(null);
  };

  const isImageFile = (filename) => {
    if (!filename) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
  };

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Loading freelancer details..." />
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Text type="danger">Freelancer not found</Text>
          <Button type="primary" onClick={() => navigate('/sawtar/cms/freelancer')} className="mt-2">
            Back to Freelancers
          </Button>
        </div>
      </div>
    );
  }

  const documentTypes = {
    resume: 'Resume',
    portfolio: 'Portfolio',
    identity_proof: 'Identity Proof',
    address_proof: 'Address Proof',
  };

  const getDocumentsByType = () => {
    const docs = {};
    Object.keys(documentTypes).forEach((type) => {
      if (freelancer.documents && freelancer.documents[type]) {
        docs[type] = { ...freelancer.documents[type], type };
      }
    });
    return docs;
  };

  const groupedDocuments = getDocumentsByType();

  const statusColor = {
    0: 'orange',
    1: 'green',
    2: 'red',
    3: 'gray',
  };

  const statusLabel = {
    0: 'Pending',
    1: 'Approved',
    2: 'Rejected',
    3: 'Suspended',
  };

  const reviewColumns = [
    {
      title: 'User Name',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (text) => text || '--',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (text) => text || '--',
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      render: (text) => text || '--',
    },
    {
      title: 'Reply',
      dataIndex: 'reply',
      key: 'reply',
      render: (text) => text || '--',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => (text ? new Date(text).toLocaleString() : '--'),
    },
  ];

  const historyColumns = [
    {
      title: 'Updated By',
      dataIndex: 'updated_by',
      key: 'updated_by',
      render: (text) => text || '--',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text) => text || '--',
    },
    {
      title: 'Changes',
      dataIndex: 'changes',
      key: 'changes',
      render: (changes) => (changes ? changes.join(', ') : '--'),
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (text) => (text ? new Date(text).toLocaleString() : '--'),
    },
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
      <div className="mb-8 bg-white text-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold tracking-tight">Freelancer Profile</h1>
          <Button icon={<FaArrowLeft />} type="link" onClick={() => navigate('/sawtar/cms/freelancer')}>
            Back to Freelancers
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Basic Information */}
        <Card className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <Title level={4} className="text-teal-600 mb-4 flex items-center">
            <FaBuilding className="mr-2" /> Basic Information
          </Title>
          <div className="flex justify-center mb-4">
            <Avatar size={96} className="bg-teal-500">
              <FaBuilding className="text-white text-3xl" />
            </Avatar>
          </div>
          <Space direction="vertical" className="w-full">
            <div>
              <Text type="secondary">Email</Text>
              <Paragraph>{freelancer.email || '--'}</Paragraph>
            </div>
            <div>
              <Text type="secondary">Full Name</Text>
              <Paragraph>{freelancer.full_name || '--'}</Paragraph>
            </div>
            <div>
              <Text type="secondary">Mobile</Text>
              <Paragraph>
                {freelancer.mobile || '--'}
                {freelancer.is_mobile_verified && <Tag color="green" className="ml-2">Verified</Tag>}
              </Paragraph>
            </div>
            <div>
              <Text type="secondary">Status</Text>
              <Paragraph>
                <Tag color={statusColor[freelancer.status_info?.status]}>
                  {statusLabel[freelancer.status_info?.status] || 'Unknown'}
                </Tag>
              </Paragraph>
            </div>
            <div>
              <Text type="secondary">Availability</Text>
              <Paragraph>{freelancer.availability || '--'}</Paragraph>
            </div>
            <div>
              <Text type="secondary">Languages</Text>
              <Paragraph>{freelancer.languages?.join(', ') || '--'}</Paragraph>
            </div>
          </Space>
        </Card>

        {/* Location Details */}
        <Card className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 lg:col-span-2">
          <Title level={4} className="text-teal-600 mb-4 flex items-center">
            <FaInfoCircle className="mr-2" /> Location Details
          </Title>
          <Row gutter={16}>
            <Col span={12}>
              <Text type="secondary">City</Text>
              <Paragraph>{freelancer.location?.city || '--'}</Paragraph>
            </Col>
            <Col span={12}>
              <Text type="secondary">State</Text>
              <Paragraph>{freelancer.location?.state || '--'}</Paragraph>
            </Col>
            <Col span={12}>
              <Text type="secondary">Country</Text>
              <Paragraph>{freelancer.location?.country || '--'}</Paragraph>
            </Col>
            <Col span={12}>
              <Text type="secondary">Pincode</Text>
              <Paragraph>{freelancer.location?.pincode || '--'}</Paragraph>
            </Col>
          </Row>
        </Card>

        {/* Services Offered */}
        <Card className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <Title level={4} className="text-teal-600 mb-4 flex items-center">
            <FaServicestack className="mr-2" /> Services Offered
          </Title>
          {freelancer.servicesOffered?.length > 0 ? (
            <List
              dataSource={freelancer.servicesOffered}
              renderItem={(service, index) => (
                <List.Item key={index}>
                  <List.Item.Meta
                    title={service.title || '--'}
                    description={`Price Range: ${service.priceRange || '--'}`}
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No services offered" />
          )}
        </Card>

        {/* Contact Persons */}
        <Card className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <Title level={4} className="text-teal-600 mb-4 flex items-center">
            <FaUsers className="mr-2" /> Contact Persons
          </Title>
          <Collapse accordion>
            <Panel header="Primary Contact" key="primary">
              <Space direction="vertical">
                <Text>Name: {freelancer.contacts?.primary_contact?.name || '--'}</Text>
                <Text>Designation: {freelancer.contacts?.primary_contact?.designation || '--'}</Text>
                <Text>Email: {freelancer.contacts?.primary_contact?.email || '--'}</Text>
                <Text>Mobile: {freelancer.contacts?.primary_contact?.mobile || '--'}</Text>
                <Text>WhatsApp: {freelancer.contacts?.primary_contact?.whatsapp || '--'}</Text>
              </Space>
            </Panel>
            <Panel header="Support Contact" key="support">
              <Space direction="vertical">
                <Text>Name: {freelancer.contacts?.support_contact?.name || '--'}</Text>
                <Text>Designation: {freelancer.contacts?.support_contact?.designation || '--'}</Text>
                <Text>Email: {freelancer.contacts?.support_contact?.email || '--'}</Text>
                <Text>Mobile: {freelancer.contacts?.support_contact?.mobile || '--'}</Text>
                <Text>WhatsApp: {freelancer.contacts?.support_contact?.whatsapp || '--'}</Text>
              </Space>
            </Panel>
          </Collapse>
        </Card>

        {/* Documents */}
        <Card className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 col-span-1 md:col-span-2 lg:col-span-3">
          <Title level={4} className="text-teal-600 mb-4 flex items-center">
            <FaFile className="mr-2" /> Documents
          </Title>
          <Row gutter={16}>
            {Object.entries(documentTypes).map(([type, label]) => (
              <Col xs={24} md={12} key={type}>
                <Title level={5} className="text-teal-600 mb-2">
                  {label}
                </Title>
                {groupedDocuments[type] ? (
                  <Card bordered className="bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <Space direction="vertical">
                        <Tag color={groupedDocuments[type].verified ? 'green' : 'orange'}>
                          {groupedDocuments[type].verified ? 'Verified' : 'Pending Verification'}
                        </Tag>
                        {(groupedDocuments[type].reason || groupedDocuments[type].suggestion) && (
                          <Space direction="vertical" size="small">
                            {groupedDocuments[type].reason && (
                              <Text type="danger">Reason: {groupedDocuments[type].reason}</Text>
                            )}
                            {groupedDocuments[type].suggestion && (
                              <Text type="secondary">Suggestion: {groupedDocuments[type].suggestion}</Text>
                            )}
                          </Space>
                        )}
                        {groupedDocuments[type].uploaded_at && (
                          <Text type="secondary">
                            Uploaded At: {new Date(groupedDocuments[type].uploaded_at).toLocaleString()}
                          </Text>
                        )}
                      </Space>
                      <Space>
                        {groupedDocuments[type].path && isImageFile(groupedDocuments[type].path) && (
                          <Tooltip title="View Document">
                            <Button icon={<ArrowDownOutlined />} onClick={() => openImageModal(groupedDocuments[type])} />
                          </Tooltip>
                        )}
                        <Tooltip title="Download Document">
                          <Button
                            icon={<ArrowDownOutlined />}
                            onClick={() => downloadDocument(groupedDocuments[type].path)}
                            disabled={!groupedDocuments[type].path}
                          />
                        </Tooltip>
                        {!groupedDocuments[type].verified && (
                          <>
                            <Tooltip title="Approve Document">
                              <Button
                                type="primary"
                                icon={<FaArrowLeft />} // Replace with check icon if needed
                                onClick={() => openVerificationModal(groupedDocuments[type]._id, true)}
                                disabled={verifyingDoc === groupedDocuments[type]._id}
                              />
                            </Tooltip>
                            <Tooltip title="Reject Document">
                              <Button
                                danger
                                icon={<FaArrowLeft />} // Replace with clear icon
                                onClick={() => openVerificationModal(groupedDocuments[type]._id, false)}
                                disabled={verifyingDoc === groupedDocuments[type]._id}
                              />
                            </Tooltip>
                          </>
                        )}
                      </Space>
                    </div>
                    {groupedDocuments[type].path && isImageFile(groupedDocuments[type].path) && (
                      <div className="mt-4 cursor-pointer" onClick={() => openImageModal(groupedDocuments[type])}>
                        <Image
                          src={`http://localhost:5000/${groupedDocuments[type].path}`}
                          alt={label}
                          preview={false}
                          className="max-h-48 object-contain"
                          fallback={<div className="h-48 bg-gray-100 flex flex-col items-center justify-center"><FaFile size={32} className="text-gray-500" /><Text type="secondary">Preview not available</Text></div>}
                        />
                      </div>
                    )}
                  </Card>
                ) : (
                  <Card bordered className="bg-gray-50 rounded-lg">
                    <Empty description="No document uploaded" />
                  </Card>
                )}
              </Col>
            ))}
            {/* Certificates */}
            <Col xs={24} md={12}>
              <Title level={5} className="text-teal-600 mb-2">
                Certificates
              </Title>
              {freelancer.documents?.certificates?.length > 0 ? (
                freelancer.documents.certificates.map((cert, index) => (
                  <Card key={index} bordered className="bg-gray-50 rounded-lg mb-4">
                    <div className="flex justify-between items-start">
                      <Space direction="vertical">
                        <Tag color={cert.verified ? 'green' : 'orange'}>
                          {cert.verified ? 'Verified' : 'Pending Verification'}
                        </Tag>
                        {(cert.reason || cert.suggestion) && (
                          <Space direction="vertical" size="small">
                            {cert.reason && <Text type="danger">Reason: {cert.reason}</Text>}
                            {cert.suggestion && <Text type="secondary">Suggestion: {cert.suggestion}</Text>}
                          </Space>
                        )}
                        {cert.uploaded_at && (
                          <Text type="secondary">
                            Uploaded At: {new Date(cert.uploaded_at).toLocaleString()}
                          </Text>
                        )}
                      </Space>
                      <Space>
                        {cert.path && isImageFile(cert.path) && (
                          <Tooltip title="View Document">
                            <Button icon={<ArrowDownOutlined />} onClick={() => openImageModal(cert)} />
                          </Tooltip>
                        )}
                        <Tooltip title="Download Document">
                          <Button
                            icon={<ArrowDownOutlined />}
                            onClick={() => downloadDocument(cert.path)}
                            disabled={!cert.path}
                          />
                        </Tooltip>
                        {!cert.verified && (
                          <>
                            <Tooltip title="Approve Document">
                              <Button
                                type="primary"
                                icon={<FaArrowLeft />}
                                onClick={() => openVerificationModal(cert._id, true)}
                                disabled={verifyingDoc === cert._id}
                              />
                            </Tooltip>
                            <Tooltip title="Reject Document">
                              <Button
                                danger
                                icon={<FaArrowLeft />}
                                onClick={() => openVerificationModal(cert._id, false)}
                                disabled={verifyingDoc === cert._id}
                              />
                            </Tooltip>
                          </>
                        )}
                      </Space>
                    </div>
                    {cert.path && isImageFile(cert.path) && (
                      <div className="mt-4 cursor-pointer" onClick={() => openImageModal(cert)}>
                        <Image
                          src={`http://localhost:5000/${cert.path}`}
                          alt={`Certificate ${index + 1}`}
                          preview={false}
                          className="max-h-48 object-contain"
                          fallback={<div className="h-48 bg-gray-100 flex flex-col items-center justify-center"><FaFile size={32} className="text-gray-500" /><Text type="secondary">Preview not available</Text></div>}
                        />
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <Card bordered className="bg-gray-50 rounded-lg">
                  <Empty description="No certificates uploaded" />
                </Card>
              )}
            </Col>
          </Row>
        </Card>

        {/* Performance & Analytics */}
        <Card className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <Title level={4} className="text-teal-600 mb-4 flex items-center">
            <FaChartLine className="mr-2" /> Performance & Analytics
          </Title>
          <Row gutter={16}>
            <Col span={12}>
              <Text type="secondary">Ratings</Text>
              <Paragraph>{freelancer.performance?.ratings || '--'}</Paragraph>
            </Col>
            <Col span={12}>
              <Text type="secondary">Reviews Count</Text>
              <Paragraph>{freelancer.performance?.reviewsCount || '--'}</Paragraph>
            </Col>
          </Row>
        </Card>

        {/* Social Links & Gallery */}
        <Card className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 lg:col-span-2">
          <Title level={4} className="text-teal-600 mb-4 flex items-center">
            <FaGlobe className="mr-2" /> Social Links & Gallery
          </Title>
          <Row gutter={16}>
            <Col span={24}>
              <Text type="secondary">Social Links</Text>
              <Paragraph>
                LinkedIn: {freelancer.common?.socialLinks?.linkedin || '--'} <br />
                Instagram: {freelancer.common?.socialLinks?.instagram || '--'} <br />
                Twitter: {freelancer.common?.socialLinks?.twitter || '--'} <br />
                Facebook: {freelancer.common?.socialLinks?.facebook || '--'} <br />
                YouTube: {freelancer.common?.socialLinks?.youtube || '--'}
              </Paragraph>
            </Col>
            <Col span={24}>
              <Collapse accordion>
                <Panel header={`Gallery (${freelancer.common?.gallery?.length || 0})`} key="gallery">
                  {freelancer.common?.gallery?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {freelancer.common.gallery.map((img, index) => (
                        <Image
                          key={index}
                          width={100}
                          height={100}
                          src={`http://localhost:5000/${img}`}
                          alt={`Gallery ${index}`}
                          className="object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  ) : (
                    <Empty description="No gallery items" />
                  )}
                </Panel>
              </Collapse>
            </Col>
          </Row>
        </Card>

        {/* Reviews */}
        <Card className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 col-span-1 md:col-span-2 lg:col-span-3">
          <Title level={4} className="text-teal-600 mb-4 flex items-center">
            <FaStar className="mr-2" /> Reviews
          </Title>
          {freelancer.common?.reviews?.length > 0 ? (
            <Table columns={reviewColumns} dataSource={freelancer.common.reviews} rowKey="review_id" pagination={false} />
          ) : (
            <Empty description="No reviews available" />
          )}
        </Card>

        {/* Meta Information */}
        <Card className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <Title level={4} className="text-teal-600 mb-4 flex items-center">
            <FaInfoCircle className="mr-2" /> Meta Information
          </Title>
          <Space direction="vertical" className="w-full">
            <div>
              <Text type="secondary">Agreed to Terms</Text>
              <Paragraph>{freelancer.meta?.agreed_to_terms ? 'Yes' : 'No'}</Paragraph>
            </div>
            <div>
              <Text type="secondary">Portal Access</Text>
              <Paragraph>{freelancer.meta?.portal_access ? 'Yes' : 'No'}</Paragraph>
            </div>
            <div>
              <Text type="secondary">Created At</Text>
              <Paragraph>{freelancer.meta?.created_at ? new Date(freelancer.meta.created_at).toLocaleString() : '--'}</Paragraph>
            </div>
            <div>
              <Text type="secondary">Updated At</Text>
              <Paragraph>{freelancer.meta?.updated_at ? new Date(freelancer.meta.updated_at).toLocaleString() : '--'}</Paragraph>
            </div>
          </Space>
        </Card>

        {/* Change History */}
        <Card className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 col-span-1 md:col-span-2 lg:col-span-3">
          <Title level={4} className="text-teal-600 mb-4 flex items-center">
            <FaHistory className="mr-2" /> Change History
          </Title>
          {freelancer.meta?.change_history && freelancer.meta.change_history.length > 0 ? (
            <Table columns={historyColumns} dataSource={freelancer.meta.change_history} rowKey={(record, index) => index} pagination={false} />
          ) : (
            <Empty description="No change history available" />
          )}
        </Card>
      </div>

      {/* Image Viewer Modal */}
      <Modal
        open={imageViewerOpen}
        onCancel={closeImageModal}
        footer={null}
        centered
        width={600}
        bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
      >
        <Title level={4} className="text-teal-600">
          {documentTypes[selectedDocument?.type] || selectedDocument?.type || 'Certificate'}
        </Title>
        <div className="flex justify-center mb-4">
          <Image
            src={`http://localhost:5000/${selectedDocument?.path}`}
            alt={documentTypes[selectedDocument?.type]}
            className="max-h-96 object-contain"
            fallback={
              <div className="h-96 bg-gray-100 flex flex-col items-center justify-center">
                <FaFile size={32} className="text-gray-500" />
                <Text type="secondary">Unable to load document preview</Text>
                <Text type="secondary" className="text-sm mt-2">Please download the document to view it</Text>
              </div>
            }
          />
        </div>
        {(selectedDocument?.reason || selectedDocument?.suggestion) && (
          <Space direction="vertical" className="mb-4">
            {selectedDocument.reason && <Text type="danger">Reason: {selectedDocument.reason}</Text>}
            {selectedDocument.suggestion && <Text type="secondary">Suggestion: {selectedDocument.suggestion}</Text>}
          </Space>
        )}
        <Divider />
        <div className="flex justify-between items-center">
          <Tag color={selectedDocument?.verified ? 'green' : 'orange'}>
            {selectedDocument?.verified ? 'Verified' : 'Pending Verification'}
          </Tag>
          <Button icon={<ArrowDownOutlined />} type="primary" onClick={() => downloadDocument(selectedDocument?.path)}>
            Download
          </Button>
        </div>
      </Modal>

      {/* Verification Modal */}
      <Modal
        open={verificationModalOpen}
        onCancel={() => setVerificationModalOpen(false)}
        footer={null}
        centered
        width={600}
      >
        <Title level={4} className="text-teal-600 mb-4">
          {isApproving ? 'Approve Document' : 'Reject Document'}
        </Title>
        <Input
          placeholder={isApproving ? 'Optional' : 'Required'}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          status={!isApproving && !reason.trim() ? 'error' : ''}
          className="mb-4"
        />
        {!isApproving && !reason.trim() && <Text type="danger" className="mb-2">Reason is required for rejection</Text>}
        <TextArea
          placeholder="Optional"
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          rows={4}
          className="mb-4"
        />
        <div className="flex justify-end gap-2">
          <Button onClick={() => setVerificationModalOpen(false)}>Cancel</Button>
          <Button
            type="primary"
            danger={!isApproving}
            onClick={handleSubmitVerification}
            loading={verifyingDoc === selectedDocId}
          >
            {isApproving ? 'Approve' : 'Reject'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default FreelancerProfile;
import React, { useState, useContext, useEffect } from 'react';
import { Form, Input, Button, Card, Alert, Typography, Spin } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../manageApi/context/AuthContext.jsx';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const { Title, Link } = Typography;

const StyledContainer = styled.div`
  display: flex;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  padding: 2rem;
`;

const AdminLogin = () => {
  const [form] = Form.useForm();
  const [errors, setErrors] = useState({});
  const [attemptCount, setAttemptCount] = useState(0);
  const { user, token, loading, error: authError, login, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const roleCode = user?.role?.code;
      if (roleCode === '0') {
        toast.success('Login successful! Redirecting to superadmin dashboard...');
        navigate('/sawtar/cms/superadmin/dashboard');
      } else if (roleCode === '1') {
        toast.success('Login successful! Redirecting to admin dashboard...');
        navigate('/sawtar/cms/admin/dashboard');
      } else {
        setErrors({ general: 'Access denied: Admin privileges required' });
        logout();
      }
    }
  }, [isAuthenticated, user, navigate, logout]);

  const onFinish = async (values) => {
    setErrors({});

    if (attemptCount >= 5) {
      setErrors({ general: 'Too many attempts. Please try again later.' });
      return;
    }

    try {
      const response = await login(values.email, values.password, '/api/auth/login');
      if (!response.success) {
        setAttemptCount((prev) => prev + 1);
        const newErrors = {};
        if (response.errors && Array.isArray(response.errors)) {
          response.errors.forEach((error) => {
            newErrors[error.field || 'general'] = error.message;
          });
        } else {
          newErrors.general = response.message || 'Login failed';
        }
        setErrors(newErrors);
      } else {
        setAttemptCount(0);
        // Navigation handled by useEffect
      }
    } catch (err) {
      setAttemptCount((prev) => prev + 1);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    }
  };

  return (
    <StyledContainer>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ width: '100%', maxWidth: 400 }}
      >
        <Card
          style={{
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
          }}
        >
          <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>
            Admin Login
          </Title>

          {(errors.general || authError) && (
            <Alert
              message={errors.general || authError}
              type="error"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}

          <Form
            form={form}
            name="admin_login"
            onFinish={onFinish}
            layout="vertical"
            disabled={loading || attemptCount >= 5}
          >
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                placeholder="Enter your registered email address"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                placeholder="Enter your password"
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item>
              <Link href="/forgot-password" style={{ float: 'right' }}>
                Forgot Password?
              </Link>
            </Form.Item>
               <Form.Item>
          superadmin: <br />
          Email:Super1@gmail.com
                    password:Super1@gmail.com

            </Form.Item>
   


            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                disabled={attemptCount >= 5}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </motion.div>
    </StyledContainer>
  );
};

export default AdminLogin;
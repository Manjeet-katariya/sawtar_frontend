// components/login/AdminLogin.jsx
import React, { useState, useContext, useEffect, useRef } from 'react';
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

// === DYNAMIC DASHBOARD PATH ===
const getDashboardPath = (roleCode) => {
  const map = {
    '0': '/superadmin/',
    '1': '/admin/',
  };
  return `/sawtar/dashboard${map[roleCode] || ''}`;
};

const AdminLogin = () => {
  const [form] = Form.useForm();
  const [errors, setErrors] = useState({});
  const [attemptCount, setAttemptCount] = useState(0);
  const hasRedirected = useRef(false); // ← Prevent double navigation

  const { user, token, loading, error: authError, login, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // === REDIRECT AFTER SUCCESSFUL LOGIN (ONLY ONCE) ===
  useEffect(() => {
    if (isAuthenticated && user && token && !hasRedirected.current) {
      hasRedirected.current = true; // ← Mark as done

      const roleCode = user?.role?.code;
      const path = getDashboardPath(roleCode);

      if (roleCode === '0' || roleCode === '1') {
        toast.success(`Welcome ${roleCode === '0' ? 'SuperAdmin' : 'Admin'}!`);
        navigate(path, { replace: true });
      } else {
        setErrors({ general: 'Access denied: Admin privileges required' });
        logout();
        toast.error('Unauthorized access. Logging out...');
      }
    }
  }, [isAuthenticated, user, token, navigate, logout]);

  // === HANDLE FORM SUBMISSION ===
  const onFinish = async (values) => {
    setErrors({});
    hasRedirected.current = false; // Reset redirect flag on new attempt

    if (attemptCount >= 5) {
      setErrors({ general: 'Too many attempts. Please try again later.' });
      return;
    }

    try {
      const response = await login(values.email, values.password, '/api/auth/login');

      if (!response.success) {
        setAttemptCount(prev => prev + 1);
        const newErrors = {};

        if (response.errors?.length) {
          response.errors.forEach(err => {
            newErrors[err.field || 'general'] = err.message;
          });
        } else {
          newErrors.general = response.message || 'Login failed';
        }
        setErrors(newErrors);
      } else {
        setAttemptCount(0);
        // Navigation handled in useEffect
      }
    } catch (err) {
      setAttemptCount(prev => prev + 1);
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
            Admin Portal
          </Title>

          {/* === GENERAL ERROR ALERT === */}
          {(errors.general || authError) && (
            <Alert
              message={errors.general || authError}
              type="error"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}

          {/* === LOADING SPINNER === */}
          {loading && (
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Spin size="large" />
            </div>
          )}

          {/* === LOGIN FORM === */}
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
                placeholder="Enter your registered email"
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

            {/* === TEST CREDENTIALS (REMOVE IN PRODUCTION) === */}
            <Form.Item
              style={{
                backgroundColor: '#f9f9f9',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '12px',
                marginBottom: '16px',
              }}
            >
              <strong>SuperAdmin:</strong> <br />
              Email: <code>Super1@gmail.com</code><br />
              Pass: <code>Super1@gmail.com</code>
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
                {loading ? 'Logging in...' : 'Login as Admin'}
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Link href="/sawtar/login" underline="hover">
                ← Back to User Login
              </Link>
            </div>
          </Form>
        </Card>
      </motion.div>
    </StyledContainer>
  );
};

export default AdminLogin;
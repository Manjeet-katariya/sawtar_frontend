import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  IconButton, 
  Button, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Typography,
  Box,
  Paper
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  AutoAwesome as AutoAwesomeIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

const PremiumDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '20px',
    overflow: 'hidden',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '85vh',
    marginTop: '2vh',
    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fc 100%)',
    boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
    [theme.breakpoints.down('sm')]: {
      margin: '10px',
      maxHeight: '90vh'
    }
  },
}));

const ChatBubble = styled(motion.div)(({ theme, isAI }) => ({
  padding: '14px 18px',
  borderRadius: isAI ? '20px 20px 20px 6px' : '20px 20px 6px 20px',
  background: isAI 
    ? 'linear-gradient(145deg, #f0f2f5 0%, #e8eaef 100%)' 
    : theme.palette.primary.main,
  color: isAI ? '#2d3748' : '#ffffff',
  maxWidth: '75%',
  margin: '8px 12px',
  alignSelf: isAI ? 'flex-start' : 'flex-end',
  boxShadow: '0 3px 12px rgba(0,0,0,0.1)',
  fontSize: '15px',
  lineHeight: '1.5',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '85%',
    padding: '12px 16px'
  }
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: '24px',
  borderRadius: '16px',
  background: '#ffffff',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  margin: '12px',
  [theme.breakpoints.down('sm')]: {
    padding: '16px'
  }
}));

const OptionButton = styled(FormControlLabel)(({ theme }) => ({
  width: '100%',
  margin: '8px 0',
  padding: '12px 16px',
  borderRadius: '12px',
  background: '#f7fafc',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(79, 209, 197, 0.08)',
    transform: 'translateX(4px)'
  },
  '& .MuiRadio-root': {
    color: theme.palette.primary.main
  },
  '& .MuiTypography-root': {
    fontWeight: 500,
    color: '#2d3748',
    fontSize: '15px'
  }
}));

const AIRecommendationModal = ({ show, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  const questions = [
    {
      id: 'serviceType',
      question: "What type of service are you looking for?",
      type: 'select',
      options: [
        { value: 'web-development', label: 'Web Development' },
        { value: 'graphic-design', label: 'Graphic Design' },
        { value: 'digital-marketing', label: 'Digital Marketing' },
        { value: 'content-writing', label: 'Content Writing' },
        { value: 'video-editing', label: 'Video Editing' },
      ]
    },
    {
      id: 'budget',
      question: "What's your budget range for this project?",
      type: 'select',
      options: [
        { value: 'under-500', label: 'Under $500' },
        { value: '500-2000', label: '$500 - $2,000' },
        { value: '2000-5000', label: '$2,000 - $5,000' },
        { value: '5000-plus', label: '$5,000+' },
      ]
    },
    {
      id: 'timeline',
      question: "When do you need this project completed?",
      type: 'select',
      options: [
        { value: 'urgent', label: 'ASAP (within 1 week)' },
        { value: '1-2-weeks', label: '1-2 weeks' },
        { value: '2-4-weeks', label: '2-4 weeks' },
        { value: 'flexible', label: 'Flexible timeline' },
      ]
    }
  ];

  useEffect(() => {
    if (show) {
      setChatHistory([
        {
          id: 0,
          text: "Hello! I'm your AI Freelancer Assistant. Let's find the perfect match for your project. Ready to start?",
          isAI: true
        }
      ]);
    }
  }, [show]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatHistory]);

  const handleAnswer = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    
    const question = questions.find(q => q.id === questionId);
    const selectedOption = question.options.find(opt => opt.value === answer);
    
    setChatHistory(prev => [
      ...prev,
      {
        id: prev.length + 1,
        text: selectedOption.label,
        isAI: false
      }
    ]);

    if (currentStep < questions.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setChatHistory(prev => [
          ...prev,
          {
            id: prev.length + 1,
            text: questions[currentStep + 1].question,
            isAI: true
          }
        ]);
      }, 600);
    }
  };

  const generateFilters = () => {
    const filters = [];
    if (answers.serviceType) filters.push(`service=${answers.serviceType}`);
    if (answers.budget) filters.push(`budget=${answers.budget}`);
    if (answers.timeline) filters.push(`timeline=${answers.timeline}`);
    return filters.join('&');
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setChatHistory(prev => [
      ...prev,
      {
        id: prev.length + 1,
        text: "Awesome! I'm analyzing your preferences to find the best freelancers for your project...",
        isAI: true
      }
    ]);

setTimeout(() => {
  onClose();
  navigate(`/sawtar/freelancer/browse-category?${generateFilters()}`, {
    replace: true,
    state: { fromAI: true }
  });
  setCurrentStep(0);
  setAnswers({});
  setIsSubmitting(false);
}, 2000);

  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setChatHistory(prev => prev.slice(0, -2));
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <AnimatePresence>
      {show && (
        <PremiumDialog
          open={show}
          onClose={onClose}
          fullWidth
          maxWidth="sm"
          TransitionComponent={motion.div}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 100
          }}
        >
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #D26C44   0%, #8B3F2B  100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            padding: '16px 24px',
            position: 'relative'
          }}>
            <Avatar sx={{ bgcolor: 'white', mr: 2, width: 48, height: 48 }}>
              <AutoAwesomeIcon sx={{ color: '#1A132F', fontSize: 28 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              AI Freelancer Assistant
            </Typography>
            <IconButton
              edge="end"
    className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-lg shadow-sm"
              onClick={onClose}
              sx={{ 
                ml: 'auto', 
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.1)' 
                } 
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ 
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '600px',
            background: '#f8f9fc'
          }}>
            {/* Chat History Section */}
            <Box
              ref={chatContainerRef}
              sx={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#f8f9fc'
              }}
            >
              {chatHistory.map((message) => (
                <ChatBubble
                  key={message.id}
                  isAI={message.isAI}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  {message.text}
                </ChatBubble>
              ))}
              
              {isSubmitting && (
                <ChatBubble
                  isAI={true}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={24} sx={{ color: '#4fd1c5', mr: 2 }} />
                    <Typography>Finding the best matches...</Typography>
                  </Box>
                </ChatBubble>
              )}
            </Box>

            {/* Form Section */}
            {!isSubmitting && currentQuestion && (
              <FormContainer
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                elevation={0}
              >
                <Stepper 
                  activeStep={currentStep} 
                  alternativeLabel 
                  sx={{ 
                    mb: 3,
                    '& .MuiStepLabel-label': {
                      textTransform: 'capitalize',
                      fontWeight: 500,
                      color: '#2d3748',
                      fontSize: '14px'
                    },
                    '& .MuiStepLabel-active': {
                      color: '#4fd1c5'
                    }
                  }}
                >
                  {questions.map((question, index) => (
                    <Step key={index}>
                      <StepLabel>
                        {index === currentStep ? question.id.replace(/-/g, ' ') : ''}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <FormControl component="fieldset" fullWidth>
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom 
                    sx={{ 
                      color: '#2d3748', 
                      fontWeight: 600, 
                      mb: 2,
                      fontSize: '16px'
                    }}
                  >
                    {currentQuestion.question}
                  </Typography>
                  
                  <RadioGroup
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  >
                    {currentQuestion.options.map((option) => (
                      <OptionButton
                        key={option.value}
                        value={option.value}
                        control={<Radio color="primary" />}
                        label={option.label}
                        sx={{
                          '&.Mui-checked': {
                            backgroundColor: 'rgba(79, 209, 197, 0.1)'
                          }
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mt: 3,
                  pt: 2,
                  borderTop: '1px solid rgba(0,0,0,0.08)'
                }}>
                  <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    sx={{
                      color: '#718096',
                      '&:hover': { 
                        backgroundColor: 'rgba(113, 128, 150, 0.08)' 
                      },
                      '&:disabled': {
                        color: '#cbd5e0'
                      }
                    }}
                  >
                    Back
                  </Button>
                  
                  {currentStep === questions.length - 1 ? (
                    <Button
                      endIcon={<SendIcon />}
                      onClick={handleSubmit}
                      disabled={!answers[currentQuestion.id]}
                      variant="contained"
                      sx={{
                        backgroundColor: '#1A132F',
                        '&:hover': { 
                          backgroundColor: '#B55533' 
                        },
                        px: 4,
                        py: 1.2,
                        fontWeight: 600,
                        borderRadius: '12px',
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(79, 209, 197, 0.25)',
                        '&:disabled': {
                          backgroundColor: '#e2e8f0',
                          color: '#a0aec0'
                        }
                      }}
                    >
                      Find Matches
                    </Button>
                  ) : (
                    <Button
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => {
                        if (answers[currentQuestion.id]) {
                          handleAnswer(currentQuestion.id, answers[currentQuestion.id]);
                        }
                      }}
                      disabled={!answers[currentQuestion.id]}
                      variant="contained"
                      sx={{
                        backgroundColor: '#1A132F',
                        '&:hover': { 
                          backgroundColor: '#319795' 
                        },
                        px: 4,
                        py: 1.2,
                        fontWeight: 600,
                        borderRadius: '12px',
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(79, 209, 197, 0.25)',
                        '&:disabled': {
                          backgroundColor: '#e2e8f0',
                          color: '#a0aec0'
                        }
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </FormContainer>
            )}
          </DialogContent>
        </PremiumDialog>
      )}
    </AnimatePresence>
  );
};

export default AIRecommendationModal;
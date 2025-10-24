import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import CmsLayout from '../CMS/components/layout/CmsLayout';
import { cmsTheme } from '../CMS/theme/cmsTheme';
import CmsRoutes from '../CMS/routes';
import '../CMS/styles/cms-tailwind.css';

const CmsApp = () => {
  
  return (
    <ThemeProvider theme={cmsTheme}>
      <CssBaseline />
      <CmsLayout >
        <CmsRoutes />
      </CmsLayout>
    </ThemeProvider>
  );
};

export default CmsApp;
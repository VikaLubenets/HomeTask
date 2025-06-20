import { FileUploadSection } from '../../components/FileUploadsSection/FileUploadsSection';
import { HighlightsSection } from '../../components/HighlightsSection/HighlightsSection';
import Layout from '../Layout/Layout';

function AnaliticsPage() {
  return (
    <Layout>
        <FileUploadSection />
        <HighlightsSection />
    </Layout>
  );
}

export default AnaliticsPage;

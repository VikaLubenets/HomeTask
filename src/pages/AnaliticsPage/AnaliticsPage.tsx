import { FileUploadSection } from '../../components/FileUploadsSection/FileUploadsSection';
import { Header } from '../../components/Header/Header';
import { HighlightsSection } from '../../components/HighlightsSection/HighlightsSection';
import Layout from '../Layout/Layout';
import styles from './AnaliticsPage.module.css';

function AnaliticsPage() {
  return (
    <Layout>
      <Header />
      <div className={styles.wrapper}>
        <FileUploadSection />
        <HighlightsSection />
      </div>
    </Layout>
  );
}

export default AnaliticsPage;

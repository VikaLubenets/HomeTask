import styles from './GeneratorPage.module.css';
import { Header } from '../../components/Header/Header';
import Layout from '../Layout/Layout';
import { CsvGeneratorSection } from '../../components/CsvGeneratorSection/CsvGeneratorSection';

function GeneratorPage() {
  return (
    <Layout>
      <Header />
      <div className={styles.wrapper}>
        <CsvGeneratorSection />
      </div>
    </Layout>
  );
}

export default GeneratorPage;

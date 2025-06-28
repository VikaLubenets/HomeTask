import Layout from '../Layout/Layout';
import { CsvGeneratorSection } from '../../components/CsvGeneratorSection/CsvGeneratorSection';

function GeneratorPage() {
  return (
    <Layout data-testid="generator-page">
      <CsvGeneratorSection />
    </Layout>
  );
}

export default GeneratorPage;

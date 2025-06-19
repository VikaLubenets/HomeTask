import styles from './HistoryPage.module.css'
import { Header } from "../../components/Header/Header";
import Layout from "../Layout/Layout";
import { HistorySection } from '../../components/HistorySection/HistorySection';


function HistoryPage() {
  return (
    <Layout>
      <Header />
      <div className={styles.wrapper}>
        <HistorySection />
      </div>
    </Layout>
  );
}

export default HistoryPage;


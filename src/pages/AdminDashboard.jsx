import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardCards from "../components/DashboardCards";
import styles from "./AdminDashboard.module.css";
import Chart from "../Charts/ProductsCategoryChart";
import PaymentStatusChart from "../Charts/PaymentStatusChart";
import RevenueChart from "../Charts/RevenueChart";
import UserStatusChart from "../Charts/UserStatusChart";

export default function AdminDashboard() {
  return (
    <div className={styles.dashboard}>
      <Header />

      <div className={styles.body}>
        <Sidebar />

        <div className={styles.content}>
          <section className={styles.cardsSection}>
            <DashboardCards />
          </section>

          <section className={styles.fullWidthChart}>
            <RevenueChart />
          </section>

          <section className={styles.chartsGrid}>
            <div className={styles.chartBox}>
              <Chart />
            </div>
            <div className={styles.chartBox}>
              <PaymentStatusChart />
            </div>
            <div className={styles.chartBox}>
              <UserStatusChart />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

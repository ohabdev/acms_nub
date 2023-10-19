import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import FrontLayout from "@/components/layouts/FrontLayout";

const ServicesSearchList = dynamic(() =>
  import("@/components/lists/ServicesSearchList"),
);

const ServicesList = dynamic(() => import("@/components/lists/ServicesList"));

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const isClient = user?.role?.isClient;
  const isProvider = user?.role?.isProvider;

  return (
    <FrontLayout title="Dashboard">
      <div className="mx-auto h-full max-w-[1200px] p-4">
        {user && isClient && <ServicesSearchList />}
        {user && isProvider && <ServicesList />}
      </div>
    </FrontLayout>
  );
};

export default Dashboard;

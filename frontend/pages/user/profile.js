import dynamic from "next/dynamic";
import { Tabs } from "antd";
import FrontLayout from "@/components/layouts/FrontLayout";
import Spinner from "@/components/spinner/Spinner";
import useUser from "@/utils/hooks/useUser";

const SpinnerIcon = dynamic(() =>
  import("@/components/icons/Icons").then((module) => module.SpinnerIcon),
);

const ProfileInformationCard = dynamic(
  () => {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(import("@/components/user/ProfileInformationCard")),
        850,
      );
    });
  },
  {
    loading: () => (
      <Spinner
        backgroundClassName="bg-white"
        indicator={
          <SpinnerIcon height={36} width={36} className="text-primary" />
        }
      />
    ),
  },
);

const UpdateBasicInformationForm = dynamic(
  () => {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(import("@/components/forms/UpdateBasicInformation")),
        650,
      );
    });
  },
  { loading: () => <Spinner size="medium" /> },
);

const UpdateContactInformationForm = dynamic(
  () => {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(import("@/components/forms/UpdateContactInformation")),
        650,
      );
    });
  },
  { loading: () => <Spinner size="medium" /> },
);

const UpdateLocationInformationForm = dynamic(
  () => {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(import("@/components/forms/UpdateLocationInformation")),
        650,
      );
    });
  },
  { loading: () => <Spinner size="medium" /> },
);

const UpdateProviderDetailsInformationForm = dynamic(
  () => {
    return new Promise((resolve) => {
      setTimeout(
        () =>
          resolve(
            import("@/components/forms/UpdateProviderDetailsInformation"),
          ),
        650,
      );
    });
  },
  { loading: () => <Spinner size="medium" /> },
);

const generateTabsItems = (user) => {
  const isProvider = user?.role?.isProvider;

  return [
    {
      key: "general",
      label: "General",
      children: (
        <div className="relative min-h-[400px]">
          <UpdateBasicInformationForm />
        </div>
      ),
    },

    {
      key: "contact",
      label: "Contact",
      children: (
        <div className="relative min-h-[400px]">
          <UpdateContactInformationForm />
        </div>
      ),
    },

    {
      key: "location",
      label: "Location",
      children: (
        <div className="relative min-h-[400px]">
          <UpdateLocationInformationForm />
        </div>
      ),
    },

    ...(isProvider
      ? [
          {
            key: "details",
            label: "Details",
            children: (
              <div className="relative min-h-[400px]">
                <UpdateProviderDetailsInformationForm />
              </div>
            ),
          },
        ]
      : []),
  ];
};

const Profile = () => {
  const user = useUser();
  const items = generateTabsItems(user);

  return (
    <FrontLayout title="Lawyers2Go - Profile">
      <div className="mx-auto max-w-[1200px] p-4">
        <div className="fixed hidden sm:block sm:w-[200px] sm:max-w-[200px] md:w-[275px] md:max-w-[275px] lg:w-[275px] lg:max-w-[275px]">
          <div className="fixed hidden sm:block sm:w-[200px] sm:max-w-[200px] md:w-[275px] md:max-w-[275px] lg:w-[275px] lg:max-w-[275px]">
            <div className="flex min-h-[350px] max-w-full flex-col items-center rounded p-4 shadow ring-1 ring-gray-900/5">
              <ProfileInformationCard />
            </div>
          </div>
        </div>
        <div className="sm:ml-[215px] md:ml-[290px] lg:ml-[290px]">
          <div className="relative min-h-[calc(100vh-100px)]">
            <Tabs
              animated={{ inkBar: true, tabPane: true }}
              defaultActiveKey="general"
              items={items}
              onChange={() => {}}
            />
          </div>
        </div>
      </div>
    </FrontLayout>
  );
};

export default Profile;

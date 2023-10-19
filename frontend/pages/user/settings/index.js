import { useState } from "react";
import dynamic from "next/dynamic";
import FrontLayout from "@/components/layouts/FrontLayout";
import Button from "@/components/common/Button";

let ChangePasswordModal;
const Card = dynamic(() => import("@/components/card/Card"));
const EditIcon = dynamic(() =>
  import("@/components/icons/Icons").then((module) => module.EditIcon),
);

const Settings = () => {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const openChangePasswordModal = () => {
    ChangePasswordModal = dynamic(() =>
      import("@/components/modals/ChangePasswordModal"),
    );
    setShowChangePasswordModal(true);
  };

  return (
    <FrontLayout title="Settings">
      <div className="mx-auto max-w-[1200px] p-4">
        <Card title="Change Password">
          <Button
            variant="primary"
            className="mx-auto outline-none before:bg-black hover:before:bg-black/90"
            onClick={openChangePasswordModal}
          >
            <span className="mr-2">
              <EditIcon width={14} height={14} />
            </span>
            Change Password
          </Button>
        </Card>
      </div>

      {showChangePasswordModal && (
        <ChangePasswordModal
          title="Change Password"
          showChangePasswordModal={showChangePasswordModal}
          setShowChangePasswordModal={setShowChangePasswordModal}
        />
      )}
    </FrontLayout>
  );
};

export default Settings;

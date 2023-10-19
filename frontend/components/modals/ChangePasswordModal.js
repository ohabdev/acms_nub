import dynamic from "next/dynamic";
import ChangePasswordForm from "@/components/forms/ChangePassword";

const Modal = dynamic(() => import("antd").then((module) => module.Modal));
const ModalHeader = dynamic(() => import("@/components/common/ModalHeader"));

const ChangePasswordModal = ({
  title = "",
  showChangePasswordModal,
  setShowChangePasswordModal,
}) => {
  const closeModal = () => {
    setShowChangePasswordModal(false);
  };

  return (
    <>
      <Modal
        centered
        closable={false}
        title={<ModalHeader title={title} closeModal={closeModal} />}
        open={showChangePasswordModal}
        footer={null}
        destroyOnClose={true}
        width={450}
      >
        <ChangePasswordForm closeModal={closeModal} />
      </Modal>
    </>
  );
};
export default ChangePasswordModal;

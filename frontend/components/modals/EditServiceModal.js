import dynamic from "next/dynamic";
import EditServiceForm from "@/components/forms/EditService";

const Modal = dynamic(() => import("antd").then((module) => module.Modal));
const ModalHeader = dynamic(() => import("@/components/common/ModalHeader"));

const EditServiceModal = ({
  title = "",
  showEditServiceModal,
  setShowEditServiceModal,
  selectedService,
  fetchMyServices,
}) => {
  const closeModal = () => {
    setShowEditServiceModal(false);
  };

  return (
    <>
      <Modal
        centered
        closable={false}
        title={<ModalHeader title={title} closeModal={closeModal} />}
        open={showEditServiceModal}
        footer={null}
        destroyOnClose={true}
      >
        <EditServiceForm
          selectedService={selectedService}
          closeModal={closeModal}
          fetchMyServices={fetchMyServices}
        />
      </Modal>
    </>
  );
};

export default EditServiceModal;

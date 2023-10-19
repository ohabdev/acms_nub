import PropTypes from "prop-types";
import dynamic from "next/dynamic";
import AddNewServiceForm from "@/components/forms/AddNewService";

const Modal = dynamic(() => import("antd").then((module) => module.Modal));
const ModalHeader = dynamic(() => import("@/components/common/ModalHeader"));

const AddNewServiceModal = ({
  title = "",
  showAddNewServiceModal,
  setShowAddNewServiceModal,
  fetchMyServices,
}) => {
  const closeModal = () => {
    setShowAddNewServiceModal(false);
  };

  return (
    <>
      <Modal
        centered
        closable={false}
        title={<ModalHeader title={title} closeModal={closeModal} />}
        open={showAddNewServiceModal}
        footer={null}
        destroyOnClose={true}
      >
        <AddNewServiceForm
          closeModal={closeModal}
          fetchMyServices={fetchMyServices}
        />
      </Modal>
    </>
  );
};

AddNewServiceModal.propTypes = {
  fetchMyServices: PropTypes.func,
  showAddNewServiceModal: PropTypes.bool,
  setShowAddNewServiceModal: PropTypes.func,
  title: PropTypes.string,
};

export default AddNewServiceModal;

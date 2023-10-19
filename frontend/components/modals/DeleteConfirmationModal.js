import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { DELETE_CONFIRMATION_DESCRIPTION } from "@/constants/constants";

const Modal = dynamic(() => import("antd").then((module) => module.Modal));
const ModalHeader = dynamic(() => import("@/components/common/ModalHeader"));

const DeleteConfirmationModal = ({
  description = DELETE_CONFIRMATION_DESCRIPTION,
  isDeleting = false,
  onDeleteConfirm,
  showDeleteConfirmationModal,
  setShowDeleteConfirmationModal,
  title = "Delete",
}) => {
  const closeModal = () => {
    setShowDeleteConfirmationModal(false);
  };

  return (
    <>
      <Modal
        closable={false}
        confirmLoading={isDeleting}
        title={<ModalHeader title={title} closeModal={closeModal} />}
        open={showDeleteConfirmationModal}
        okButtonProps={{
          className: "bg-error hover:!bg-error/90",
        }}
        okText="Delete"
        cancelButtonProps={{
          className:
            "!border-secondary/75 !text-black/75 hover:!border-secondary hover:!text-black",
        }}
        destroyOnClose={true}
        width={500}
        onOk={() => {
          onDeleteConfirm();
        }}
        onCancel={closeModal}
      >
        <p className="my-4">{description}</p>
      </Modal>
    </>
  );
};

DeleteConfirmationModal.propTypes = {
  description: PropTypes.string,
  isDeleting: PropTypes.bool,
  onDeleteConfirm: PropTypes.func,
  showDeleteConfirmationModal: PropTypes.bool,
  setShowDeleteConfirmationModal: PropTypes.func,
  title: PropTypes.string,
};

export default DeleteConfirmationModal;

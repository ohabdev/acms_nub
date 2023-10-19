import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "antd";
import ServicesListItem from "@/components/list-items/ServicesListItem";
import Spinner from "@/components/spinner/Spinner";
import Empty from "@/components/empty/Empty";
import { PlusIcon } from "@/components/icons/Icons";
import useFeedback from "@/utils/hooks/useFeedback";
import { getMyServices, deleteService } from "@/services/users";
import { generateSuccessMessage } from "@/utils/helpers/utilityHelper";
import {
  FAILED_FETCH_ERROR_MESSAGE,
  FAILED_OPS_ERROR_MESSAGE,
} from "@/constants/constants";

const SpinnerIcon = dynamic(() =>
  import("@/components/icons/Icons").then((module) => module.SpinnerIcon),
);

const Pagination = dynamic(() =>
  import("antd").then((module) => module.Pagination),
);

const limit = 10;
let AddNewServiceModal, EditServiceModal, DeleteConfirmationModal;

const ServicesList = () => {
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showAddNewServiceModal, setShowAddNewServiceModal] = useState(false);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedService, setSelectedService] = useState({});

  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [servicesList, setServicesList] = useState([]);

  const [showEmptyResponseFeedback, setShowEmptyResponseFeedback] =
    useState(false);
  const [hasError, setHasError] = useState(false);
  const { showNotification } = useFeedback();

  const openAddNewServiceModal = () => {
    AddNewServiceModal = dynamic(() =>
      import("@/components/modals/AddNewServiceModal"),
    );
    setShowAddNewServiceModal(true);
  };

  const openEditServiceModal = () => {
    EditServiceModal = dynamic(() =>
      import("@/components/modals/EditServiceModal"),
    );
    setShowEditServiceModal(true);
  };

  const openDeleteConfirmationModal = () => {
    DeleteConfirmationModal = dynamic(() =>
      import("@/components/modals/DeleteConfirmationModal"),
    );
    setShowDeleteConfirmationModal(true);
  };

  const notifyError = useCallback(
    (error) => {
      showNotification({
        message: "Error",
        description: FAILED_FETCH_ERROR_MESSAGE || error?.message,
        type: "error",
      });
    },
    [showNotification],
  );

  const fetchMyServices = useCallback(
    async (page) => {
      setFetching(true);
      try {
        const response = await getMyServices(page - 1, limit);
        setServicesList(response.data?.rows);
        setTotal(response.data?.count);
        setShowEmptyResponseFeedback(() => {
          return response.data?.rows?.length === 0 ? true : false;
        });
        setLoading(false);
        setFetching(false);
        setHasError(false);
      } catch (error) {
        if (error && error?.code !== "ERR_CANCELED") {
          setHasError(true);
          notifyError(error);
          setLoading(false);
          setFetching(false);
        }
      }
    },
    [notifyError],
  );

  const deleteSpecificService = useCallback(async () => {
    try {
      setDeleting(true);
      await deleteService(selectedServiceId);
      fetchMyServices(1);
      showNotification({
        message: "Success",
        description: generateSuccessMessage("Service", "delete"),
        type: "success",
      });
    } catch (error) {
      showNotification({
        message: "Error",
        description: FAILED_OPS_ERROR_MESSAGE || error?.message,
        type: "error",
      });
    } finally {
      setDeleting(false);
      setShowDeleteConfirmationModal(false);
    }
  }, [fetchMyServices, selectedServiceId, showNotification]);

  useEffect(() => {
    fetchMyServices(currentPage);
  }, [fetchMyServices, currentPage]);

  return (
    <>
      <div className="mx-auto h-full">
        {/* <div className="mb-4 flex flex-row items-center justify-end">
          <Button
            type="primary"
            className="rounded-semi-sm border bg-black hover:!bg-black/90"
            onClick={openAddNewServiceModal}
          >
            <span className="!flex flex-row items-center justify-center gap-x-2 leading-normal text-white">
              <PlusIcon width={14} height={14} />
              <span> Add Service</span>
            </span>
          </Button>
        </div> */}

        <div className="relative min-h-[calc(100vh-125px)] pb-3">
          <div
            className={`${fetching ? "opacity-70" : ""} min-h-full [&>*]:mb-4`}
          >
            {(loading || (!servicesList?.length && fetching) || hasError) && (
              <Spinner
                indicator={
                  <SpinnerIcon
                    height={40}
                    width={40}
                    className="text-primary"
                  />
                }
              />
            )}

            {!loading && !fetching && showEmptyResponseFeedback && (
              <Empty
                className="h-[calc(100vh-160px)] bg-white shadow ring-1 ring-gray-900/5"
                title="No service present"
                subTitle={null}
              />
            )}

            {!!servicesList?.length &&
              servicesList?.map((service) => {
                return (
                  <ServicesListItem
                    key={service?.id}
                    loading={fetching}
                    service={service}
                    onDeleteButtonClick={openDeleteConfirmationModal}
                    onEditButtonClick={openEditServiceModal}
                    setSelectedServiceId={setSelectedServiceId}
                    setSelectedService={setSelectedService}
                  />
                );
              })}
          </div>

          {!loading && total > limit && (
            <div className="mb-3 flex justify-end bg-white p-3 shadow ring-1 ring-gray-900/5">
              <Pagination
                current={currentPage}
                defaultPageSize={limit}
                hideOnSinglePage={true}
                total={total}
                responsive={true}
                showSizeChanger={false}
                onChange={(page) => {
                  setCurrentPage(page);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {showAddNewServiceModal && (
        <AddNewServiceModal
          title="Add New Service"
          showAddNewServiceModal={showAddNewServiceModal}
          setShowAddNewServiceModal={setShowAddNewServiceModal}
          fetchMyServices={fetchMyServices}
        />
      )}

      {showEditServiceModal && (
        <EditServiceModal
          title="Edit Service"
          showEditServiceModal={showEditServiceModal}
          setShowEditServiceModal={setShowEditServiceModal}
          selectedService={selectedService}
          fetchMyServices={fetchMyServices}
        />
      )}

      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          title="Delete Service"
          isDeleting={deleting}
          onDeleteConfirm={deleteSpecificService}
          showDeleteConfirmationModal={showDeleteConfirmationModal}
          setShowDeleteConfirmationModal={setShowDeleteConfirmationModal}
        />
      )}
    </>
  );
};

export default ServicesList;

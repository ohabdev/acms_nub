import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import Button from "@/components/common/Button";
import Card from "@/components/card/Card";
import Truncate from "@/components/truncate/Truncate";
import {
  EditIcon,
  DeleteIcon,
  CheckCircleIcon,
} from "@/components/icons/Icons";
import {
  formatUSD,
  getAppearanceAvailabilityValue,
} from "@/utils/helpers/utilityHelper";
import { capitalizeFirstLetter } from "@/utils/helpers/transformationHelper";

const Skeleton = dynamic(() =>
  import("antd").then((module) => module.Skeleton),
);

const ServicesListItem = ({
  loading,
  service,
  onDeleteButtonClick,
  onEditButtonClick,
  setSelectedServiceId,
  setSelectedService,
}) => {
  const { availability, city, county, state, serviceName, price, status } =
    service || {};

  return (
    <Card bodyClassName="p-4">
      <Skeleton
        loading={loading}
        title={{ width: "100%" }}
        paragraph={{ width: "80%", rows: 1 }}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-row flex-wrap items-center justify-between gap-x-3 border-l-4 border-l-[#FB3F03] pl-3">
            <div>
              <h5 className="text-lg font-bold md:text-xl">
                <Truncate text={serviceName} />
              </h5>
            </div>

            <div className="flex flex-col items-center gap-y-1 text-sm">
              <span className="text-base font-semibold">{`${county?.name}, ${state?.name}`}</span>
              <span className="font-medium text-info">
                {getAppearanceAvailabilityValue(availability)}
              </span>
            </div>

            <div className="flex h-[70px] w-[70px] flex-col items-center justify-center rounded-full bg-[url('/ring.png')] bg-contain bg-no-repeat text-xs text-black/70">
              <span className="text-center font-bold">{formatUSD(price)}</span>
            </div>

            {status === "approved" && (
              <div className="flex flex-row items-center gap-x-1.5 leading-normal text-success">
                <span className="text-base">
                  <CheckCircleIcon height={32} width={32} />
                </span>
                <span className="font-semibold">
                  {capitalizeFirstLetter(status)}
                </span>
              </div>
            )}

            <div className="flex flex-row items-center gap-x-2">
              <Button
                title="Edit Service"
                variant="primary"
                size="small"
                className="mx-auto outline-none before:bg-black hover:before:bg-black/90"
                onClick={() => {
                  setSelectedService(service);
                  onEditButtonClick();
                }}
              >
                <EditIcon width={14} height={14} />
              </Button>
              <Button
                title="Delete Service"
                variant="primary"
                size="small"
                className="mx-auto outline-none before:bg-error hover:before:bg-error/90"
                onClick={() => {
                  setSelectedServiceId(service?.id);
                  onDeleteButtonClick();
                }}
              >
                <DeleteIcon />
              </Button>
            </div>
          </div>
        </div>
      </Skeleton>
    </Card>
  );
};

ServicesListItem.propTypes = {
  loading: PropTypes.bool,
  service: PropTypes.object,
  onDeleteButtonClick: PropTypes.func,
  onEditButtonClick: PropTypes.func,
  setSelectedServiceId: PropTypes.func,
  setSelectedService: PropTypes.func,
};

export default ServicesListItem;

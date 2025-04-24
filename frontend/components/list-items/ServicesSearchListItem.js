import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { Rate } from "antd";
import Button from "@/components/common/Button";
import Card from "@/components/card/Card";
import Truncate from "@/components/truncate/Truncate";
import { useMediaQuery } from "@/utils/hooks/useMediaQuery";
import { formatUSD } from "@/utils/helpers/utilityHelper";
import { calculateAverageRating } from "@/utils/helpers/utilityHelper";
import {createQuote} from "@/services/quote";

const CheckOutlined = dynamic(() => import("@ant-design/icons/CheckOutlined"));
const Skeleton = dynamic(() =>
  import("antd").then((module) => module.Skeleton),
);

const ServicesSearchListItem = ({ loading, service }) => {

  const matches = useMediaQuery("(min-width: 768px)");
  const [isPending, setIsPending] = useState(false);
  
  const handleHireMeClick = async () => {
    try {
      setIsPending(true);
      
      const qoutePayload = {
        serviceId: service.id,
        providerId: provider?.id,
        price: service.price || 0.00,
        serviceName: service.serviceName,
      };
      await createQuote(qoutePayload);

    } catch (err) {
      console.error("Error hiring service", err);
      setIsPending(false);
    } 
  };

  const { provider, city, county, state, serviceName, price } = service || {};
  const { yearsOfExperience, reviews } = provider || {};

  const avgRating = useMemo(
    () => calculateAverageRating(reviews, "rating"),
    [reviews],
  );

  return (
    <Card bodyClassName="p-4">
      <Skeleton
        loading={loading}
        title={{ width: "100%" }}
        paragraph={{ width: "80%" }}
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-row flex-wrap items-center justify-between gap-x-3 border-l-4 border-l-[#FB3F03] pl-3">
            {!!price && (
              <div>
                <h5 className="text-lg font-bold md:text-xl">
                  {formatUSD(price)}
                </h5>
              </div>
            )}
            <div className="flex flex-col items-center gap-y-1 text-sm">
              <span className="text-sm font-semibold">{`${county?.name}, ${state?.name}`}</span>
              <span className="font-medium text-info">
                <Truncate text={serviceName} />
              </span>
            </div>
            <div className="flex flex-col items-center gap-y-1 text-sm font-semibold">
              <span>
                <span className="text-sm lg:text-base">{reviews?.length}</span>{" "}
                Reviews
              </span>
              <span>
                <Rate
                  allowHalf
                  disabled
                  defaultValue={avgRating}
                  className={matches ? "text-[14px]" : "text-[12px]"}
                />
              </span>
            </div>
            <div className="flex h-[70px] w-[70px] flex-col items-center justify-center rounded-full bg-[url('/ring.png')] bg-contain bg-no-repeat text-xs text-black/70">
              <span className="text-center font-bold">
                {yearsOfExperience} Years
              </span>
              <span className="text-center font-bold">Exp.</span>
            </div>

            <div>
              {/* <Button
                variant="success"
                className="mx-auto outline-none before:bg-success hover:before:bg-black/90"
                size={matches ? "default" : "small"}
                onClick={() => {}}
              >
                Hire Me
              </Button> */}
              <Button
                variant="success"
                className="mx-auto outline-none before:bg-success hover:before:bg-black/90"
                size={matches ? "default" : "small"}
                onClick={handleHireMeClick}
                disabled={isPending}
              >
                {isPending ? "Pending..." : "Hire Me"}
              </Button>
            </div>
          </div>

          {reviews?.length > 1 && (
            <>
              <div className="clear-both my-1 flex border-b border-light"></div>
              <div className="flex flex-row flex-wrap items-center justify-between gap-x-3">
                <div>
                  <p className="font-semibold text-black">
                    <span className="italic">
                      &quot;{reviews[0]?.review}&quot; -{" "}
                    </span>
                    <span className="ml-1 text-xs font-semibold text-green-500">
                      <CheckOutlined className="mr-1" />
                      <span>Verified Client</span>
                    </span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </Skeleton>
    </Card>
  );
};

ServicesSearchListItem.propTypes = {
  loading: PropTypes.bool,
  service: PropTypes.object,
};

export default ServicesSearchListItem;

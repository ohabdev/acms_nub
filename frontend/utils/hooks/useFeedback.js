import { useCallback } from "react";
import dynamic from "next/dynamic";
import { App } from "antd";

const CheckOutlined = dynamic(() => import("@ant-design/icons/CheckOutlined"));
const WarningFilled = dynamic(() => import("@ant-design/icons/WarningFilled"));

const getClassName = (type) => {
  switch (type) {
    case "error":
      return "!bg-error";
    case "success":
      return "!bg-success";
    default:
      return "!bg-white";
  }
};

const useFeedback = () => {
  const { notification, message } = App.useApp();

  const showNotification = useCallback(
    (notificationObj) => {
      const { message, description, type, duration, placement } =
        notificationObj;
      const notificationClassName = `${getClassName(
        type,
      )} !rounded !w-[350px] tracking-wide`;

      notification.open({
        message: (
          <span className="mb-1 flex items-center gap-x-2 !font-bold !text-white">
            {type === "success" ? (
              <CheckOutlined />
            ) : type === "error" ? (
              <WarningFilled />
            ) : null}
            <span>{message}</span>
          </span>
        ),
        description: (
          <span className="!leading-3 !text-white">{description}</span>
        ),
        className: notificationClassName,
        duration: duration || 2,
        placement: placement || "bottomRight",
      });
    },
    [notification],
  );

  const clearNotification = useCallback(() => {
    notification.destroy();
  }, [notification]);

  const showMessage = useCallback(
    async (messageObj) => {
      const { content, type, duration } = messageObj;
      message.open({
        content: <span className="!font-semibold">{content}</span>,
        type,
        duration: duration || 1.5,
        ...(type === "success" && { icon: <CheckOutlined /> }),
      });
    },
    [message],
  );

  const clearMessage = useCallback(() => {
    message.destroy();
  }, [message]);

  return {
    showNotification,
    clearNotification,
    showMessage,
    clearMessage,
  };
};

export default useFeedback;

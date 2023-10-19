import { useState } from "react";
import dynamic from "next/dynamic";
import { Divider, theme } from "antd";

const CloseOutlined = dynamic(() => import("@ant-design/icons/lib/icons/CloseOutlined"));
const { useToken } = theme;

const ModalHeader = ({ title, closeModal }) => {
  const { token } = useToken();
  const [hovered, setHovered] = useState(false);

  const closeIconStyle = {
    color: hovered ? token.colorIconHover : token.colorIcon,
  };

  return (
    <>
      <div className="!text-blue flex items-center justify-between">
        <h3 className="text-xl font-bold">{title}</h3>
        <CloseOutlined
          onClick={closeModal}
          style={closeIconStyle}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />
      </div>
      <Divider className="my-2" />
    </>
  );
};

export default ModalHeader;

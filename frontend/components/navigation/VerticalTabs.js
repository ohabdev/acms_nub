import PropTypes from "prop-types";
import { Radio } from "antd";

const VerticalTabs = ({ activeKey, setActiveKey, items }) => {
  return (
    <div className="flex w-full flex-col">
      <Radio.Group
        value={activeKey}
        buttonStyle="solid"
        optionType="button"
        className="w-full"
        onChange={({ target: { value } }) => {
          setActiveKey(value);
        }}
      >
        {items?.map((item) => {
          return (
            <Radio.Button
              key={item?.key}
              value={item?.key}
              className="mb-2 w-full truncate rounded-semi-sm !rounded-e-semi-sm !rounded-s-semi-sm border border-secondary text-center"
            >
              {item?.label}
            </Radio.Button>
          );
        })}
      </Radio.Group>
    </div>
  );
};

VerticalTabs.propTypes = {
  activeKey: PropTypes.string,
  setActiveKey: PropTypes.func,
  items: PropTypes.array,
};

export default VerticalTabs;

import React, { useMemo, useRef } from "react";
import debounce from "lodash/debounce";
import { Spin } from "antd";
import SelectInput from "@/components/fields/SelectInput";

const DebouncedSelectInput = ({
  fetching,
  fetchOptions,
  canSearch,
  debounceTimeout = 800,
  options,
  setOptions,
  ...props
}) => {
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = async (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      if (value) {
        fetchOptions({ q: value });
      }
      if (fetchId !== fetchRef.current) {
        return;
      }
    };
    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout, setOptions]);

  return (
    <SelectInput
      canSearch={true}
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
};

export default DebouncedSelectInput;

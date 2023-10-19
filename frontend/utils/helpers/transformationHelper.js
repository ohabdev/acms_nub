export const arrayToObject = (array, value) => {
  return array?.reduce?.((acc, key) => {
    acc[key] = value;
    return acc;
  }, {});
};

export const generateOptions = (
  items,
  convertIdToString,
  sortOptions,
  extraProp,
) => {
  if (!Array.isArray(items) || !items.length) return [];

  if (sortOptions) {
    const options = items?.map((item) => {
      return {
        value: convertIdToString ? item?.id?.toString() : item?.id,
        label: item?.name,
        ...(extraProp && { [extraProp]: item?.[extraProp] }),
      };
    });

    return options?.sort((a, b) => a?.label?.localeCompare(b?.label));
  }

  return items?.map((item) => {
    return {
      value: convertIdToString ? item?.id?.toString() : item?.id,
      label: item?.name,
      ...(extraProp && { [extraProp]: item?.[extraProp] }),
    };
  });
};

export const filterOptions = (input, option) => {
  return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
};

export const formatQueryObjectToFilters = (query) => {
  return Object.entries(query).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      acc[key] = value.join(", ");
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};

export const capitalizeFirstLetter = (str) => {
  const value = str?.charAt(0)?.toUpperCase?.() + str?.slice?.(1);
  return value;
};

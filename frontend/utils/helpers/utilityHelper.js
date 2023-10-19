export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const isEmptyObject = (object) => {
  return (
    object && Object.keys(object).length === 0 && object.constructor === Object
  );
};

export const hasChanged = (previousObject, updatedObject) => {
  return Object.keys(updatedObject).filter(
    (key) => updatedObject[key] !== previousObject[key],
  );
};

export const hasCommon = (firstArray, secondArray) => {
  return firstArray.some((item) => secondArray.includes(item));
};

export const getAverage = (array, prop) => {
  const filteredArray = array?.map((item) => item[prop]);
  const average =
    filteredArray?.reduce((total, next) => total + next, 0) /
    filteredArray?.length;
  return average;
};

export const calculateAverageRating = (array, prop) => {
  const avg = getAverage(array, prop);
  const remainder = avg % 1;
  switch (true) {
    case remainder < 0.25:
      return Math.floor(avg);
    case remainder > 0.25 && remainder <= 0.5:
      return Math.floor(avg) + 0.5;
    case remainder > 0.5 && remainder <= 0.75:
      return Math.floor(avg) + 0.5;
    case remainder > 0.75:
      return Math.ceil(avg);
    default:
      return avg;
  }
};

export const getYearsOfPracticeValue = (value) => {
  switch (value) {
    case "1-10":
      return "1 to 10 years";
    case "11-20":
      return "11 to 20 years";
    case "21-30":
      return "21 to 30 years";
    case "30+":
      return "More than 30 years";
    default:
      return "N/A";
  }
};

export const getAppearanceAvailabilityValue = (value) => {
  switch (value) {
    case "in-person":
      return "In Person";
    case "remote-only":
      return "Remote Only";
    case "both":
      return "Both";
    default:
      return "N/A";
  }
};

export const getValidationMessage = (fieldTitle, type = "required", values) => {
  switch (type) {
    case "required":
      return `${fieldTitle} is a required field.`;
    case "invalid":
      return `Invalid ${fieldTitle}.`;
    case "min":
      return `${fieldTitle} must be at least ${values?.min} characters long.`;
    case "max":
      return `${fieldTitle} cannot be longer than ${values?.max} characters.`;
    case "passwordFormat":
      return `${fieldTitle} must contain at least one uppercase, one lowercase, one number and one special character.`;
    case "match":
      return `${fieldTitle} must match.`;
    case "nonEmpty":
      return `${fieldTitle} cannot be empty.`;
    case "noSpacesOnly":
      return `${fieldTitle} cannot contain spaces only.`;
    case "repetition":
      return `Repetition of a single digit isn't allowed.`;
    default:
      return "N/A";
  }
};

export const formatPhoneNumber = (phoneNumber) => {
  const areaCode = phoneNumber?.substring?.(0, 3);
  return `${areaCode}-${phoneNumber?.substring?.(
    3,
    6,
  )}-${phoneNumber?.substring?.(6)}`;
};

export const getOriginalPhoneNumber = (phoneNumber) => {
  const originalPhoneNumber = phoneNumber?.replaceAll?.("-", "");
  return originalPhoneNumber;
};

export const formatUSD = (value) => {
  const formattedString = value?.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    trailingZeroDisplay: "stripIfInteger",
  });
  const currencyString = formattedString || "-";
  return currencyString;
};

export const generateSuccessMessage = (value, type) => {
  switch (type) {
    case "create":
      return `${value} has been added successfully.`;
    case "update":
      return `${value} has been updated successfully.`;
    case "delete":
      return `${value} has been deleted successfully.`;
    default:
      return "-";
  }
};

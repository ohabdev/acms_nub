import { object, string } from "yup";
import regexOptions from "@/utils/options/regex";
import { getValidationMessage } from "@/utils/helpers/utilityHelper";

export const validationSchema = object().shape({
  phoneNumber: string()
    .required(getValidationMessage("Phone number"))
    .min(10, getValidationMessage("phone number", "invalid"))
    .max(10, getValidationMessage("phone number", "invalid"))
    .matches(
      regexOptions.patterns.phone,
      getValidationMessage("phone number", "invalid"),
    )
    .test(
      "repetition",
      getValidationMessage("Phone Number", "repetition"),
      (value) => {
        if (value !== undefined) {
          return !value.match(/^([0-9])\1+$/);
        }
        return true;
      },
    ),

  address: string()
    .required(getValidationMessage("Address"))
    .matches(
      regexOptions.patterns.space,
      getValidationMessage("Address", "noSpacesOnly"),
      {
        excludeEmptyString: true,
      },
    ),
});

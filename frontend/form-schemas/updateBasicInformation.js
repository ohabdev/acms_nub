import { object, string } from "yup";
import { getValidationMessage } from "@/utils/helpers/utilityHelper";
import regexOptions from "@/utils/options/regex";

export const validationSchema = object().shape({
  firstName: string()
    .required(getValidationMessage("First name"))
    .max(40, getValidationMessage("First name", "max", { max: 40 }))
    .matches(
      regexOptions.patterns.space,
      getValidationMessage("First name", "noSpacesOnly"),
      {
        excludeEmptyString: true,
      },
    ),

  lastName: string()
    .required(getValidationMessage("Last name"))
    .max(40, getValidationMessage("Last name", "max", { max: 40 }))
    .matches(
      regexOptions.patterns.space,
      getValidationMessage("Last name", "noSpacesOnly"),
      {
        excludeEmptyString: true,
      },
    ),

  email: string()
    .email(getValidationMessage("email", "invalid"))
    .required(getValidationMessage("Email")),
});

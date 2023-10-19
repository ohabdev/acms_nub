import * as Yup from "yup";
import { getValidationMessage } from "@/utils/helpers/utilityHelper";

export const validationSchema = Yup.object().shape({
  state: Yup.lazy((val) =>
    typeof val === "object" && val?.constructor === Object
      ? Yup.object().required(getValidationMessage("State"))
      : Yup.string().required(getValidationMessage("State")),
  ),

  county: Yup.lazy((val) =>
    typeof val === "object" && val?.constructor === Object
      ? Yup.object().required(getValidationMessage("County"))
      : Yup.string().required(getValidationMessage("County")),
  ),

  city: Yup.lazy((val) =>
    typeof val === "object" && val?.constructor === Object
      ? Yup.object().required(getValidationMessage("City"))
      : Yup.string().required(getValidationMessage("City")),
  ),

  zipCode: Yup.string().required(getValidationMessage("Zip Code")),
});

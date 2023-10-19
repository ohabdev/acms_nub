import * as Yup from "yup";
import { getValidationMessage } from "@/utils/helpers/utilityHelper";
import regexOptions from "@/utils/options/regex";

export const initialValues = {
  serviceName: "",
  availability: null,
  subServiceTypeId: null,
  stateId: null,
  countyId: null,
  cityId: null,
  price: null,
};

export const validationSchema = Yup.object().shape({
  serviceName: Yup.string()
    .required(getValidationMessage("Title"))
    .max(80, getValidationMessage("Title", "max", { max: 80 }))
    .matches(
      regexOptions.patterns.space,
      getValidationMessage("Title", "noSpacesOnly"),
      {
        excludeEmptyString: true,
      },
    ),
  availability: Yup.string().required(getValidationMessage("Availability")),
  subServiceTypeId: Yup.string().required(
    getValidationMessage("Practice area"),
  ),

  stateId: Yup.string().required(getValidationMessage("State")),
  countyId: Yup.string().required(getValidationMessage("County")),
  cityId: Yup.string().required(getValidationMessage("City")),

  price: Yup.number().required(getValidationMessage("Price")),
});

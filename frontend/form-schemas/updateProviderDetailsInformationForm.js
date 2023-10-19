import * as Yup from "yup";
import { getValidationMessage } from "@/utils/helpers/utilityHelper";

export const validationSchema = Yup.object().shape({
  yearsOfPractice: Yup.string().required(
    getValidationMessage("Years of practice"),
  ),

  practiceAreas: Yup.array()
    .of(Yup.number())
    .min(1, getValidationMessage("Practice areas"))
    .required(getValidationMessage("Practice areas")),

  state: Yup.number().required(getValidationMessage("Service state")),
  county: Yup.number().required(getValidationMessage("Service county")),
  serviceLocations: Yup.array()
    .of(Yup.number())
    .min(1, getValidationMessage("Service cities"))
    .required(getValidationMessage("Service cities")),

  stateBarNumber: Yup.string().when("isAttorney", {
    is: true,
    then: (schema) => schema.required(getValidationMessage("State bar number")),
    otherwise: (schema) => schema.notRequired(),
  }),

  appearanceAvailability: Yup.string().when("isAttorney", {
    is: true,
    then: (schema) =>
      schema.required(getValidationMessage("Appearance availibility")),
    otherwise: (schema) => schema.notRequired(),
  }),

  proofOfMalpracticeInsurance: Yup.string().when("isAttorney", {
    is: true,
    then: (schema) =>
      schema.required(getValidationMessage("Proof of malpractice insurance")),
    otherwise: (schema) => schema.notRequired(),
  }),

  proofOfParalegalCertification: Yup.string().when("isParalegal", {
    is: true,
    then: (schema) =>
      schema.required(getValidationMessage("Proof of paralegal certification")),
    otherwise: (schema) => schema.notRequired(),
  }),

  attorneyVerificationLetter: Yup.string().when("isParalegal", {
    is: true,
    then: (schema) =>
      schema.required(getValidationMessage("Attorney verification letter")),
    otherwise: (schema) => schema.notRequired(),
  }),

  proofOfCertification: Yup.string().when("isProcessServer", {
    is: true,
    then: (schema) =>
      schema.required(getValidationMessage("Proof of certification")),
    otherwise: (schema) => schema.notRequired(),
  }),

  proofOfBusinessLicense: Yup.string().when("isProcessServer", {
    is: true,
    then: (schema) =>
      schema.required(getValidationMessage("Proof of business license")),
    otherwise: (schema) => schema.notRequired(),
  }),

  termsOfAgreement: Yup.string().required(
    getValidationMessage("Terms of agreement"),
  ),
});

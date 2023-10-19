import * as Yup from "yup";
import regexOptions from "@/utils/options/regex";
import { PROVIDERS as providers } from "@/constants/constants";

export const validationSchema = Yup.object().shape({
  role: Yup.string(),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),

  phoneNumberOffice: Yup.string().when("role", {
    is: (val) => providers.includes(val),
    then: (schema) =>
      schema
        .required("Phone number (office) is required")
        .min(10, "Invalid phone number")
        .max(10, "Invalid phone number")
        .matches(regexOptions.patterns.phone, "Invalid phone number")
        .test(
          "phoneNumberOffice",
          "Repetition of a single digit isn't allowed",
          (value) => {
            if (value !== undefined) {
              return !value.match(/^([0-9])\1+$/);
            }
            return true;
          },
        ),
    otherwise: (schema) => schema.notRequired(),
  }),

  phoneNumberCell: Yup.string().when("role", {
    is: (val) => providers.includes(val),
    then: (schema) =>
      schema
        .required("Phone number (cell) is required")
        .min(10, "Invalid phone number")
        .max(10, "Invalid phone number")
        .matches(regexOptions.patterns.phone, "Invalid phone number")
        .test(
          "phoneNumberCell",
          "Repetition of a single digit isn't allowed",
          (value) => {
            if (value !== undefined) {
              return !value.match(/^([0-9])\1+$/);
            }
            return true;
          },
        ),
    otherwise: (schema) => schema.notRequired(),
  }),

  phone: Yup.string().when("role", {
    is: (val) => val === "client",
    then: (schema) =>
      schema
        .required("Phone number is required")
        .min(10, "Invalid phone number")
        .max(10, "Invalid phone number")
        .matches(regexOptions.patterns.phone, "Invalid phone number")
        .test(
          "phone",
          "Repetition of a single digit isn't allowed",
          (value) => {
            if (value !== undefined) {
              return !value.match(/^([0-9])\1+$/);
            }
            return true;
          },
        ),
    otherwise: (schema) => schema.notRequired(),
  }),

  officeAddress: Yup.string().when("role", {
    is: (val) => val === "attorney" || val === "paralegal",
    then: (schema) => schema.required("Office address is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  address: Yup.string().when("role", {
    is: (val) => val === "client",
    then: (schema) => schema.required("Address is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  stateBarNumber: Yup.string().when("role", {
    is: (val) => val === "attorney",
    then: (schema) => schema.required("State bar number is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  practiceAreas: Yup.array()
    .of(Yup.object())
    .when("role", {
      is: (val) => val === "attorney" || val === "paralegal",
      then: (schema) =>
        schema
          .min(1, "Practice areas is required")
          .required("Practice areas is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  yearsOfPractice: Yup.string().when("role", {
    is: (val) => providers.includes(val),
    then: (schema) => schema.required("Years of practice is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  state: Yup.object().required("State is required"),
  county: Yup.object().required("County is required"),
  city: Yup.object().required("City is required"),

  zipCode: Yup.string().when("role", {
    is: (val) => val === "client",
    then: (schema) => schema.required("Zip code is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  appearanceAvailability: Yup.string().when("role", {
    is: (val) => val === "attorney",
    then: (schema) => schema.required("Appearance availibility is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  proofOfMalpracticeInsurance: Yup.string().when("role", {
    is: (val) => val === "attorney",
    then: (schema) =>
      schema.required("Proof of malpractice insurance is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  scopeOfServicesProvided: Yup.array()
    .of(Yup.string())
    .when("role", {
      is: (val) => val === "paralegal" || val === "process_server",
      then: (schema) =>
        schema
          .min(1, "Scope of services is required")
          .required("Scope of services is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  proofOfParalegalCertification: Yup.string().when("role", {
    is: (val) => val === "paralegal",
    then: (schema) =>
      schema.required("Proof of paralegal certification is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  attorneyVerificationLetter: Yup.string().when("role", {
    is: (val) => val === "paralegal",
    then: (schema) =>
      schema.required("Attorney verification letter is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  proofOfCertification: Yup.string().when("role", {
    is: (val) => val === "process_server",
    then: (schema) => schema.required("Proof of certification is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  proofOfBusinessLicense: Yup.string().when("role", {
    is: (val) => val === "process_server",
    then: (schema) => schema.required("Proof of business license is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  termsOfAgreement: Yup.string().when("role", {
    is: (val) => providers.includes(val),
    then: (schema) => schema.required("Terms of agreement is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

import * as Yup from "yup";
import { getValidationMessage } from "@/utils/helpers/utilityHelper";
import regexOptions from "@/utils/options/regex";

export const initialValues = {
  userType: "client",
  providerType: null,
  email: "",
  password: "",
  confirmPassword: "",

  providerSlug: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  address: "",
  officeAddress: "",

  stateId: null,
  countyId: null,
  cityId: null,
  zipCode: "",

  yearsOfPractice: null,
  practiceAreas: [],
  serviceState: null,
  serviceCounty: null,
  serviceLocations: [],
  stateBarNumber: "",
  appearanceAvailability: null,

  proofOfMalpracticeInsurance: "",
  proofOfParalegalCertification: "",
  attorneyVerificationLetter: "",
  proofOfCertification: "",
  proofOfBusinessLicense: "",
  termsOfAgreement: "",
};

export const validationSchema = Yup.object().shape({
  userType: Yup.string().required(getValidationMessage("User type")),

  providerType: Yup.string().when("userType", {
    is: (val) => val === "provider",
    then: (schema) => schema.required(getValidationMessage("Provider type")),
    otherwise: (schema) => schema.notRequired(),
  }),

  email: Yup.string()
    .email(getValidationMessage("email", "invalid"))
    .required(getValidationMessage("Email")),

  password: Yup.string()
    .required(getValidationMessage("Password"))
    .min(8, getValidationMessage("Password", "min", { min: 8 }))
    .matches(
      regexOptions.patterns.password,
      getValidationMessage("password", "passwordFormat"),
    ),

  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password")],
      getValidationMessage("Password and confirm password", "match"),
    )
    .required(getValidationMessage("Confirm password ")),

  firstName: Yup.string()
    .required(getValidationMessage("First name"))
    .min(2, getValidationMessage("First name", "min", { min: 2 }))
    .max(80, getValidationMessage("First name", "max", { max: 80 }))
    .matches(
      regexOptions.patterns.space,
      getValidationMessage("First name", "noSpacesOnly"),
      {
        excludeEmptyString: true,
      },
    ),

  lastName: Yup.string()
    .required(getValidationMessage("Last name"))
    .min(2, getValidationMessage("Last name", "min", { min: 2 }))
    .max(80, getValidationMessage("Last name", "max", { max: 80 }))
    .matches(
      regexOptions.patterns.space,
      getValidationMessage("Last name", "noSpacesOnly"),
      {
        excludeEmptyString: true,
      },
    ),

  phoneNumber: Yup.string()
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

  address: Yup.string().when("userType", {
    is: (val) => val === "client",
    then: (schema) => schema.required(getValidationMessage("Address")),
    otherwise: (schema) => schema.notRequired(),
  }),

  stateId: Yup.string().required(getValidationMessage("State")),
  countyId: Yup.string().required(getValidationMessage("County")),
  cityId: Yup.string().required(getValidationMessage("City")),
  zipCode: Yup.string().required(getValidationMessage("Zip Code")),

  yearsOfPractice: Yup.string().when("userType", {
    is: (val) => val === "provider",
    then: (schema) =>
      schema.required(getValidationMessage("Years of practice")),
    otherwise: (schema) => schema.notRequired(),
  }),

  practiceAreas: Yup.array()
    .of(Yup.number())
    .when("userType", {
      is: (val) => val === "provider",
      then: (schema) =>
        schema
          .min(1, getValidationMessage("Practice areas"))
          .required(getValidationMessage("Practice areas")),
      otherwise: (schema) => schema.notRequired(),
    }),

  serviceState: Yup.string().when("userType", {
    is: (val) => val === "provider",
    then: (schema) => schema.required(getValidationMessage("Service state")),
    otherwise: (schema) => schema.notRequired(),
  }),

  serviceCounty: Yup.string().when("userType", {
    is: (val) => val === "provider",
    then: (schema) => schema.required(getValidationMessage("Service county")),
    otherwise: (schema) => schema.notRequired(),
  }),

  serviceLocations: Yup.array()
    .of(Yup.number())
    .when("userType", {
      is: (val) => val === "provider",
      then: (schema) =>
        schema
          .min(1, getValidationMessage("Service cities"))
          .required(getValidationMessage("Service cities")),
      otherwise: (schema) => schema.notRequired(),
    }),

  stateBarNumber: Yup.string().when(["userType", "providerSlug"], {
    is: (userType, providerSlug) => {
      return userType === "provider" && providerSlug === "attorney";
    },
    then: (schema) => schema.required(getValidationMessage("State bar number")),
    otherwise: (schema) => schema.notRequired(),
  }),

  appearanceAvailability: Yup.string().when(["userType", "providerSlug"], {
    is: (userType, providerSlug) => {
      return userType === "provider" && providerSlug === "attorney";
    },
    then: (schema) =>
      schema.required(getValidationMessage("Appearance availibility")),
    otherwise: (schema) => schema.notRequired(),
  }),

  proofOfMalpracticeInsurance: Yup.string().when(["userType", "providerSlug"], {
    is: (userType, providerSlug) => {
      return userType === "provider" && providerSlug === "attorney";
    },
    then: (schema) =>
      schema.required(getValidationMessage("Proof of malpractice insurance")),
    otherwise: (schema) => schema.notRequired(),
  }),

  proofOfParalegalCertification: Yup.string().when(
    ["userType", "providerSlug"],
    {
      is: (userType, providerSlug) => {
        return userType === "provider" && providerSlug === "paralegal";
      },
      then: (schema) =>
        schema.required(
          getValidationMessage("Proof of paralegal certification"),
        ),
      otherwise: (schema) => schema.notRequired(),
    },
  ),

  attorneyVerificationLetter: Yup.string().when(["userType", "providerSlug"], {
    is: (userType, providerSlug) => {
      return userType === "provider" && providerSlug === "paralegal";
    },
    then: (schema) =>
      schema.required(getValidationMessage("Attorney verification letter")),
    otherwise: (schema) => schema.notRequired(),
  }),

  proofOfCertification: Yup.string().when(["userType", "providerSlug"], {
    is: (userType, providerSlug) => {
      return userType === "provider" && providerSlug === "processServer";
    },
    then: (schema) =>
      schema.required(getValidationMessage("Proof of certification")),
    otherwise: (schema) => schema.notRequired(),
  }),

  proofOfBusinessLicense: Yup.string().when(["userType", "providerSlug"], {
    is: (userType, providerSlug) => {
      return userType === "provider" && providerSlug === "processServer";
    },
    then: (schema) =>
      schema.required(getValidationMessage("Proof of business license")),
    otherwise: (schema) => schema.notRequired(),
  }),

  termsOfAgreement: Yup.string().when("userType", {
    is: (val) => val === "provider",
    then: (schema) =>
      schema.required(getValidationMessage("Terms of agreement")),
    otherwise: (schema) => schema.notRequired(),
  }),
});

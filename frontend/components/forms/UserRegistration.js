import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import getConfig from "next/config";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Form, Radio } from "antd";
import { Formik, useFormikContext } from "formik";
import { useTransition } from "react-transition-state";
import TextInput from "@/components/fields/TextInput";
import SelectInput from "@/components/fields/SelectInput";
import PhoneNumberInput from "@/components/fields/PhoneNumberInput";
import AddressAutofillInput from "@/components/fields/AddressAutofillInput";
import FileUploadInput from "@/components/fields/FileUploadInput";
import { NextIcon, PreviousIcon } from "@/components/icons/Icons";
import useFeedback from "@/utils/hooks/useFeedback";
import useShowUnsavedChangeWarning from "@/utils/hooks/useShowUnsavedChangeWarning";
import {
  initialValues,
  validationSchema,
} from "@/form-schemas/userRegistration";
import {
  getAllServiceTypes,
  getAllSubServiceTypes,
  getAllCountries,
  getAllStates,
  getAllCounties,
  getAllCities,
} from "@/services/utils";
import {
  arrayToObject,
  generateOptions,
} from "@/utils/helpers/transformationHelper";
import { hasCommon, formatPhoneNumber } from "@/utils/helpers/utilityHelper";
import {
  FAILED_FETCH_ERROR_MESSAGE,
  YEARS_OF_PRACTICE,
  APPEARANCE_AVAILABILITY,
} from "@/constants/constants";

const Alert = dynamic(() => import("@/components/alert/Alert"));

const providerSpecificFields = [
  "providerType",
  "yearsOfPractice",
  "practiceAreas",
  "serviceState",
  "serviceCounty",
  "serviceLocaions",
  "stateBarNumber",
  "appearanceAvailability",
  "proofOfMalpracticeInsurance",
  "proofOfParalegalCertification",
  "attorneyVerificationLetter",
  "proofOfCertification",
  "proofOfBusinessLicense",
  "termsOfAgreement",
];

const { publicRuntimeConfig } = getConfig();
const { baseApiUrl } = publicRuntimeConfig;
const fileType = "application/pdf";
const fileUploadUrl = `${baseApiUrl}/upload/file`;

const FormPageOne = ({ handleFieldValueChange }) => {
  return (
    <>
      <TextInput
        label="Email"
        name="email"
        placeholder="Enter Email Address"
        postFieldValueChange={handleFieldValueChange}
      />

      <TextInput
        label="Password"
        name="password"
        placeholder="Enter Password"
        inputType="password"
        postFieldValueChange={handleFieldValueChange}
      />

      <TextInput
        label="Confirm Password"
        name="confirmPassword"
        placeholder="Enter Confirm Password"
        inputType="password"
        postFieldValueChange={handleFieldValueChange}
      />
    </>
  );
};

const FormPageTwo = ({
  handleFieldValueChange,
  providerOptions,
  setFormValues,
}) => {
  const { values, errors, touched, setFieldValue } = useFormikContext();
  const [{ status, isMounted }, toggle] = useTransition({
    timeout: {
      enter: 350,
      exit: 1000,
    },
    initialEntered: true,
    preEnter: true,
    unmountOnExit: true,
  });

  return (
    <>
      <Form.Item
        label="Register As"
        className="mb-2"
        validateStatus={errors.userType && touched.userType ? "error" : ""}
        help={errors.userType && touched.userType ? errors.userType : ""}
      >
        <Radio.Group
          name="userType"
          value={values.userType}
          buttonStyle="solid"
          optionType="button"
          className="w-full"
          onChange={async ({ target: { value } }) => {
            await setFieldValue("userType", value);
            handleFieldValueChange("userType", value);

            if (value === "provider") toggle(true);
            else toggle(false);
          }}
        >
          <Radio.Button value="client" className="w-1/2 text-center">
            Client
          </Radio.Button>
          <Radio.Button value="provider" className="w-1/2 text-center">
            Provider
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      {isMounted && (
        <div
          className={`duration-350 transition ${
            status === "preEnter" || status === "exiting"
              ? " scale-50 transform opacity-0"
              : ""
          }`}
        >
          {values?.userType === "provider" && SelectInput && (
            <SelectInput
              label="Provider Type"
              name="providerType"
              placeholder="Select Provider Type"
              options={providerOptions}
              postFieldValueChange={handleFieldValueChange}
              onSelect={async (value) => {
                const providerSlug = providerOptions.find(
                  (provider) => provider?.value === value,
                )?.slug;

                setTimeout(() => {
                  setFormValues((previousFormValues) => {
                    return {
                      ...previousFormValues,
                      providerSlug,
                    };
                  });
                });
                await setFieldValue("providerSlug", providerSlug);
              }}
            />
          )}
        </div>
      )}
    </>
  );
};

const FormPageThree = ({ handleFieldValueChange }) => {
  const { values } = useFormikContext();

  return (
    <div className="grid grid-cols-1 gap-x-3">
      <TextInput
        label="First Name"
        name="firstName"
        placeholder="Enter First Name"
        postFieldValueChange={handleFieldValueChange}
      />

      <TextInput
        label="Last Name"
        name="lastName"
        placeholder="Enter Last Name"
        postFieldValueChange={handleFieldValueChange}
      />

      <PhoneNumberInput
        label="Phone Number"
        name="phoneNumber"
        placeholder="Enter Phone Number"
        postFieldValueChange={handleFieldValueChange}
      />

      {values?.userType === "client" && (
        <AddressAutofillInput
          label="Address"
          name="address"
          placeholder="Enter Address"
          postFieldValueChange={handleFieldValueChange}
        />
      )}
    </div>
  );
};

const FormPageFour = ({
  states,
  counties,
  cities,
  countiesLoading,
  citiesLoading,
  setCities,
  fetchCounties,
  fetchCities,
  handleFieldValueChange,
  setFormValues,
}) => {
  const { setFieldValue } = useFormikContext();

  return (
    <>
      <SelectInput
        label="Select your division"
        name="stateId"
        placeholder="Select division"
        options={states}
        filterable
        postFieldValueChange={handleFieldValueChange}
        onSelect={async (value) => {
          setTimeout(() => {
            setFormValues((previousFormValues) => {
              return {
                ...previousFormValues,
                countyId: null,
                cityId: null,
              };
            });
          });
          await setFieldValue("countyId", null);
          await setFieldValue("cityId", null);
          setCities([]);
          fetchCounties({ stateId: value });
        }}
      />

      <SelectInput
        className={countiesLoading ? "pointer-events-none opacity-50" : ""}
        label="Select your district"
        name="countyId"
        placeholder="Select district"
        options={counties}
        filterable
        postFieldValueChange={handleFieldValueChange}
        onSelect={async (value) => {
          await setFieldValue("cityId", null);
          fetchCities({ countyId: value });
        }}
      />

      <SelectInput
        className={citiesLoading ? "pointer-events-none opacity-50" : ""}
        label="Select your upazila"
        name="cityId"
        placeholder="Select upazila"
        options={cities}
        filterable
        postFieldValueChange={handleFieldValueChange}
      />

      <TextInput
        label="Post Code"
        name="zipCode"
        placeholder="Enter Zip Code"
        postFieldValueChange={handleFieldValueChange}
      />
    </>
  );
};

const FormPageFive = ({
  handleFieldValueChange,
  subServiceTypesList,
  serviceStates,
  serviceCounties,
  serviceCities,
  serviceCountiesLoading,
  serviceCitiesLoading,
  fetchServiceCounties,
  fetchServiceCities,
  setServiceCities,
}) => {
  const { values, setFieldValue } = useFormikContext();

  return (
    <>
      <SelectInput
        label="Years of Practice"
        name="yearsOfPractice"
        placeholder="Select Years of Practice"
        options={YEARS_OF_PRACTICE}
        postFieldValueChange={handleFieldValueChange}
      />

      <SelectInput
        label="Practice Areas"
        name="practiceAreas"
        placeholder="Select Practice Areas"
        multiSelect
        filterable
        options={subServiceTypesList}
      />

      <SelectInput
        // className={statesLoading ? "pointer-events-none" : ""}
        label="Select your Service division"
        name="serviceState"
        placeholder="Select Service district"
        options={serviceStates}
        filterable
        onSelect={async (value) => {
          await setFieldValue("seviceCounty", null);
          await setFieldValue("serviceLocations", []);
          setServiceCities([]);
          fetchServiceCounties({ stateId: value });
        }}
      />

      <SelectInput
        className={serviceCountiesLoading ? "pointer-events-none" : ""}
        label="Service district"
        name="serviceCounty"
        placeholder="Select Service district"
        options={serviceCounties}
        filterable
        onSelect={async (value) => {
          await setFieldValue("serviceLocations", []);
          fetchServiceCities({ countyId: value });
        }}
      />

      <SelectInput
        className={serviceCitiesLoading ? "pointer-events-none" : ""}
        label="Service upazilla"
        name="serviceLocations"
        placeholder="Select Service upazilla"
        options={serviceCities}
        multiSelect
        filterable
      />

      {values?.providerSlug === "attorney" && (
        <>
          <TextInput
            label="Bar code number"
            name="stateBarNumber"
            placeholder="Enter Bar code number"
            postFieldValueChange={handleFieldValueChange}
          />

          <SelectInput
            label="Availibility"
            name="appearanceAvailability"
            placeholder="Select Availibility"
            options={APPEARANCE_AVAILABILITY}
            postFieldValueChange={handleFieldValueChange}
          />
        </>
      )}
    </>
  );
};

const FormPageSix = ({ handleFieldValueChange }) => {
  const { values } = useFormikContext();

  return (
    <>
      {values?.providerSlug === "attorney" && (
        <FileUploadInput
          accept={fileType}
          action={fileUploadUrl}
          label="Attorney license"
          name="proofOfMalpracticeInsurance"
          placeholder=" Choose PDF File"
          postFieldValueChange={handleFieldValueChange}
        />
      )}

      {values?.providerSlug === "paralegal" && (
        <>
          <FileUploadInput
            accept={fileType}
            action={fileUploadUrl}
            label="Proof of Paralegal Certification"
            name="proofOfParalegalCertification"
            placeholder=" Choose PDF File"
            postFieldValueChange={handleFieldValueChange}
          />

          <FileUploadInput
            accept={fileType}
            action={fileUploadUrl}
            label="Attorney Verification Letter"
            name="attorneyVerificationLetter"
            placeholder=" Choose PDF File"
            postFieldValueChange={handleFieldValueChange}
          />
        </>
      )}

      {values?.providerSlug === "processServer" && (
        <>
          <FileUploadInput
            accept={fileType}
            action={fileUploadUrl}
            label="Proof of Certification"
            name="proofOfCertification"
            placeholder=" Choose PDF File"
            postFieldValueChange={handleFieldValueChange}
          />

          <FileUploadInput
            accept={fileType}
            action={fileUploadUrl}
            label="Proof of Business License"
            name="proofOfBusinessLicense"
            placeholder=" Choose PDF File"
            postFieldValueChange={handleFieldValueChange}
          />
        </>
      )}

      {values.userType !== "client" && (
        <FileUploadInput
          accept={fileType}
          action={fileUploadUrl}
          label="Others documents"
          name="termsOfAgreement"
          placeholder=" Choose PDF File"
          postFieldValueChange={handleFieldValueChange}
        />
      )}
    </>
  );
};

const UserRegistrationForm = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [formValues, setFormValues] = useState(initialValues);
  const [currentFormPage, setCurrentFormPage] = useState(0);
  const [error, setError] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const isFormDirty = useRef(false);

  const [serviceTypesLoading, setServiceTypesLoading] = useState(true);
  const [providerOptions, setProviderOptions] = useState([]);
  const [subServiceTypesList, setSubServiceTypesList] = useState([]);
  const [subServiceTypesLoading, setSubServiceTypesLoading] = useState(true);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [counties, setCounties] = useState([]);
  const [cities, setCities] = useState([]);
  const [statesLoading, setStatesLoading] = useState(true);
  const [countiesLoading, setCountiesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const [serviceStates, setServiceStates] = useState([]);
  const [serviceCounties, setServiceCounties] = useState([]);
  const [serviceCities, setServiceCities] = useState([]);
  const [serviceStatesLoading, setServiceStatesLoading] = useState(true);
  const [serviceCountiesLoading, setServiceCountiesLoading] = useState(false);
  const [serviceCitiesLoading, setServiceCitiesLoading] = useState(false);

  const { showNotification } = useFeedback();

  useShowUnsavedChangeWarning(isFormDirty);

  const notifyError = useCallback(
    (error) => {
      showNotification({
        message: "Error",
        description: FAILED_FETCH_ERROR_MESSAGE || error?.message,
        type: "error",
      });
    },
    [showNotification],
  );

  const fetchAllServiceTypes = useCallback(async () => {
    try {
      const response = await getAllServiceTypes({ page: 0, limit: 20 });
      setProviderOptions(
        generateOptions(response?.data?.rows, false, true, "slug"),
      );
    } catch (error) {
      notifyError(error);
    } finally {
      setServiceTypesLoading(false);
    }
  }, [notifyError]);

  const fetchAllSubServiceTypes = useCallback(async () => {
    try {
      const response = await getAllSubServiceTypes({
        page: 0,
        limit: 50,
        // parentId: serviceTypeId,
      });

      setSubServiceTypesList(
        generateOptions(response?.data?.rows, false, true),
      );
    } catch (error) {
      notifyError(FAILED_FETCH_ERROR_MESSAGE);
    } finally {
      setSubServiceTypesLoading(false);
    }
  }, [notifyError]);

  const fetchCountries = useCallback(async () => {
    try {
      const response = await getAllCountries({ page: 0, limit: 10 });
      setCountries(response?.data?.rows);
    } catch (error) {
      notifyError(error);
    }
  }, [notifyError]);

  const fetchStates = useCallback(async () => {
    try {
      const response = await getAllStates({ page: 0, limit: 55 });
      setStates(generateOptions(response?.data?.rows, false, true));
    } catch (error) {
      notifyError(error);
    } finally {
      setStatesLoading(false);
    }
  }, [notifyError]);

  const fetchCounties = useCallback(
    async (params) => {
      try {
        setCountiesLoading(true);
        const response = await getAllCounties({
          page: 0,
          limit: 500,
          ...params,
        });
        setCounties(generateOptions(response?.data?.rows, false, true));
      } catch (error) {
        notifyError(error);
      } finally {
        setCountiesLoading(false);
      }
    },
    [notifyError],
  );

  const fetchCities = useCallback(
    async (params) => {
      try {
        setCitiesLoading(true);
        const response = await getAllCities({ page: 0, limit: 500, ...params });
        setCities(generateOptions(response?.data?.rows, false, true));
      } catch (error) {
        notifyError(error);
      } finally {
        setCitiesLoading(false);
      }
    },
    [notifyError],
  );

  const fetchServiceStates = useCallback(async () => {
    try {
      const response = await getAllStates({ page: 0, limit: 55 });
      setServiceStates(generateOptions(response?.data?.rows, false, true));
    } catch (error) {
      notifyError(error);
    } finally {
      setServiceStatesLoading(false);
    }
  }, [notifyError]);

  const fetchServiceCounties = useCallback(
    async (params) => {
      try {
        setServiceCountiesLoading(true);
        const response = await getAllCounties({
          page: 0,
          limit: 500,
          ...params,
        });
        setServiceCounties(generateOptions(response?.data?.rows, false, true));
      } catch (error) {
        notifyError(error);
      } finally {
        setServiceCountiesLoading(false);
      }
    },
    [notifyError],
  );

  const fetchServiceCities = useCallback(
    async (params) => {
      try {
        setServiceCitiesLoading(true);
        const response = await getAllCities({ page: 0, limit: 500, ...params });
        setServiceCities(generateOptions(response?.data?.rows, false, true));
      } catch (error) {
        notifyError(error);
      } finally {
        setServiceCitiesLoading(false);
      }
    },
    [notifyError],
  );

  useEffect(() => {
    fetchAllServiceTypes();
    fetchStates();
    fetchAllSubServiceTypes();
    fetchCountries();
    fetchServiceStates();
  }, [
    fetchAllServiceTypes,
    fetchStates,
    fetchAllSubServiceTypes,
    fetchCountries,
    fetchServiceStates,
  ]);

  const handleFieldValueChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleRegistration = async (values, setSubmitting) => {
    setError({});

    const register = await import("@/services/auth").then(
      (module) => module.register,
    );

    const updateUserType = await import("@/services/users").then(
      (module) => module.updateUserType,
    );

    const updateProviderType = await import("@/services/users").then(
      (module) => module.updateProviderType,
    );

    const {
      userType,
      providerType,
      email,
      password,

      providerSlug,
      firstName,
      lastName,
      phoneNumber,
      address,

      stateId,
      countyId,
      cityId,
      zipCode,

      yearsOfPractice,
      practiceAreas,
      serviceLocations,
      stateBarNumber,
      appearanceAvailability,

      proofOfMalpracticeInsurance,
      proofOfParalegalCertification,
      attorneyVerificationLetter,
      proofOfCertification,
      proofOfBusinessLicense,
      termsOfAgreement,
    } = values;

    const isProvider = userType === "provider";
    const isClient = userType === "client";

    const updateProfile = await import("@/services/users").then((module) => {
      return isProvider
        ? module.updateProviderProfile
        : module.updateClientProfile;
    });

    let payload = { email, password };

    try {
      const response = await register(payload);
      const token = response?.data?.token;

      const updateUserTypePayload = {
        ...(isProvider && { isProvider, isClient: !isProvider }),
        ...(isClient && { isClient, isProvider: !isClient }),
      };

      await updateUserType(updateUserTypePayload, token);

      if (providerType && userType !== "client")
        await updateProviderType(
          { serviceTypeIds: [parseInt(providerType)] },
          token,
        );

      const updateProfilePayload = {
        firstName,
        lastName,
        phoneNumber: formatPhoneNumber(phoneNumber),
        stateId,
        countyId,
        cityId,
        zipCode,

        ...(isClient && {
          address,
        }),

        ...(isProvider && {
          countryId: countries?.[0]?.id,
          yearsOfPractice,
          practiceAreas,
          serviceLocations,
        }),

        ...(providerSlug === "attorney" && {
          stateBarNumber,
          appearanceAvailability,
          proofOfMalpracticeInsurance,
        }),

        ...(providerSlug === "paralegal" && {
          proofOfParalegalCertification,
          attorneyVerificationLetter,
        }),

        ...(providerSlug === "processServer" && {
          proofOfCertification,
          proofOfBusinessLicense,
        }),

        termsOfAgreement,
      };

      await updateProfile(updateProfilePayload, token);
      isFormDirty.current = false;
      setRegistrationSuccess(true);
      router.push("/registration/success");
    } catch (error) {
      setError(error?.response?.data);
      setRegistrationSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  const formPages = [
    {
      key: "1",
      component: (
        <FormPageOne handleFieldValueChange={handleFieldValueChange} />
      ),
      fields: ["email", "password", "confirmPassword"],
    },
    {
      key: "2",
      component: (
        <FormPageTwo
          handleFieldValueChange={handleFieldValueChange}
          providerOptions={providerOptions}
          setFormValues={setFormValues}
        />
      ),
      fields: ["userType", "providerType"],
    },

    {
      key: "3",
      component: (
        <FormPageThree
          handleFieldValueChange={handleFieldValueChange}
          providerOptions={providerOptions}
        />
      ),
      fields: ["firstName", "lastName", "phoneNumber", "address"],
    },

    {
      key: "4",
      component: (
        <FormPageFour
          handleFieldValueChange={handleFieldValueChange}
          setFormValues={setFormValues}
          states={states}
          counties={counties}
          cities={cities}
          countiesLoading={countiesLoading}
          citiesLoading={citiesLoading}
          setCities={setCities}
          fetchCounties={fetchCounties}
          fetchCities={fetchCities}
        />
      ),
      fields: ["stateId", "countyId", "cityId", "zipCode"],
    },

    ...(formValues?.userType === "provider"
      ? [
          {
            key: "5",
            component: (
              <FormPageFive
                handleFieldValueChange={handleFieldValueChange}
                subServiceTypesList={subServiceTypesList}
                serviceStates={serviceStates}
                serviceCounties={serviceCounties}
                serviceCities={serviceCities}
                serviceCountiesLoading={serviceCountiesLoading}
                serviceCitiesLoading={serviceCitiesLoading}
                setServiceCities={setServiceCities}
                fetchServiceCounties={fetchServiceCounties}
                fetchServiceCities={fetchServiceCities}
              />
            ),
            fields: [
              "yearsOfPractice",
              "practiceAreas",
              "serviceState",
              "serviceCounty",
              "serviceLocations",
              "stateBarNumber",
              "appearanceAvailability",
            ],
          },

          {
            key: "6",
            component: (
              <FormPageSix handleFieldValueChange={handleFieldValueChange} />
            ),
            fields: [
              "proofOfMalpracticeInsurance",
              "proofOfParalegalCertification",
              "attorneyVerificationLetter",
              "proofOfCertification",
              "proofOfBusinessLicense",
              "termsOfAgreement",
            ],
          },
        ]
      : []),
  ];

  return (
    <div className="w-full max-w-md rounded bg-white shadow-md ring-1 ring-gray-900/5 md:max-w-md lg:max-w-md">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleRegistration(values, setSubmitting);
        }}
        enableReinitialize={true}
      >
        {({
          dirty,
          isSubmitting,
          handleSubmit,
          setTouched,
          submitCount,
          touched,
          validateForm,
          values,
        }) => {
          isFormDirty.current = dirty;

          return (
            <>
              <div className="mb-2 flex flex-row items-center border-b border-secondary/25 px-5 py-3">
                {currentFormPage > 0 && (
                  <span
                    className="flex-none cursor-pointer"
                    onClick={() => {
                      const touchedFieldsLength = Object.keys(touched)?.length;
                      const initialValuesLength =
                        Object.keys(initialValues)?.length;

                      if (
                        submitCount > 0 &&
                        values.userType === "client" &&
                        touchedFieldsLength === initialValuesLength
                      ) {
                        const providerSpecificFieldsObject = arrayToObject(
                          providerSpecificFields,
                          false,
                        );
                        setTouched(
                          { ...touched, ...providerSpecificFieldsObject },
                          true,
                        );
                      }

                      setCurrentFormPage(currentFormPage - 1);
                    }}
                  >
                    <PreviousIcon height={28} width={28} fill="#007aff" />
                  </span>
                )}
                <h4 className="flex-1 text-center font-bold text-black">
                  Registration
                </h4>
              </div>

              <div className="px-5">
                <Form
                  layout={"vertical"}
                  form={form}
                  onFinish={handleSubmit}
                  autoComplete="off"
                >
                  <div className="grid grid-cols-1 gap-x-3">
                    <div className="grid grid-cols-1 gap-x-3">
                      {formPages[currentFormPage]?.component}
                    </div>
                  </div>

                  {currentFormPage === formPages.length - 1 && (
                    <Form.Item className="mb-2 mt-3 text-center">
                      <Button
                        type="primary"
                        className="mx-auto w-full bg-black hover:!bg-black/90"
                        htmlType="submit"
                        loading={isSubmitting || registrationSuccess}
                      >
                        Register
                      </Button>
                    </Form.Item>
                  )}
                </Form>

                {currentFormPage < formPages.length - 1 && (
                  <Button
                    type="primary"
                    htmlType="button"
                    loading={isSubmitting}
                    className="mx-auto mb-2 mt-3 flex w-full items-center justify-center rounded bg-black hover:!bg-black/90"
                    onClick={async () => {
                      const validationErrors = await validateForm();
                      const fieldsWithError = Object.keys(validationErrors);
                      const hasCommonField = hasCommon(
                        fieldsWithError,
                        formPages[currentFormPage].fields,
                      );

                      if (fieldsWithError.length > 0 && hasCommonField) {
                        const fieldsObject = arrayToObject(
                          [...formPages[currentFormPage].fields],
                          true,
                        );

                        setTouched(fieldsObject, true);
                      } else {
                        setCurrentFormPage(currentFormPage + 1);
                      }
                    }}
                  >
                    <span className="ml-auto">Next</span>
                    <span className="ml-auto">
                      <NextIcon />
                    </span>
                  </Button>
                )}
              </div>
            </>
          );
        }}
      </Formik>

      <div className="px-5 pb-4">
        {error?.message && (
          <Alert
            message={
              Array.isArray(error?.message)
                ? error?.message[0]?.message
                : typeof error?.message === "string"
                ? error?.message
                : "Network Error"
            }
            type="error"
            className="mt-3"
          />
        )}

        <p className="mt-3 text-center font-semibold text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserRegistrationForm;

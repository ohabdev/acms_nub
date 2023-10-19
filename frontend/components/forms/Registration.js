import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import getConfig from "next/config";
import { useRouter } from "next/router";
import { Button, Form, Radio } from "antd";
import { Formik } from "formik";
import TextInput from "@/components/fields/TextInput";
import AddressAutofillInput from "@/components/fields/AddressAutofillInput";
import PhoneNumberInput from "@/components/fields/PhoneNumberInput";
import SelectInput from "@/components/fields/SelectInput";
import FileUploadInput from "@/components/fields/FileUploadInput";
import * as utilsApi from "@/services/utils";
import { initialValues, validationSchema } from "@/form-schemas/registration";
import {
  PROVIDER_ROLES,
  PROVIDERS as providers,
  YEARS_OF_PRACTICE,
  APPEARANCE_AVAILABILITY,
} from "@/constants/constants";

const Alert = dynamic(() => import("@/components/alert/Alert"));

const RegistrationForm = () => {
  let pathname;
  if (typeof window !== "undefined") {
    pathname = window.location.pathname;
  }
  const forClient = pathname?.includes("client".toLowerCase());
  const userType = forClient ? "Client" : "Provider";

  const [form] = Form.useForm();
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();
  const [formValues, setFormValues] = useState(
    forClient ? { ...initialValues, role: "client" } : initialValues,
  );
  const [practiceAreas, setPracticeAreas] = useState([]);
  const [services, setServices] = useState([]);
  const [states, setStates] = useState([]);
  const [counties, setCounties] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState([]);
  const baseApiUrl = publicRuntimeConfig.baseApiUrl;

  useEffect(() => {
    if (!forClient) getPracticeAreas();
    getStates();
  }, [forClient]);

  /**
   * Get practice areas list
   */
  const getPracticeAreas = () => {
    utilsApi.practiceAreas().then((res) => {
      if (res.data?.practiceAreas) {
        const items = res.data?.practiceAreas.map((practiceArea) => {
          return {
            value: practiceArea?._id,
            label: practiceArea?.name,
          };
        });
        setPracticeAreas(items);
      }
    });
  };

  /**
   * Get services list
   */
  const getScopeOfServices = (provider) => {
    utilsApi.scopeOfServices(provider).then((res) => {
      if (res.data?.services) {
        const items = res.data?.services.map((service) => {
          return {
            value: service?._id,
            label: service?.name,
          };
        });
        setServices(items);
      }
    });
  };

  /**
   * Get states list
   */
  const getStates = () => {
    setLoading(true);
    utilsApi.getAllStates().then((res) => {
      if (res.data?.states) {
        const items = res.data?.states.map((state) => {
          return {
            value: state?._id,
            label: state?.name,
          };
        });
        setStates(items);
      }
      setLoading(false);
    });
  };

  /**
   * Get counties list
   */
  const getCounties = (stateId) => {
    utilsApi.getAllCounties(stateId).then((res) => {
      if (res.data?.counties) {
        const items = res.data?.counties.map((county) => {
          return {
            value: county?._id,
            label: county?.name,
          };
        });
        setCounties(items);
      }
    });
  };

  /**
   * Get cities list
   */
  const getCities = (cityId) => {
    setLoading(true);
    utilsApi.getAllCounties(cityId).then((res) => {
      if (res.data?.cities) {
        const items = res.data?.cities.map((city) => {
          return {
            value: city?._id,
            label: city?.name,
          };
        });
        setCities(items);
      }
      setLoading(false);
    });
  };

  const handleFieldValueChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleRegistration = async (values, setSubmitting) => {
    const register = await import("@/services/auth").then(
      (module) => module.register,
    );
    const formatPhoneNumber = await import(
      "@/utils/helpers/utilityHelper"
    ).then((module) => module.formatPhoneNumber);

    let payload = {
      role: values.role,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      ...(values.role === "client" && {
        phone: formatPhoneNumber(values.phone),
        address: values.address,
        geographicalLocation: {
          state: values.state,
          county: values.county,
          city: values.city,
          zipCode: values.zipCode,
        },
      }),
      ...(providers.includes(values.role) && {
        phoneNumber: {
          office: formatPhoneNumber(values.phoneNumberOffice),
          cell: formatPhoneNumber(values.phoneNumberCell),
        },
        yearsOfPractice: values.yearsOfPractice,
        geographicPracticeLocations: [
          {
            state: values.state,
            county: values.county,
            city: values.city,
          },
        ],
        termsOfAgreement: values.termsOfAgreement,
      }),
      ...(values.role === "attorney" && {
        stateBarNumber: values.stateBarNumber,
        proofOfMalpracticeInsurance: values.proofOfMalpracticeInsurance,
        appearanceAvailability: values.appearanceAvailability,
      }),
      ...(values.role === "paralegal" && {
        proofOfParalegalCertification: values.proofOfParalegalCertification,
        attorneyVerificationLetter: values.attorneyVerificationLetter,
      }),
      ...(values.role === "process_server" && {
        proofOfCertification: values.proofOfCertification,
        proofOfBusinessLicense: values.proofOfBusinessLicense,
      }),
      ...((values.role === "attorney" || values.role === "paralegal") && {
        officeAddress: values.officeAddress,
        practiceAreas: values.practiceAreas,
      }),
      ...((values.role === "paralegal" || values.role === "process_server") && {
        scopeOfServicesProvided: values.scopeOfServicesProvided,
      }),
    };

    register(payload)
      .then(() => {
        setSubmitting(false);
        router.push("/registration/success");
      })
      .catch((error) => {
        setSubmitting(false);
        setError(error?.response?.data);
      });
  };

  return (
    <div className="w-full rounded bg-white p-5 shadow-md ring-1 ring-gray-900/5 md:max-w-lg lg:max-w-xl">
      <h4 className="mb-2 text-center font-bold text-black">
        {`${userType}`} Registration
      </h4>
      <p className="mb-3 border-b border-black/5 pb-3 text-center text-sm text-gray-600">
        {`Want to register as a ${forClient ? "provider" : "client"}?`}
        <Link
          href={forClient ? `/registration/provider` : `/registration/client`}
          className="ml-1 font-semibold"
        >
          {forClient ? "Provider Registration" : "Client Registration"}
        </Link>
      </p>
      <Formik
        initialValues={
          forClient ? { ...initialValues, role: "client" } : initialValues
        }
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleRegistration(values, setSubmitting);
        }}
        enableReinitialize={true}
      >
        {({
          isSubmitting,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <Form layout={"vertical"} form={form} onFinish={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-3">
              {!forClient && (
                <div className="w-full">
                  <Form.Item
                    label="Provider Type"
                    className="mb-2"
                    validateStatus={errors.role && touched.role ? "error" : ""}
                    help={errors.role && touched.role ? errors.role : ""}
                    htmlFor="role"
                  >
                    <Radio.Group
                      id="role"
                      name="role"
                      onChange={async ({ target: { value } }) => {
                        await setFieldValue("role", value);
                        handleFieldValueChange("role", value);
                        await Promise.resolve();
                        setFieldValue("scopeOfServicesProvided", []);
                        getScopeOfServices(value);
                      }}
                      value={values.role}
                      optionType="button"
                      buttonStyle="solid"
                      style={{ width: "100%" }}
                    >
                      <div className="flex">
                        {PROVIDER_ROLES.map((role, index) => {
                          return (
                            <div
                              className={
                                index === PROVIDER_ROLES.length - 1
                                  ? "block flex-[0_0_41.65%]"
                                  : "flex-[0_0_29.15%]"
                              }
                              key={role.value}
                            >
                              <Radio.Button
                                value={role.value}
                                key={role.value}
                                className={`w-full ${
                                  index === 0
                                    ? "border-x-transparent xs:!rounded-ee-none xs:!rounded-es-none sm:!rounded-es sm:!rounded-se-none"
                                    : index === PROVIDER_ROLES.length - 1
                                    ? "!rounded-s-none !border-s-secondary xs:border-t-transparent sm:!border-s-transparent sm:border-t-secondary"
                                    : "!rounded-e-none !rounded-s-none"
                                }`}
                              >
                                {role?.label}
                              </Radio.Button>
                            </div>
                          );
                        })}
                      </div>
                    </Radio.Group>
                  </Form.Item>
                </div>
              )}

              <div className="grid grid-cols-2 gap-x-3">
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

                <TextInput
                  label="Email"
                  name="email"
                  placeholder="Enter Email Address"
                  postFieldValueChange={handleFieldValueChange}
                />

                {forClient ? (
                  <PhoneNumberInput
                    label="Phone Number"
                    name="phone"
                    placeholder="Enter Phone Number"
                    postFieldValueChange={handleFieldValueChange}
                  />
                ) : (
                  <>
                    <PhoneNumberInput
                      label="Phone Number (Office)"
                      name="phoneNumberOffice"
                      placeholder="Enter Phone Number (Office)"
                      postFieldValueChange={handleFieldValueChange}
                    />

                    <PhoneNumberInput
                      label="Phone Number (Cell)"
                      name="phoneNumberCell"
                      placeholder="Enter Phone Number (Cell)"
                      postFieldValueChange={handleFieldValueChange}
                    />
                  </>
                )}

                {forClient && (
                  <>
                    <AddressAutofillInput
                      label="Address"
                      name="address"
                      placeholder="Enter Address"
                      postFieldValueChange={handleFieldValueChange}
                    />
                  </>
                )}

                {!forClient &&
                  (values.role === "attorney" ||
                    values.role === "paralegal") && (
                    <>
                      <AddressAutofillInput
                        label="Office Address"
                        name="officeAddress"
                        placeholder="Enter Office Address"
                        postFieldValueChange={handleFieldValueChange}
                      />
                    </>
                  )}

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

                {!forClient && values.role === "attorney" && (
                  <TextInput
                    label="Bar code Number"
                    name="stateBarNumber"
                    placeholder="Enter Bar Number"
                    postFieldValueChange={handleFieldValueChange}
                  />
                )}

                {((!forClient && values.role === "attorney") ||
                  values.role === "paralegal") && (
                  <SelectInput
                    label="Practice Areas"
                    name="practiceAreas"
                    multiSelect
                    placeholder="Select Practice Areas"
                    options={practiceAreas}
                    postFieldValueChange={handleFieldValueChange}
                  />
                )}

                {!forClient && (
                  <SelectInput
                    label="Years of Practice"
                    name="yearsOfPractice"
                    placeholder="Select Years of Practice"
                    options={YEARS_OF_PRACTICE}
                    postFieldValueChange={handleFieldValueChange}
                  />
                )}

                <SelectInput
                  label="Select your Division"
                  name="state"
                  placeholder="Select State"
                  options={states}
                  filterable
                  postFieldValueChange={handleFieldValueChange}
                  onSelect={async (value) => {
                    setTimeout(() => {
                      setFormValues((previousFormValues) => {
                        return {
                          ...previousFormValues,
                          county: null,
                        };
                      });
                      setFormValues((previousFormValues) => {
                        return {
                          ...previousFormValues,
                          city: null,
                        };
                      });
                    });
                    await setFieldValue("county", null);
                    await setFieldValue("city", null);
                    setCities([]);
                    getCounties(value);
                  }}
                />

                <SelectInput
                  label="Select your District"
                  name="county"
                  placeholder="Select County"
                  options={counties}
                  filterable
                  postFieldValueChange={handleFieldValueChange}
                  onSelect={async (value) => {
                    await setFieldValue("city", null);
                    getCities(value);
                  }}
                />

                <SelectInput
                  label="Select your Upazila"
                  name="city"
                  placeholder="Select City"
                  options={cities}
                  filterable
                  disabled={loading}
                  postFieldValueChange={handleFieldValueChange}
                />

                {forClient && (
                  <TextInput
                    label="Post Code"
                    name="zipCode"
                    placeholder="Enter Zip Code"
                    postFieldValueChange={handleFieldValueChange}
                  />
                )}

                {!forClient && values.role === "attorney" && (
                  <SelectInput
                    label="Availibility"
                    name="appearanceAvailability"
                    placeholder="Select Appearance Availibility"
                    options={APPEARANCE_AVAILABILITY}
                    postFieldValueChange={handleFieldValueChange}
                  />
                )}

                {!forClient && values.role === "attorney" && (
                  <FileUploadInput
                    accept="application/pdf"
                    action={`${baseApiUrl}/upload/files`}
                    label="Attorney license"
                    name="proofOfMalpracticeInsurance"
                    placeholder=" Choose PDF File"
                    postFieldValueChange={handleFieldValueChange}
                  />
                )}

                {!forClient &&
                  (values.role === "paralegal" ||
                    values.role === "process_server") && (
                    <SelectInput
                      label="Scope of Services"
                      name="scopeOfServicesProvided"
                      multiSelect
                      placeholder="Select Scope of Services"
                      options={services}
                      postFieldValueChange={handleFieldValueChange}
                    />
                  )}

                {!forClient && values.role === "paralegal" && (
                  <>
                    <FileUploadInput
                      accept="application/pdf"
                      action={`${baseApiUrl}/upload/files`}
                      label="Proof of Paralegal Certification"
                      name="proofOfParalegalCertification"
                      placeholder=" Choose PDF File"
                      postFieldValueChange={handleFieldValueChange}
                    />

                    <FileUploadInput
                      accept="application/pdf"
                      action={`${baseApiUrl}/upload/files`}
                      label="Attorney Verification Letter"
                      name="attorneyVerificationLetter"
                      placeholder=" Choose PDF File"
                      postFieldValueChange={handleFieldValueChange}
                    />
                  </>
                )}

                {!forClient && values.role === "process_server" && (
                  <>
                    <FileUploadInput
                      accept="application/pdf"
                      action={`${baseApiUrl}/upload/files`}
                      label="Proof of Certification"
                      name="proofOfCertification"
                      placeholder=" Choose PDF File"
                      postFieldValueChange={handleFieldValueChange}
                    />

                    <FileUploadInput
                      accept="application/pdf"
                      action={`${baseApiUrl}/upload/files`}
                      label="Proof of Business License"
                      name="proofOfBusinessLicense"
                      placeholder=" Choose PDF File"
                      postFieldValueChange={handleFieldValueChange}
                    />
                  </>
                )}

                {!forClient && (
                  <FileUploadInput
                    accept="application/pdf"
                    action={`${baseApiUrl}/upload/files`}
                    label="Others documents"
                    name="termsOfAgreement"
                    placeholder=" Choose PDF File"
                    postFieldValueChange={handleFieldValueChange}
                  />
                )}
              </div>
            </div>

            <Form.Item className="mb-2 mt-3 text-center">
              <Button
                type="primary"
                className="mx-auto w-full rounded bg-blue-500"
                htmlType="submit"
                loading={isSubmitting}
              >
                Register
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>

      {error?.message && (
        <Alert
          message={
            Array.isArray(error?.message)
              ? error?.message[0]?.message
              : error?.message
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
  );
};

export default RegistrationForm;

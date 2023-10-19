import { useState, useEffect } from "react";
import getConfig from "next/config";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form, Divider } from "antd";
import FileOutlined from "@ant-design/icons/FileOutlined";
import EditOutlined from "@ant-design/icons/EditOutlined";
import { Formik } from "formik";
import TextInput from "@/components/fields/TextInput";
import AddressAutofillInput from "@/components/fields/AddressAutofillInput";
import PhoneNumberInput from "@/components/fields/PhoneNumberInput";
import SelectInput from "@/components/fields/SelectInput";
import FileUploadInput from "@/components/fields/FileUploadInput";
import * as utilsApi from "@/services/utils";
import { setUser } from "@/store/slices/authSlice";
import { setLoading as setLoadingStatus } from "@/store/slices/appSlice";
import useFeedback from "@/utils/hooks/useFeedback";
import { validationSchema } from "@/form-schemas/updateProfile";
import { getOriginalPhoneNumber } from "@/utils/helpers/utilityHelper";
import {
  YEARS_OF_PRACTICE,
  APPEARANCE_AVAILABILITY,
  PROVIDERS as providers,
} from "@/constants/constants";

const FileLink = ({ fileInfo }) => {
  const { fileUrl, name } = fileInfo || {};
  return (
    <p className="!mb-1 text-sm">
      <FileOutlined className="mr-2 text-black/50" />
      <span>
        <a href={fileUrl} target="_blank">
          {name}
        </a>
      </span>
    </p>
  );
};

const UpdateProfileForm = () => {
  const { user } = useSelector((state) => state.auth);
  const userDetails =
    user?.role === "process_server" ? user["processServer"] : user[user?.role];

  const isAttorney = user?.role === "attorney";
  const isParalegal = user?.role === "paralegal";
  const isProcessServer = user?.role === "process_server";
  const isClient = user?.role === "client";
  const isProvider = providers.includes(user?.role);

  const userLocation = isProvider
    ? userDetails?.geographicalLocations[0]
    : user?.location;

  const initialValues = {
    role: user?.role,
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,

    phone: getOriginalPhoneNumber(user?.phone),
    phoneNumberOffice: getOriginalPhoneNumber(userDetails?.phoneNumber?.office),
    phoneNumberCell: getOriginalPhoneNumber(userDetails?.phoneNumber?.cell),
    address: user?.address,
    officeAddress: userDetails?.officeAddress,
    stateBarNumber: userDetails?.stateBarNumber,
    practiceAreas: userDetails?.practiceAreas
      ? userDetails?.practiceAreas.map((practiceArea) => {
          return {
            value: practiceArea?._id,
            label: practiceArea?.name,
          };
        })
      : "",
    yearsOfPractice: userDetails?.yearsOfPractice,

    state: {
      value: userLocation?.state?._id,
      label: userLocation?.state?.name,
    },
    county: {
      value: userLocation?.county?._id,
      label: userLocation?.county?.name,
    },
    city: {
      value: userLocation?.city?._id,
      label: userLocation?.city?.name,
    },
    zipCode: userLocation?.zipCode,

    appearanceAvailability: userDetails?.appearanceAvailability,
    proofOfMalpracticeInsurance: userDetails?.proofOfMalpracticeInsurance?.id,
    scopeOfServicesProvided: userDetails?.scopeOfServicesProvided
      ? userDetails?.scopeOfServicesProvided.map((service) => service?._id)
      : "",
    proofOfParalegalCertification:
      userDetails?.proofOfParalegalCertification?.id,
    attorneyVerificationLetter: userDetails?.attorneyVerificationLetter?.id,
    proofOfCertification: userDetails?.proofOfCertification?.id,
    proofOfBusinessLicense: userDetails?.proofOfBusinessLicense?.id,
    termsOfAgreement: userDetails?.termsOfAgreement?.id,
  };

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState(initialValues);
  const [practiceAreas, setPracticeAreas] = useState([]);
  const [services, setServices] = useState([]);
  const [states, setStates] = useState([]);
  const [counties, setCounties] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileUploadStatus, setFileUploadStatus] = useState({});
  const dispatch = useDispatch();
  const { showNotification } = useFeedback();

  const { publicRuntimeConfig } = getConfig();
  const baseApiUrl = publicRuntimeConfig.baseApiUrl;

  useEffect(() => {
    if (isAttorney || isParalegal) {
      getPracticeAreas();
    }
    getStates();
    getCounties(userLocation?.state?._id);
    getCities(userLocation?.county?._id);

    if (isParalegal || isProcessServer) {
      getScopeOfServices(user?.role);
    }
  }, [isAttorney, isParalegal, isProcessServer, userLocation, user]);

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

  const handleUpdateProfile = async (values, setSubmitting) => {
    dispatch(setLoadingStatus(true));

    const updateProfile = await import("@/services/users").then(
      (module) => module.updateProfile,
    );
    const formatPhoneNumber = await import(
      "@/utils/helpers/utilityHelper"
    ).then((module) => module.formatPhoneNumber);

    let payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      ...(isClient && {
        phone: formatPhoneNumber(values.phone),
        address: values.address,
        geographicalLocation: {
          _id: user?.location?._id,
          state: values.state.value,
          county: values.county.value,
          city: values.city.value,
          zipCode: values.zipCode,
        },
      }),
      ...(isProvider && {
        phoneNumber: {
          office: formatPhoneNumber(values.phoneNumberOffice),
          cell: formatPhoneNumber(values.phoneNumberCell),
        },
        yearsOfPractice: values.yearsOfPractice,
        geographicPracticeLocations: [
          {
            state: values.state.value,
            county: values.county.value,
            city: values.city.value,
          },
        ],
        termsOfAgreement: values.termsOfAgreement,
      }),
      ...(isAttorney && {
        stateBarNumber: values.stateBarNumber,
        appearanceAvailability: values.appearanceAvailability,
        proofOfMalpracticeInsurance: values.proofOfMalpracticeInsurance,
      }),
      ...(isParalegal && {
        proofOfParalegalCertification: values.proofOfParalegalCertification,
        attorneyVerificationLetter: values.attorneyVerificationLetter,
      }),
      ...(isProcessServer && {
        proofOfCertification: values.proofOfCertification,
        proofOfBusinessLicense: values.proofOfBusinessLicense,
      }),
      ...((isAttorney || isParalegal) && {
        officeAddress: values.officeAddress,
        practiceAreas: values.practiceAreas.map(
          (practiceArea) => practiceArea?.value,
        ),
      }),
      ...((isParalegal || isProcessServer) && {
        scopeOfServicesProvided: values.scopeOfServicesProvided,
      }),
    };

    updateProfile(payload)
      .then((res) => {
        dispatch(setUser(res));
        showNotification({
          message: "Success",
          description: res?.message || res?.data?.message,
          type: "success",
        });
        setSubmitting(false);
        setFileUploadStatus({});
        dispatch(setLoadingStatus(false));
      })
      .catch((error) => {
        setSubmitting(false);
        showNotification({
          message: "Error",
          description: error?.response?.data?.message || "Network Error",
          type: "error",
        });
        dispatch(setLoadingStatus(false));
      });
  };

  return (
    <div className="mt-4 w-full rounded bg-white p-4 shadow-md ring-1 ring-gray-900/5 md:mt-0 md:max-w-lg lg:max-w-xl">
      <h5 className="text-center font-bold text-black">
        Update Profile <EditOutlined className="ml-2" />
      </h5>

      <Divider className="my-2" />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleUpdateProfile(values, setSubmitting);
        }}
        enableReinitialize={true}
      >
        {({ isSubmitting, handleSubmit, setFieldValue, setFieldTouched }) => (
          <Form
            layout={"vertical"}
            form={form}
            onFinish={handleSubmit}
            className="mt-3"
          >
            <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
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

              {isClient && (
                <PhoneNumberInput
                  label="Phone Number"
                  name="phone"
                  placeholder="Enter Phone Number"
                  postFieldValueChange={handleFieldValueChange}
                />
              )}

              {isProvider && (
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

              {isClient && (
                <>
                  <AddressAutofillInput
                    label="Address"
                    name="address"
                    placeholder="Enter Address"
                    postFieldValueChange={handleFieldValueChange}
                  />
                </>
              )}

              {(isAttorney || isParalegal) && (
                <>
                  <AddressAutofillInput
                    label="Office Address"
                    name="officeAddress"
                    placeholder="Enter Office Address"
                    postFieldValueChange={handleFieldValueChange}
                  />
                </>
              )}

              {isAttorney && (
                <TextInput
                  label="State Bar Number"
                  name="stateBarNumber"
                  placeholder="Enter Bar Number"
                  postFieldValueChange={handleFieldValueChange}
                />
              )}

              {(isAttorney || isParalegal) && (
                <SelectInput
                  label="Practice Areas"
                  name="practiceAreas"
                  multiSelect
                  labelInValue={true}
                  placeholder="Select Practice Areas"
                  options={practiceAreas}
                  postFieldValueChange={handleFieldValueChange}
                />
              )}

              {isProvider && (
                <SelectInput
                  label="Years of Practice"
                  name="yearsOfPractice"
                  placeholder="Select Years of Practice"
                  options={YEARS_OF_PRACTICE}
                  postFieldValueChange={handleFieldValueChange}
                />
              )}

              <SelectInput
                label="State"
                name="state"
                placeholder="Select State"
                options={states}
                filterable
                labelInValue={true}
                postFieldValueChange={handleFieldValueChange}
                onSelect={async (selected) => {
                  const { value } = selected;
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
                  setTimeout(() => {
                    setFieldTouched("county", true, true);
                    setFieldTouched("city", true, true);
                  });
                  setCities([]);
                  getCounties(value);
                }}
              />

              <SelectInput
                label="County"
                name="county"
                placeholder="Select County"
                options={counties}
                filterable
                labelInValue={true}
                postFieldValueChange={handleFieldValueChange}
                onSelect={async (selected) => {
                  const { value } = selected;
                  await setFieldValue("city", null);
                  setTimeout(() => {
                    setFieldTouched("city", true, true);
                  });
                  getCities(value);
                }}
              />

              <SelectInput
                label="City"
                name="city"
                placeholder="Select City"
                options={cities}
                filterable
                labelInValue={true}
                disabled={loading}
                postFieldValueChange={handleFieldValueChange}
              />

              {isClient && (
                <TextInput
                  label="Zip Code"
                  name="zipCode"
                  placeholder="Enter Zip Code"
                  postFieldValueChange={handleFieldValueChange}
                />
              )}

              {isAttorney && (
                <SelectInput
                  label="Apperance Availibility"
                  name="appearanceAvailability"
                  placeholder="Select Appearance Availibility"
                  options={APPEARANCE_AVAILABILITY}
                  postFieldValueChange={handleFieldValueChange}
                />
              )}

              {(isParalegal || isProcessServer) && (
                <SelectInput
                  label="Scope of Services"
                  name="scopeOfServicesProvided"
                  multiSelect
                  placeholder="Select Scope of Services"
                  options={services}
                  postFieldValueChange={handleFieldValueChange}
                />
              )}

              {isAttorney && (
                <div>
                  <FileUploadInput
                    accept="application/pdf"
                    action={`${baseApiUrl}/upload/files`}
                    label="Proof of Malpractice Insurance"
                    name="proofOfMalpracticeInsurance"
                    placeholder=" Choose PDF File"
                    postFieldValueChange={handleFieldValueChange}
                    onFileUploadSuccess={() => {
                      setFileUploadStatus({
                        ...fileUploadStatus,
                        proofOfMalpracticeInsurance: true,
                      });
                    }}
                  />
                  {!fileUploadStatus?.proofOfMalpracticeInsurance && (
                    <FileLink
                      fileInfo={userDetails?.proofOfMalpracticeInsurance}
                    />
                  )}
                </div>
              )}

              {isParalegal && (
                <>
                  <div>
                    <FileUploadInput
                      accept="application/pdf"
                      action={`${baseApiUrl}/upload/files`}
                      label="Proof of Paralegal Certification"
                      name="proofOfParalegalCertification"
                      placeholder=" Choose PDF File"
                      postFieldValueChange={handleFieldValueChange}
                      onFileUploadSuccess={() => {
                        setFileUploadStatus({
                          ...fileUploadStatus,
                          proofOfParalegalCertification: true,
                        });
                      }}
                    />
                    {!fileUploadStatus?.proofOfParalegalCertification && (
                      <FileLink
                        fileInfo={userDetails?.proofOfParalegalCertification}
                      />
                    )}
                  </div>

                  <div>
                    <FileUploadInput
                      accept="application/pdf"
                      action={`${baseApiUrl}/upload/files`}
                      label="Attorney Verification Letter"
                      name="attorneyVerificationLetter"
                      placeholder=" Choose PDF File"
                      postFieldValueChange={handleFieldValueChange}
                      onFileUploadSuccess={() => {
                        setFileUploadStatus({
                          ...fileUploadStatus,
                          attorneyVerificationLetter: true,
                        });
                      }}
                    />
                    {!fileUploadStatus?.attorneyVerificationLetter && (
                      <FileLink
                        fileInfo={userDetails?.attorneyVerificationLetter}
                      />
                    )}
                  </div>
                </>
              )}

              {isProcessServer && (
                <>
                  <div>
                    <FileUploadInput
                      accept="application/pdf"
                      action={`${baseApiUrl}/upload/files`}
                      label="Proof of Certification"
                      name="proofOfCertification"
                      placeholder=" Choose PDF File"
                      postFieldValueChange={handleFieldValueChange}
                      onFileUploadSuccess={() => {
                        setFileUploadStatus({
                          ...fileUploadStatus,
                          proofOfCertification: true,
                        });
                      }}
                    />
                    {!fileUploadStatus?.proofOfCertification && (
                      <FileLink fileInfo={userDetails?.proofOfCertification} />
                    )}
                  </div>

                  <div>
                    <FileUploadInput
                      accept="application/pdf"
                      action={`${baseApiUrl}/upload/files`}
                      label="Proof of Business License"
                      name="proofOfBusinessLicense"
                      placeholder=" Choose PDF File"
                      postFieldValueChange={handleFieldValueChange}
                      onFileUploadSuccess={() => {
                        setFileUploadStatus({
                          ...fileUploadStatus,
                          proofOfBusinessLicense: true,
                        });
                      }}
                    />
                    {!fileUploadStatus?.proofOfBusinessLicense && (
                      <FileLink
                        fileInfo={userDetails?.proofOfBusinessLicense}
                      />
                    )}
                  </div>
                </>
              )}

              {isProvider && (
                <div>
                  <FileUploadInput
                    accept="application/pdf"
                    action={`${baseApiUrl}/upload/files`}
                    label="Terms of agreement"
                    name="termsOfAgreement"
                    placeholder=" Choose PDF File"
                    postFieldValueChange={handleFieldValueChange}
                    onFileUploadSuccess={() => {
                      setFileUploadStatus({
                        ...fileUploadStatus,
                        termsOfAgreement: true,
                      });
                    }}
                  />
                  {!fileUploadStatus?.termsOfAgreement && (
                    <FileLink fileInfo={userDetails?.termsOfAgreement} />
                  )}
                </div>
              )}
            </div>

            <Form.Item className="mb-2 mt-3 text-center">
              <Button
                type="primary"
                className="mx-auto w-full bg-black hover:!bg-black/90"
                htmlType="submit"
                loading={isSubmitting}
              >
                Update
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdateProfileForm;

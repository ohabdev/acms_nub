import { useEffect, useState, useCallback } from "react";
import getConfig from "next/config";
import { useDispatch } from "react-redux";
import { Button, Form } from "antd";
import { Formik } from "formik";
import FileOutlined from "@ant-design/icons/FileOutlined";
import TextInput from "@/components/fields/TextInput";
import SelectInput from "@/components/fields/SelectInput";
import FileUploadInput from "@/components/fields/FileUploadInput";
import { EditIcon } from "@/components/icons/Icons";
import {
  getAllSubServiceTypes,
  getAllCountries,
  getAllStates,
  getAllCounties,
  getAllCities,
} from "@/services/utils";
import { setUser } from "@/store/slices/authSlice";
import useUser from "@/utils/hooks/useUser";
import useFeedback from "@/utils/hooks/useFeedback";
import { validationSchema } from "@/form-schemas/updateProviderDetailsInformationForm";
import { generateSuccessMessage } from "@/utils/helpers/utilityHelper";
import { generateOptions } from "@/utils/helpers/transformationHelper";
import {
  FAILED_OPS_ERROR_MESSAGE,
  FAILED_FETCH_ERROR_MESSAGE,
  YEARS_OF_PRACTICE,
  APPEARANCE_AVAILABILITY,
} from "@/constants/constants";

const nanoid = (await import("nanoid")).nanoid;

const { publicRuntimeConfig } = getConfig();
const { baseApiUrl, baseFileUrl } = publicRuntimeConfig;
const fileType = "application/pdf";
const fileUploadUrl = `${baseApiUrl}/upload/file`;

const FileLink = ({ filePath }) => {
  const fileUrl = `${baseFileUrl}/${filePath}`;
  return (
    <p className="-mt-1 mb-1 text-semi-sm font-semibold tracking-wide">
      <FileOutlined className="mr-1 text-info" />
      <span>
        <a href={fileUrl} target="_blank" className="text-info">
          View File
        </a>
      </span>
    </p>
  );
};

const UpdateProviderDetailsInformationForm = () => {
  const user = useUser();

  const {
    provider: {
      yearsOfPractice,
      services,
      stateBarNumber,
      appearanceAvailability,
      providerType,
      proofOfMalpracticeInsurance,
      proofOfParalegalCertification,
      attorneyVerificationLetter,
      proofOfCertification,
      proofOfBusinessLicense,
      termsOfAgreement,
    } = {},
  } = user || {};

  const isProvider = user?.role?.isProvider;
  const isAttorney = providerType?.serviceType?.slug === "attorney";
  const isParalegal = providerType?.serviceType?.slug === "paralegal";
  const isProcessServer = providerType?.serviceType?.slug === "processServer";

  const serviceTypeId = providerType?.serviceType?.id;
  const stateId = services?.length ? services[0]?.state?.id : null;
  const countyId = services?.length ? services[0]?.county?.id : null;
  const serviceLocations = services?.length
    ? [
        ...new Set(
          services.map((service) => {
            return service?.cityId;
          }),
        ),
      ]
    : [];

  const initialValues = {
    isProvider,
    isAttorney,
    isParalegal,
    isProcessServer,
    yearsOfPractice,
    practiceAreas: services?.length
      ? [
          ...new Set(
            services.map((service) => {
              return service?.subServiceTypeId;
            }),
          ),
        ]
      : [],
    state: stateId,
    county: countyId,
    serviceLocations,
    stateBarNumber,
    appearanceAvailability,

    proofOfMalpracticeInsurance,
    proofOfParalegalCertification,
    attorneyVerificationLetter,
    proofOfCertification,
    proofOfBusinessLicense,
    termsOfAgreement,
  };

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState(initialValues);
  const [formKey, setFormKey] = useState(JSON.stringify(initialValues));
  const [fileUploadStatus, setFileUploadStatus] = useState({});
  const dispatch = useDispatch();
  const { showNotification } = useFeedback();

  const [subServiceTypesList, setSubServiceTypesList] = useState([]);
  const [subServiceTypesLoading, setSubServiceTypesLoading] = useState(true);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [counties, setCounties] = useState([]);
  const [cities, setCities] = useState([]);

  const [statesLoading, setStatesLoading] = useState(true);
  const [countiesLoading, setCountiesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const notifyError = useCallback(
    (errorMessage) => {
      showNotification({
        message: "Error",
        description: errorMessage,
        type: "error",
      });
    },
    [showNotification],
  );

  const handleFieldValueChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const fetchAllSubServiceTypes = useCallback(async () => {
    try {
      const response = await getAllSubServiceTypes({
        page: 0,
        limit: 50,
        parentId: serviceTypeId,
      });

      setSubServiceTypesList(
        generateOptions(response?.data?.rows, false, true),
      );
    } catch (error) {
      notifyError(FAILED_FETCH_ERROR_MESSAGE);
    } finally {
      setSubServiceTypesLoading(false);
    }
  }, [notifyError, serviceTypeId]);

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
      notifyError(FAILED_FETCH_ERROR_MESSAGE);
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
        notifyError(FAILED_FETCH_ERROR_MESSAGE);
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
        notifyError(FAILED_FETCH_ERROR_MESSAGE);
      } finally {
        setCitiesLoading(false);
      }
    },
    [notifyError],
  );

  useEffect(() => {
    fetchAllSubServiceTypes();
    fetchCountries();
    fetchStates();
    if (stateId) fetchCounties({ stateId });
    if (countyId) fetchCities({ countyId });
  }, [
    fetchAllSubServiceTypes,
    fetchStates,
    fetchCountries,
    fetchCounties,
    fetchCities,
    stateId,
    countyId,
  ]);

  const handleUpdateProfile = async (values, setSubmitting) => {
    const updateProviderProfile = await import("@/services/users").then(
      (module) => {
        return module.updateProviderProfile;
      },
    );

    const {
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

    let payload = {
      countryId: countries[0]?.id,
      yearsOfPractice,
      practiceAreas,
      serviceLocations,
      termsOfAgreement,

      ...(isAttorney && {
        stateBarNumber,
        appearanceAvailability,
        proofOfMalpracticeInsurance,
      }),

      ...(isParalegal && {
        proofOfParalegalCertification,
        attorneyVerificationLetter,
      }),

      ...(isProcessServer && {
        proofOfCertification,
        proofOfBusinessLicense,
      }),
    };

    try {
      const response = await updateProviderProfile(payload);
      dispatch(setUser(response?.data));
      setFileUploadStatus({});
      showNotification({
        message: "Success",
        description: generateSuccessMessage("Profile", "update"),
        type: "success",
      });
    } catch (error) {
      const description =
        typeof error?.response?.data?.message === "string"
          ? error?.response?.data?.message
          : "Network Error";

      notifyError(description);
    } finally {
      setFormKey(nanoid());
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-4 w-full rounded bg-white p-4 shadow-md ring-1 ring-gray-900/5">
        <h5 className="border-b border-b-[#0505051a] pb-2 font-bold text-black">
          Details Information
        </h5>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleUpdateProfile(values, setSubmitting);
          }}
          enableReinitialize={true}
          key={formKey}
        >
          {({ isSubmitting, handleSubmit, setFieldValue }) => (
            <Form
              layout={"vertical"}
              form={form}
              onFinish={handleSubmit}
              className="mt-3"
            >
              <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                <SelectInput
                  label="Years of Practice"
                  name="yearsOfPractice"
                  placeholder="Select Years of Practice"
                  options={YEARS_OF_PRACTICE}
                  postFieldValueChange={handleFieldValueChange}
                />

                <SelectInput
                  className={
                    subServiceTypesLoading ? "pointer-events-none" : ""
                  }
                  label="Practice Areas"
                  name="practiceAreas"
                  placeholder="Select Practice Areas"
                  // labelInValue={true}
                  multiSelect
                  filterable
                  options={subServiceTypesList}
                />

                <SelectInput
                  className={statesLoading ? "pointer-events-none" : ""}
                  label="Service Division"
                  name="state"
                  placeholder="Select Service Division"
                  options={states}
                  filterable
                  onSelect={async (value) => {
                    await setFieldValue("county", null);
                    await setFieldValue("serviceLocations", []);
                    setCities([]);
                    fetchCounties({ stateId: value });
                  }}
                />

                <SelectInput
                  className={countiesLoading ? "pointer-events-none" : ""}
                  label="Service District"
                  name="county"
                  placeholder="Select Service District"
                  options={counties}
                  filterable
                  onSelect={async (value) => {
                    await setFieldValue("serviceLocations", []);
                    fetchCities({ countyId: value });
                  }}
                />

                <SelectInput
                  className={citiesLoading ? "pointer-events-none" : ""}
                  label="Service Upazilla"
                  name="serviceLocations"
                  placeholder="Select Service Upazilla"
                  options={cities}
                  multiSelect
                  filterable
                />

                {isAttorney && (
                  <>
                    <TextInput
                      label="Bar code number"
                      name="stateBarNumber"
                      placeholder="Enter Bar Number"
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

                {isAttorney && (
                  <div>
                    <FileUploadInput
                      accept={fileType}
                      action={fileUploadUrl}
                      label="Proof of License"
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
                      <FileLink filePath={proofOfMalpracticeInsurance} />
                    )}
                  </div>
                )}

                {isParalegal && (
                  <>
                    <div>
                      <FileUploadInput
                        accept={fileType}
                        action={fileUploadUrl}
                        label="Others documents"
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
                        <FileLink filePath={proofOfParalegalCertification} />
                      )}
                    </div>

                    <div>
                      <FileUploadInput
                        accept={fileType}
                        action={fileUploadUrl}
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
                        <FileLink filePath={attorneyVerificationLetter} />
                      )}
                    </div>
                  </>
                )}

                {isProcessServer && (
                  <>
                    <div>
                      <FileUploadInput
                        accept={fileType}
                        action={fileUploadUrl}
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
                        <FileLink filePath={proofOfCertification} />
                      )}
                    </div>

                    <div>
                      <FileUploadInput
                        accept={fileType}
                        action={fileUploadUrl}
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
                        <FileLink filePath={proofOfBusinessLicense} />
                      )}
                    </div>
                  </>
                )}

                <div>
                  <FileUploadInput
                    accept={fileType}
                    action={fileUploadUrl}
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
                    <FileLink filePath={termsOfAgreement} />
                  )}
                </div>
              </div>

              <Form.Item className="mb-2 mt-3">
                <Button
                  type="primary"
                  className="flex w-full items-center justify-center rounded-semi-sm bg-black leading-normal hover:!bg-black/90 md:w-1/2"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  <span className="mr-2">
                    <EditIcon width={14} height={14} />
                  </span>
                  <span>Update</span>
                </Button>
              </Form.Item>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default UpdateProviderDetailsInformationForm;

import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Button, Form, Input } from "antd";
import { NumericFormat } from "react-number-format";
import { Formik } from "formik";
import TextInput from "@/components/fields/TextInput";
import SelectInput from "@/components/fields/SelectInput";
import ValidationFeedback from "@/components/error/ValidationFeedback";
import { PlusIcon } from "@/components/icons/Icons";
import useFeedback from "@/utils/hooks/useFeedback";
import {
  getAllSubServiceTypes,
  getAllCountries,
  getAllStates,
  getAllCounties,
  getAllCities,
} from "@/services/utils";
import { initialValues, validationSchema } from "@/form-schemas/addNewService";
import { createService } from "@/services/users";
import { generateOptions } from "@/utils/helpers/transformationHelper";
import { generateSuccessMessage } from "@/utils/helpers/utilityHelper";
import {
  APPEARANCE_AVAILABILITY,
  FAILED_FETCH_ERROR_MESSAGE,
  DISABLED_CLASSNAME,
} from "@/constants/constants";

const AddNewServiceForm = ({ closeModal, fetchMyServices }) => {
  const { user } = useSelector((state) => state.auth);
  const [subServiceTypesList, setSubServiceTypesList] = useState([]);
  const [subServiceTypesLoading, setSubServiceTypesLoading] = useState(true);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [counties, setCounties] = useState([]);
  const [cities, setCities] = useState([]);

  const [statesLoading, setStatesLoading] = useState(true);
  const [countiesLoading, setCountiesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const [form] = Form.useForm();
  const { showNotification } = useFeedback();

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

  const fetchAllSubServiceTypes = useCallback(async () => {
    try {
      const response = await getAllSubServiceTypes({ page: 0, limit: 50 });
      setSubServiceTypesList(generateOptions(response?.data?.rows, true, true));
    } catch (error) {
      notifyError(error);
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
      setStates(generateOptions(response?.data?.rows, true, true));
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
        setCounties(generateOptions(response?.data?.rows, true, true));
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
        setCities(generateOptions(response?.data?.rows, true, true));
      } catch (error) {
        notifyError(error);
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
  }, [fetchAllSubServiceTypes, fetchCountries, fetchStates]);

  const handleFormSubmit = async (values, setSubmitting) => {
    const payload = {
      ...values,
      countryId: countries[0]?.id,
      serviceTypeId: user?.provider?.providerTypes[0]?.serviceTypeId,
    };

    try {
      await createService(payload);
      fetchMyServices(1);

      showNotification({
        message: "Success",
        description: generateSuccessMessage("Service", "create"),
        type: "success",
      });
    } catch (error) {
      const description =
        typeof error?.response?.data?.message === "string"
          ? error?.response?.data?.message
          : "Network Error";

      showNotification({
        message: "Error",
        description,
        type: "error",
      });
    } finally {
      setSubmitting(false);
      closeModal();
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleFormSubmit(values, setSubmitting);
        }}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          setFieldValue,
          handleBlur,
          handleSubmit,
        }) => (
          <Form layout={"vertical"} form={form} onFinish={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2 lg:grid-cols-2">
              <TextInput
                label="Title"
                name="serviceName"
                placeholder="Enter Service Title"
              />

              <SelectInput
                label="Availability"
                name="availability"
                placeholder="Select Availability"
                options={APPEARANCE_AVAILABILITY}
              />

              <SelectInput
                className={subServiceTypesLoading ? DISABLED_CLASSNAME : ""}
                label="Practice Area"
                name="subServiceTypeId"
                placeholder="Select Practice Area"
                filterable
                options={subServiceTypesList}
              />

              <SelectInput
                className={statesLoading ? DISABLED_CLASSNAME : ""}
                label="State"
                name="stateId"
                placeholder="Select State"
                options={states}
                filterable
                onSelect={async (value) => {
                  await setFieldValue("countyId", null);
                  await setFieldValue("cityId", null);
                  setCities([]);
                  fetchCounties({ stateId: value });
                }}
              />

              <SelectInput
                className={countiesLoading ? DISABLED_CLASSNAME : ""}
                label="County"
                name="countyId"
                placeholder="Select County"
                options={counties}
                filterable
                onSelect={async (value) => {
                  await setFieldValue("cityId", null);
                  fetchCities({ countyId: value });
                }}
              />

              <SelectInput
                className={citiesLoading ? DISABLED_CLASSNAME : ""}
                label="City"
                name="cityId"
                placeholder="Select City"
                options={cities}
                filterable
              />

              <Form.Item
                label="Price"
                className="mb-2"
                validateStatus={errors.price && touched.price ? "error" : ""}
              >
                <NumericFormat
                  name="price"
                  allowNegative={false}
                  value={values?.price}
                  prefix={"$"}
                  placeholder="Enter Price"
                  customInput={Input}
                  onValueChange={(values) => {
                    setFieldValue("price", values.value);
                  }}
                  onBlur={(event) => {
                    handleBlur(event);
                  }}
                />
                <ValidationFeedback
                  error={errors.price}
                  touched={touched.price}
                />
              </Form.Item>
            </div>

            <Form.Item className="mb-2 mt-4 text-center">
              <Button
                type="primary"
                className="mx-auto flex w-full items-center justify-center rounded-semi-sm bg-black leading-normal hover:!bg-black/90"
                htmlType="submit"
                loading={isSubmitting}
              >
                <span className="mr-2">
                  <PlusIcon width={14} height={14} />
                </span>
                <span>Add</span>
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddNewServiceForm;

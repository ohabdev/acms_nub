import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Button, Form, Input } from "antd";
import { NumericFormat } from "react-number-format";
import { Formik } from "formik";
import TextInput from "@/components/fields/TextInput";
import SelectInput from "@/components/fields/SelectInput";
import ValidationFeedback from "@/components/error/ValidationFeedback";
import { EditIcon } from "@/components/icons/Icons";
import useFeedback from "@/utils/hooks/useFeedback";
import {
  getAllSubServiceTypes,
  getAllStates,
  getAllCounties,
  getAllCities,
} from "@/services/utils";
import { validationSchema } from "@/form-schemas/editService";
import { updateService } from "@/services/users";
import { generateOptions } from "@/utils/helpers/transformationHelper";
import { generateSuccessMessage } from "@/utils/helpers/utilityHelper";
import {
  APPEARANCE_AVAILABILITY,
  FAILED_FETCH_ERROR_MESSAGE,
  DISABLED_CLASSNAME,
} from "@/constants/constants";

const EditServiceForm = ({ selectedService, closeModal, fetchMyServices }) => {
  const { user } = useSelector((state) => state.auth);
  const [subServiceTypesList, setSubServiceTypesList] = useState([]);
  const [subServiceTypesLoading, setSubServiceTypesLoading] = useState(true);

  const [states, setStates] = useState([]);
  const [counties, setCounties] = useState([]);
  const [cities, setCities] = useState([]);

  const [statesLoading, setStatesLoading] = useState(true);
  const [countiesLoading, setCountiesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const [form] = Form.useForm();
  const { showNotification } = useFeedback();

  const {
    id,
    availability,
    countryId,
    serviceName,
    subServiceTypeId,
    price,
    state,
    county,
    city,
  } = selectedService || {};

  const initialValues = {
    serviceName,
    availability,
    subServiceTypeId,
    state: { label: state?.name, value: state?.id },
    county: { label: county?.name, value: county?.id },
    city: { label: city?.name, value: city?.id },
    price,
  };

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
      setSubServiceTypesList(
        generateOptions(response?.data?.rows, false, true),
      );
    } catch (error) {
      notifyError(error);
    } finally {
      setSubServiceTypesLoading(false);
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

  useEffect(() => {
    fetchAllSubServiceTypes();
    fetchStates();
    if (state?.id) fetchCounties({ stateId: state?.id });
    if (county?.id) fetchCities({ countyId: county?.id });
  }, [
    fetchAllSubServiceTypes,
    fetchStates,
    fetchCounties,
    fetchCities,
    state?.id,
    county?.id,
  ]);

  const handleFormSubmit = async (values, setSubmitting) => {
    const {
      serviceName,
      availability,
      subServiceTypeId,
      state,
      county,
      city,
      price,
    } = values;

    const payload = {
      serviceName,
      availability,
      subServiceTypeId,
      stateId: state.value,
      countyId: county.value,
      cityId: city.value,
      price,
      countryId: countryId,
      serviceTypeId: user?.provider?.providerTypes?.serviceTypeId,
    };

    try {
      await updateService(id, payload);
      fetchMyServices(1);

      showNotification({
        message: "Success",
        description: generateSuccessMessage("Service", "update"),
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
                name="state"
                placeholder="Select State"
                labelInValue={true}
                options={states}
                filterable
                onSelect={async (selected) => {
                  const { value } = selected;
                  await setFieldValue("county", null);
                  await setFieldValue("city", null);
                  setCities([]);
                  fetchCounties({ stateId: value });
                }}
              />

              <SelectInput
                className={countiesLoading ? DISABLED_CLASSNAME : ""}
                label="County"
                name="county"
                placeholder="Select County"
                labelInValue={true}
                options={counties}
                filterable
                onSelect={async (selected) => {
                  const { value } = selected;
                  await setFieldValue("city", null);
                  fetchCities({ countyId: value });
                }}
              />

              <SelectInput
                className={citiesLoading ? DISABLED_CLASSNAME : ""}
                label="City"
                name="city"
                placeholder="Select City"
                labelInValue={true}
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
                  <EditIcon width={14} height={14} />
                </span>
                <span>Update</span>
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default EditServiceForm;

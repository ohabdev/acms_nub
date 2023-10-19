import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form } from "antd";
import { Formik } from "formik";
import TextInput from "@/components/fields/TextInput";
import SelectInput from "@/components/fields/SelectInput";
import { EditIcon } from "@/components/icons/Icons";
import { setUser } from "@/store/slices/authSlice";
import useFeedback from "@/utils/hooks/useFeedback";
import { getAllStates, getAllCounties, getAllCities } from "@/services/utils";
import { validationSchema } from "@/form-schemas/updateLocationInformation";
import { generateOptions } from "@/utils/helpers/transformationHelper";
import { generateSuccessMessage } from "@/utils/helpers/utilityHelper";
import { FAILED_FETCH_ERROR_MESSAGE } from "@/constants/constants";

const UpdateLocationInformationForm = () => {
  const { user } = useSelector((state) => state.auth);
  const { state, stateId, county, countyId, city, cityId } = user || {};
  const isProvider = user?.role?.isProvider;

  const initialValues = {
    state: state
      ? {
          value: state?.id,
          label: state?.name,
        }
      : stateId,

    county: county
      ? {
          value: county?.id,
          label: county?.name,
        }
      : countyId,

    city: city
      ? {
          value: city?.id,
          label: city?.name,
        }
      : cityId,

    zipCode: user?.zipCode,
  };

  const [states, setStates] = useState([]);
  const [counties, setCounties] = useState([]);
  const [cities, setCities] = useState([]);

  const [statesLoading, setStatesLoading] = useState(true);
  const [countiesLoading, setCountiesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState(initialValues);
  const [formKey, setFormKey] = useState(JSON.stringify(initialValues));
  const dispatch = useDispatch();
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
    fetchStates();
  }, [fetchStates]);

  const handleFieldValueChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleUpdateProfile = async (values, setSubmitting) => {
    const nanoid = (await import("nanoid")).nanoid;
    const updateProfile = await import("@/services/users").then((module) => {
      return isProvider
        ? module.updateProviderProfile
        : module.updateClientProfile;
    });

    const { state, county, city, zipCode } = values;

    let payload = {
      stateId: parseInt(state.value),
      countyId: parseInt(county.value),
      cityId: parseInt(city.value),
      zipCode,
    };

    try {
      const response = await updateProfile(payload);
      dispatch(setUser(response?.data));
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

      showNotification({
        message: "Error",
        description,
        type: "error",
      });
    } finally {
      setFormKey(nanoid());
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full rounded bg-white p-4 shadow-md ring-1 ring-gray-900/5">
      <h5 className="border-b border-b-[#0505051a] pb-2 font-bold text-black">
        Location Information
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
        {({
          values,
          isSubmitting,
          setFieldValue,
          setFieldTouched,
          handleSubmit,
        }) => (
          <Form
            layout={"vertical"}
            form={form}
            onFinish={handleSubmit}
            className="mt-3"
          >
            <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              <SelectInput
                label="Division"
                name="state"
                placeholder="Select Division"
                options={states}
                filterable
                labelInValue={typeof values.state === "string" ? false : true}
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
                  fetchCounties({ stateId: value });
                }}
              />

              <SelectInput
                label="District"
                name="county"
                placeholder="Select District"
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
                  fetchCities({ countyId: value });
                }}
              />

              <SelectInput
                label="Upazilla"
                name="city"
                placeholder="Select Upazilla"
                options={cities}
                filterable
                labelInValue={true}
                disabled={citiesLoading}
                postFieldValueChange={handleFieldValueChange}
              />

              <TextInput
                label="Post code"
                name="zipCode"
                placeholder="Enter post Code"
                postFieldValueChange={handleFieldValueChange}
              />
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
  );
};

export default UpdateLocationInformationForm;

import { useRouter } from "next/router";
import PropTypes from "prop-types";
import dynamic from "next/dynamic";
import { Formik } from "formik";
import queryString from "query-string";
import Switch from "@/components/fields/Switch";
import SelectInput from "@/components/fields/SelectInput";

const Form = dynamic(() => import("antd").then((module) => module.Form));

const qsOptions = {
  arrayFormat: "comma",
  encode: false,
  skipEmptyString: true,
  skipNull: true,
};

const ServicesSearchFilterForm = ({
  formValues,
  prevParams,
  providerOptions,
  subServiceTypesOptions,
  states,
  counties,
  cities,
  setCities,
  setCurrentPage,
  setFormValues,
}) => {
  const router = useRouter();
  const queryParams = router.query;

  const handleSwitchFieldValueChange = (
    values,
    id,
    name,
    setFieldValue,
    submitForm,
  ) => {
    if (values.serviceTypeIds?.includes(id)) {
      const serviceTypeIdsList = values.serviceTypeIds.filter(
        (serviceTypeId) => serviceTypeId !== id,
      );
      setFieldValue(name, serviceTypeIdsList);
      handleFieldValueChange(name, serviceTypeIdsList);
    } else {
      setFieldValue(name, [...values.serviceTypeIds, id]);
      handleFieldValueChange(name, [...formValues?.serviceTypeIds, id]);
    }
    submitForm();
  };

  const handleFieldValueChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFormSubmit = (values) => {
    setCurrentPage(1);

    let params;
    if (prevParams?.stateId && prevParams?.stateId !== values?.stateId) {
      delete queryParams?.countyId;
      delete values?.countyId;
    }

    if (prevParams?.countyId && prevParams?.countyId !== values?.countyId) {
      delete queryParams?.cityId;
      delete values?.cityId;
    }

    params = queryString.stringify({ ...queryParams, ...values }, qsOptions);
    const redirectUrl = params ? `/?${params}` : "/";
    router.push(redirectUrl, undefined, { shallow: true });
  };

  return (
    <Formik
      initialValues={formValues}
      onSubmit={(values, { setSubmitting }) => {
        handleFormSubmit(values, setSubmitting);
      }}
      enableReinitialize={true}
    >
      {({ values, setFieldValue, handleSubmit, submitForm }) => (
        <Form layout={"vertical"} onFinish={handleSubmit}>
          <p className="border-b border-secondary/25 pb-2 font-semibold">
            Provider Type
          </p>
          <div>
            <ul className="mt-2.5">
              {providerOptions?.map((provider) => {
                return (
                  <li
                    key={provider?.id}
                    className="item mb-2.5 flex flex-col items-center gap-x-3 gap-y-2 whitespace-nowrap text-semi-sm xs:flex-row sm:text-sm"
                  >
                    <Switch
                      active={values.serviceTypeIds?.includes(
                        provider?.id?.toString(),
                      )}
                      onChange={() => {
                        handleSwitchFieldValueChange(
                          values,
                          provider?.id?.toString(),
                          "serviceTypeIds",
                          setFieldValue,
                          submitForm,
                        );
                      }}
                    />
                    <span className="truncate">{provider?.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <SelectInput
            label="Service Type"
            name="subServiceTypeIds"
            placeholder="Select"
            filterable
            multiSelect
            options={subServiceTypesOptions}
            postFieldValueChange={handleFieldValueChange}
            onSelect={submitForm}
            onDeselect={submitForm}
          />

          <SelectInput
            label="Division"
            name="stateId"
            placeholder="Select Division"
            filterable
            options={states}
            postFieldValueChange={handleFieldValueChange}
            onSelect={async (value) => {
              setTimeout(() => {
                setFormValues((previousFormValues) => {
                  return {
                    ...previousFormValues,
                    countyId: null,
                  };
                });
                setFormValues((previousFormValues) => {
                  return {
                    ...previousFormValues,
                    cityId: null,
                  };
                });
              });
              await setFieldValue("countyId", null);
              await setFieldValue("cityId", null);
              setCities([]);
              submitForm();
            }}
          />

          <SelectInput
            label="District"
            name="countyId"
            placeholder="Select district"
            filterable
            options={counties}
            postFieldValueChange={handleFieldValueChange}
            onSelect={() => {
              setTimeout(() => {
                setFormValues((previousFormValues) => {
                  return {
                    ...previousFormValues,
                    cityId: null,
                  };
                });
              });
              submitForm();
            }}
          />

          <SelectInput
            label="Upazilla"
            name="cityId"
            placeholder="Select upazilla"
            filterable
            options={cities}
            postFieldValueChange={handleFieldValueChange}
            onSelect={submitForm}
          />
        </Form>
      )}
    </Formik>
  );
};

ServicesSearchFilterForm.propTypes = {
  formValues: PropTypes.object,
  prevParams: PropTypes.object,
  providerOptions: PropTypes.array,
  subServiceTypesOptions: PropTypes.array,
  states: PropTypes.array,
  counties: PropTypes.array,
  cities: PropTypes.array,
  setCities: PropTypes.func,
  setCurrentPage: PropTypes.func,
  setFormValues: PropTypes.func,
};

export default ServicesSearchFilterForm;

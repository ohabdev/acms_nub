import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form } from "antd";
import EditOutlined from "@ant-design/icons/EditOutlined";
import { Formik } from "formik";
import PhoneNumberInput from "@/components/fields/PhoneNumberInput";
import AddressAutofillInput from "@/components/fields/AddressAutofillInput";
import { EditIcon } from "@/components/icons/Icons";
import { setUser } from "@/store/slices/authSlice";
import { setLoading as setLoadingStatus } from "@/store/slices/appSlice";
import useFeedback from "@/utils/hooks/useFeedback";
import { validationSchema } from "@/form-schemas/updateContactInformation";
import {
  getOriginalPhoneNumber,
  generateSuccessMessage,
} from "@/utils/helpers/utilityHelper";

const UpdateContactInformationForm = () => {
  const { user } = useSelector((state) => state.auth);
  const isProvider = user?.role?.isProvider;

  const initialValues = {
    phoneNumber: getOriginalPhoneNumber(user?.phoneNumber),
    address: user?.address,
  };

  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState(initialValues);
  const [formKey, setFormKey] = useState(JSON.stringify(initialValues));
  const dispatch = useDispatch();
  const { showNotification } = useFeedback();

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
    const formatPhoneNumber = await import(
      "@/utils/helpers/utilityHelper"
    ).then((module) => module.formatPhoneNumber);

    const { phoneNumber, address } = values;

    let payload = {
      ...(phoneNumber && { phoneNumber: formatPhoneNumber(phoneNumber) }),
      ...(address && { address }),
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
      dispatch(setLoadingStatus(false));
    }
  };

  return (
    <div className="w-full rounded bg-white p-4 shadow-md ring-1 ring-gray-900/5">
      <h5 className="border-b border-b-[#0505051a] pb-2 font-bold text-black">
        Contact Information
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
        {({ isSubmitting, handleSubmit }) => (
          <Form
            layout={"vertical"}
            form={form}
            onFinish={handleSubmit}
            className="mt-3"
          >
            <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              <PhoneNumberInput
                label="Phone Number"
                name="phoneNumber"
                placeholder="Enter Phone Number"
                postFieldValueChange={handleFieldValueChange}
              />

              <AddressAutofillInput
                label="Address"
                name="address"
                placeholder="Enter Address"
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

export default UpdateContactInformationForm;

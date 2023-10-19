import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form } from "antd";
import { Formik } from "formik";
import TextInput from "@/components/fields/TextInput";
import { EditIcon } from "@/components/icons/Icons";
import { setUser } from "@/store/slices/authSlice";
import useFeedback from "@/utils/hooks/useFeedback";
import { validationSchema } from "@/form-schemas/updateBasicInformation";
import { generateSuccessMessage } from "@/utils/helpers/utilityHelper";

const UpdateBasicInformationForm = () => {
  const { user } = useSelector((state) => state.auth);

  const isProvider = user?.role?.isProvider;

  const initialValues = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
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

    const { firstName, lastName, email } = values;

    let payload = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(email && { email }),
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
        General Information
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

export default UpdateBasicInformationForm;

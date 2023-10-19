import { useState } from "react";
import dynamic from "next/dynamic";
import getConfig from "next/config";
import { useSelector, useDispatch } from "react-redux";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import dayjs from "dayjs";
import Spinner from "@/components/spinner/Spinner";
import Avatar from "@/components/avatar/Avatar";
import Truncate from "@/components/truncate/Truncate";
import StatusBadge from "@/components/badges/StatusBadge";
import LineDivider from "@/components/divider/LineDivider";
import { ClockIcon, CameraIcon, UploadIcon } from "@/components/icons/Icons";
import useFeedback from "@/utils/hooks/useFeedback";
import { setUser } from "@/store/slices/authSlice";
import { generateSuccessMessage } from "@/utils/helpers/utilityHelper";

const SpinnerIcon = dynamic(() =>
  import("@/components/icons/Icons").then((module) => module.SpinnerIcon),
);

const StatusText = ({ status, label }) => {
  return (
    <>
      <p className="text-center text-semi-sm font-semibold">{label}</p>
      <StatusBadge
        status={status ? "success" : "warning"}
        text={status ? "Completed" : "Pending"}
      />
    </>
  );
};

const ProfileInformationCard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [uploading, setUploading] = useState(false);
  const { showNotification } = useFeedback();
  const { publicRuntimeConfig } = getConfig();
  const { baseApiUrl, baseFileUrl } = publicRuntimeConfig;
  const isProvider = user?.role?.isProvider;

  const {
    accountStatus,
    firstName,
    lastName,
    email,
    emailVerified,
    profilePicture,
    isProfileCompleted,
    createdAt,
  } = user || {};

  const fullName = firstName && lastName ? `${firstName} ${lastName}` : "";
  const profilePhotoUrl = profilePicture
    ? `${baseFileUrl}/${profilePicture}`
    : null;

  const handleUpdateProfilePhoto = async (filePath) => {
    const updateProfile = await import("@/services/users").then((module) => {
      return isProvider
        ? module.updateProviderProfile
        : module.updateClientProfile;
    });

    let payload = {
      profilePicture: filePath,
    };

    try {
      const response = await updateProfile(payload);
      dispatch(setUser(response?.data));
      showNotification({
        message: "Success",
        description: generateSuccessMessage("Profile photo", "update"),
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
      setUploading(false);
    }
  };

  return (
    <>
      <h5 className="mb-3 text-center font-bold text-black">Profile</h5>
      <ImgCrop
        rotationSlider
        quality={1}
        modalOk="Upload"
        modalTitle="Edit Photo"
        modalProps={{
          okButtonProps: {
            className:
              "bg-black hover:!bg-black/90 inline-flex flex-row items-center",
            icon: <UploadIcon height={22} width={22} />,
          },
        }}
      >
        <Upload
          name="photo"
          accept=".png, .jpg, .jpeg"
          action={`${baseApiUrl}/upload/photo`}
          maxCount={1}
          showUploadList={false}
          onChange={(info) => {
            setUploading(true);
            if (info.file.status === "done") {
              handleUpdateProfilePhoto(info.file.response.data?.uploadPath);
            }
          }}
        >
          <div className="relative rounded-full">
            {uploading && (
              <Spinner
                backgroundClassName="bg-black/40 rounded-full"
                indicator={
                  <SpinnerIcon height={24} width={24} className="text-white" />
                }
              />
            )}
            <div className="absolute -bottom-1 -right-1 z-30 flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white text-center shadow-lg">
              <CameraIcon className="text-[22px] text-black/60" />
            </div>
            <Avatar
              className={`mb-3 font-bold ${!profilePicture ? "bg-info" : ""}`}
              size="doubleExtraLarge"
              src={profilePhotoUrl}
              hasFilePath={!!profilePicture}
            >
              <h3>
                {firstName && lastName
                  ? `${firstName.toUpperCase().charAt(0)} ${lastName
                      ?.toUpperCase()
                      ?.charAt(0)}`
                  : email?.toUpperCase()?.charAt(0)}
              </h3>
            </Avatar>
          </div>
        </Upload>
      </ImgCrop>

      {fullName && <h5 className="mb-2 mt-1 font-bold">{`${fullName}`}</h5>}
      <div className="flex max-w-full flex-col items-center tracking-wide">
        <p
          className={`flex max-w-full flex-row items-center gap-x-3 leading-none ${
            !fullName ? "mt-2" : ""
          }`}
        >
          <span className="truncate text-semi-sm font-semibold">
            <Truncate text={email} />
          </span>
        </p>

        <LineDivider />

        <ul className="space-y-2.5">
          <li className="flex items-center justify-between gap-x-2 leading-normal">
            <StatusText status={emailVerified} label="Email Verificaition" />
          </li>
          <li className="flex items-center justify-between gap-x-2 leading-normal">
            <StatusText
              status={isProfileCompleted}
              label="Profile Completion"
            />
          </li>
          <li className="flex items-center justify-between gap-x-2 leading-normal">
            <StatusText
              status={accountStatus === "approved"}
              label="Account Status"
            />
          </li>
        </ul>

        <LineDivider />

        <div className="flex flex-row items-center gap-x-1.5 text-semi-sm font-semibold">
          <ClockIcon className="text-black/60" width={20} height={20} />
          <span>Joined {dayjs(createdAt).format("MMMM, YYYY")}</span>
        </div>
      </div>
    </>
  );
};

export default ProfileInformationCard;

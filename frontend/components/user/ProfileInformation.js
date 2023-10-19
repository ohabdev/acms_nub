import { Row, Col, Divider } from "antd";
import { useSelector } from "react-redux";
import Spinner from "@/components/spinner/Spinner";
import { InfoIcon } from "@/components/icons/Icons";
import {
  getYearsOfPracticeValue,
  getAppearanceAvailabilityValue,
} from "@/utils/helpers/transformationHelper";
import { capitalizeFirstLetter } from "@/utils/helpers/transformationHelper";

const ProfileInformation = () => {
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.app);

  const userDetails =
    user?.role === "process_server" ? user["processServer"] : user[user?.role];

  return (
    <>
      <div className="relative flex h-fit w-full flex-col rounded bg-white p-4 shadow-md ring-1 ring-gray-900/5">
        {!!loading && <Spinner />}
        <div className="flex items-center justify-center gap-2">
          <h5 className="text-center font-bold text-black">
            Profile Information
          </h5>
          <span className="leading-none text-primary">
            <InfoIcon height={25} width={20} />
          </span>
        </div>

        <Divider className="my-2" />

        <Row gutter={16}>
          <Col span={24} sm={{ span: 12 }} md={{ span: 24 }} lg={{ span: 12 }}>
            <ul className="!mt-0 list-none break-words pl-0 xs:!mb-0 md:!mb-0">
              <li>
                <p className="pt-2 font-bold text-black/80">Name</p>
                <p className="border-b pb-2 text-sm">
                  <span className="text-black/60">
                    {user?.firstName} {user?.lastName}
                  </span>
                </p>
              </li>
              <li>
                <p className="pt-2 font-bold text-black/80">Email </p>
                <p className="border-b pb-2 text-sm">
                  <span className="text-black/60">{user?.email}</span>
                </p>
              </li>

              {user?.role === "client" && (
                <>
                  <li>
                    <p className="pt-2 font-bold text-black/80">Phone</p>
                    <p className="border-b pb-2 text-sm">
                      <span className="text-black/60">{user?.phone}</span>
                    </p>
                  </li>
                  <li>
                    <p className=" pt-2font-bold text-black/80">Address</p>
                    <p className="border-b pb-2 text-sm">
                      <span className="text-black/60">{user?.address}</span>
                    </p>
                  </li>
                </>
              )}

              {user?.role !== "client" && (
                <>
                  <li>
                    <p className="pt-2 font-bold text-black/80">
                      Phone (Office)
                    </p>
                    <p className="border-b pb-2 text-sm">
                      <span className="text-black/60">
                        {userDetails?.phoneNumber?.office}
                      </span>
                    </p>
                  </li>

                  <li>
                    <p className="pt-2 font-bold text-black/80">Phone (Cell)</p>
                    <p className="border-b pb-2 text-sm">
                      <span className="text-black/60">
                        {userDetails?.phoneNumber?.cell}
                      </span>
                    </p>
                  </li>
                  <li>
                    <p className="pt-2 font-bold text-black/80">
                      Years of Practice
                    </p>
                    <p className="border-b pb-2 text-sm">
                      <span className="text-black/60">
                        {getYearsOfPracticeValue(userDetails?.yearsOfPractice)}
                      </span>
                    </p>
                  </li>
                </>
              )}

              {user?.role === "attorney" && (
                <li>
                  <p className="pt-2 font-bold text-black/80">
                    State Bar Number
                  </p>
                  <p className="border-b pb-2 text-sm">
                    <span className="text-black/60">
                      {userDetails?.stateBarNumber}
                    </span>
                  </p>
                </li>
              )}

              {user?.role === "attorney" && (
                <li>
                  <p className="pt-2 font-bold text-black/80">
                    Appearance Availibility
                  </p>
                  <p className="border-b pb-2 text-sm">
                    <span className="text-black/60">
                      {getAppearanceAvailabilityValue(
                        userDetails?.appearanceAvailability,
                      )}
                    </span>
                  </p>
                </li>
              )}

              {(user?.role === "paralegal" ||
                user?.role === "process_server") && (
                <li>
                  <p className="pt-2 font-bold text-black/80">
                    Scope of Services Provided
                  </p>
                  <p className="border-b pb-2 text-sm">
                    <span className="text-black/60">
                      {userDetails?.scopeOfServicesProvided
                        .map((service) => service?.name)
                        .join(", ")}
                    </span>
                  </p>
                </li>
              )}
            </ul>
          </Col>
          <Col span={24} sm={{ span: 12 }} md={{ span: 24 }} lg={{ span: 12 }}>
            <ul className="!mt-0 list-none break-words pl-0">
              <li>
                <p className="pt-2 font-bold text-black/80">Role </p>
                <p className="border-b pb-2 text-sm">
                  <span className="text-black/60">
                    {capitalizeFirstLetter(user?.role)}
                  </span>
                </p>
              </li>

              <li>
                <p className="pt-2 font-bold text-black/80">State</p>
                <p className="border-b pb-2 text-sm">
                  <span className="text-black/60">
                    {user?.role === "client"
                      ? user?.location?.state?.name
                      : userDetails?.geographicalLocations[0]?.state?.name}
                  </span>
                </p>
              </li>

              <li>
                <p className="pt-2 font-bold text-black/80">County</p>
                <p className="border-b pb-2 text-sm">
                  <span className="text-black/60">
                    {user?.role === "client"
                      ? user?.location?.county?.name
                      : userDetails?.geographicalLocations[0]?.county?.name}
                  </span>
                </p>
              </li>

              <li>
                <p className="pt-2 font-bold text-black/80">City</p>
                <p className="border-b pb-2 text-sm">
                  <span className="text-black/60">
                    {user?.role === "client"
                      ? user?.location?.city?.name
                      : userDetails?.geographicalLocations[0]?.city?.name}
                  </span>
                </p>
              </li>

              {user?.role === "client" && (
                <li>
                  <p className="pt-2 font-bold text-black/80">Zip Code</p>
                  <p className="border-b pb-2 text-sm">
                    <span className="text-black/60">
                      {user?.location?.zipCode}
                    </span>
                  </p>
                </li>
              )}

              {(user?.role === "attorney" || user?.role === "paralegal") && (
                <li>
                  <p className="pt-2 font-bold text-black/80">Office Address</p>
                  <p className="border-b pb-2 text-sm">
                    <span className="text-black/60">
                      {userDetails?.officeAddress}
                    </span>
                  </p>
                </li>
              )}

              {(user?.role === "attorney" || user?.role === "paralegal") && (
                <li>
                  <p className="pt-2 font-bold text-black/80">Practice Areas</p>
                  <p className="border-b pb-2 text-sm">
                    <span className="text-black/60">
                      {userDetails?.practiceAreas
                        .map((practiceArea) => practiceArea?.name)
                        .join(", ")}
                    </span>
                  </p>
                </li>
              )}
            </ul>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ProfileInformation;

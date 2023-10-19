import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import getConfig from "next/config";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Avatar from "@/components/avatar/Avatar";

let UserIcon, SettingsIcon, LogoutIcon;

const menuStyle = {
  boxShadow: "none",
};

const refresh = () => {
  if (typeof location !== "undefined") {
    location.href = "/";
  }
};

const Dropdown = dynamic(() =>
  import("antd").then((module) => module.Dropdown),
);
const Input = dynamic(() => import("antd").then((module) => module.Input));
const ConfigProvider = dynamic(() => import("antd/lib/config-provider"));
const SearchIcon = dynamic(() =>
  import("@/components/icons/Icons").then((module) => module.SearchIcon),
);
const CloseOutlined = dynamic(() =>
  import("@ant-design/icons/lib/icons/CloseOutlined"),
);

const { publicRuntimeConfig } = getConfig();
const { baseFileUrl } = publicRuntimeConfig;

const getDropdownMenuItems = (user, handleLogout) => {
  const { firstName, lastName, email, profilePicture } = user || {};
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : "";

  const profilePhotoUrl = profilePicture
    ? `${baseFileUrl}/${profilePicture}`
    : null;

  return [
    {
      key: 1,
      label: (
        <div className="flex items-center font-bold">
          <Avatar
            className={`!rounded ${!profilePicture ? "bg-info" : ""}`}
            src={profilePhotoUrl}
            hasFilePath={!!profilePicture}
          >
            {firstName
              ? firstName.toUpperCase().charAt(0)
              : email?.toUpperCase()?.charAt(0)}
          </Avatar>
          <div className="flex max-w-[170px] flex-col gap-y-0.5 truncate pl-3 leading-4">
            <h4 className="truncate text-sm">{fullName}</h4>
            <p className="truncate text-[13px] text-black/60">{email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <Link href="/user/profile" className="inline-flex gap-2 leading-normal">
          {UserIcon && <UserIcon width="20" height="20" />}
          Profile
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Link
          href="/user/settings"
          className="inline-flex gap-2 leading-normal"
        >
          {SettingsIcon && <SettingsIcon width="24" height="24" />}
          Settings
        </Link>
      ),
    },
    {
      key: "4",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex gap-2 leading-normal"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          {LogoutIcon && <LogoutIcon width="20" height="20" fill="#7f7f7f" />}
          Sign Out
        </a>
      ),
    },
  ];
};

const NavigationBar = () => {
  const { user } = useSelector((state) => state.auth);
  const isProvider = user?.role?.isProvider;

  const router = useRouter();
  const [searchValue, setSearchValue] = useState(router.query?.q);
  const [importingStatus, setImportingStatus] = useState("idle");
  const isShallow = router.pathname === "/" ? true : false;

  const { firstName, email, profilePicture } = user;
  const profilePhotoUrl = profilePicture
    ? `${baseFileUrl}/${profilePicture}`
    : null;

  const handleLogout = () => {
    router.push(`/logout`);
  };

  const handleSearch = (searchText) => {
    if (searchText && searchText?.trim() !== "") {
      const urlObject = {
        pathname: `/`,
        query: { ...router.query, q: searchValue?.trim() },
      };

      router.push(urlObject, undefined, { shallow: isShallow });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setSearchValue(router.query?.q);
    }, 500);
  }, [router.query?.q]);

  const onSearchValueChange = (event) => {
    if (event.type === "click") {
      setSearchValue("");
      const { q, ...rest } = router.query;
      const urlObject = { pathname: "/", query: { ...rest } };
      router.push(urlObject, undefined, { shallow: isShallow });
    } else {
      setSearchValue(event.target.value);
    }
  };

  return (
    <div className="mx-auto w-full px-2 md:px-0">
      <div className="flex flex-row items-center justify-between">
        <div className="flex basis-1/2 flex-row items-center gap-x-3">
          <img
            src="/acms_logo.png"
            alt="acms"
            className="h-auto max-w-[30px] cursor-pointer sm:max-w-[40px] md:max-w-[50px] lg:max-w-[60px]"
            onClick={() => {
              if (router.pathname === "/") {
                refresh();
              } else {
                const urlObject = { pathname: "/", query: {} };
                router.push(urlObject, undefined, { shallow: isShallow });
              }
            }}
          />

          {user && !isProvider && (
            <Input
              allowClear={{
                clearIcon: <CloseOutlined className="text-black/50" />,
              }}
              className="w-full max-w-[450px]"
              placeholder="Search a lawyer by type/region etc."
              suffix={
                <span
                  className="cursor-pointer text-black/50"
                  onClick={() => {
                    handleSearch(searchValue);
                  }}
                >
                  <SearchIcon />
                </span>
              }
              value={searchValue}
              onChange={onSearchValueChange}
              onPressEnter={(event) => {
                handleSearch(event.target.value);
              }}
            />
          )}
        </div>

        {user ? (
          <ConfigProvider
            theme={{
              token: {
                motion: false,
              },
            }}
          >
            <Dropdown
              arrow
              menu={{
                items:
                  importingStatus === "fulfilled"
                    ? getDropdownMenuItems(user, handleLogout)
                    : [],
              }}
              trigger="click"
              dropdownRender={(menu) => (
                <div className="my-1 w-[230px] min-w-[120px] rounded bg-white p-0 !py-0 font-semibold text-black shadow">
                  {React.cloneElement(menu, {
                    style: menuStyle,
                  })}
                </div>
              )}
              overlayClassName="bg-white"
            >
              <a
                onClick={async (event) => {
                  event.preventDefault();
                  setImportingStatus("pending");
                  // prettier-ignore
                  {
                    UserIcon = (await import("@/components/icons/Icons")).UserIcon;
                    SettingsIcon = (await import("@/components/icons/Icons")).SettingsIcon;
                    LogoutIcon = (await import("@/components/icons/Icons")).LogoutIcon;
                  }
                  setImportingStatus("fulfilled");
                }}
              >
                <Avatar
                  className={`font-bold ${!profilePicture ? "bg-info" : ""}`}
                  src={profilePhotoUrl}
                  hasFilePath={!!profilePicture}
                >
                  {firstName
                    ? firstName.toUpperCase().charAt(0)
                    : email?.toUpperCase()?.charAt(0)}
                </Avatar>
              </a>
            </Dropdown>
          </ConfigProvider>
        ) : null}
      </div>
    </div>
  );
};

export default NavigationBar;

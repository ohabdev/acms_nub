export const GoogleIcon = ({ height, width }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 48 48"
      height={height}
      width={width}
    >
      <defs>
        <path
          id="a"
          d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
        ></path>
      </defs>
      <clipPath id="b">
        <use overflow="visible" xlinkHref="#a"></use>
      </clipPath>
      <path fill="#FBBC05" d="M0 37V11l17 13z" clipPath="url(#b)"></path>
      <path
        fill="#EA4335"
        d="M0 11l17 13 7-6.1L48 14V0H0z"
        clipPath="url(#b)"
      ></path>
      <path
        fill="#34A853"
        d="M0 37l30-23 7.9 1L48 0v48H0z"
        clipPath="url(#b)"
      ></path>
      <path
        fill="#4285F4"
        d="M48 48L17 24l-4-3 35-10z"
        clipPath="url(#b)"
      ></path>
    </svg>
  );
};

export const FacebookIcon = ({ height, width, fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      version="1.1"
      viewBox="0 0 23.101 23.101"
      xmlSpace="preserve"
    >
      <path d="M8.258 4.458c0-.144.02-.455.06-.931.043-.477.223-.976.546-1.5.32-.522.839-.991 1.561-1.406C11.144.208 12.183 0 13.539 0h3.82v4.163h-2.797c-.277 0-.535.104-.768.309-.231.205-.35.4-.35.581v2.59h3.914c-.041.507-.086 1-.138 1.476l-.155 1.258c-.062.425-.125.819-.187 1.182h-3.462v11.542H8.258V11.558H5.742V7.643h2.516V4.458z"></path>
    </svg>
  );
};

export const BackIcon = ({ height, width }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      width={width}
      height={height}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
      />
    </svg>
  );
};

export const InfoIcon = ({ height = 25, width = 25 }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill="currentColor"
        aria-hidden="true"
        viewBox="0 0 64 64"
      >
        <path d="M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30 30-13.432 30-30S48.568 2 32 2m5 49.75H27v-24h10v24m-5-29.5a5 5 0 110-10 5 5 0 010 10"></path>
      </svg>
    </>
  );
};

export const EditIcon = ({ height = 18, width = 18 }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 20 20"
      >
        <path
          fill="currentColor"
          d="M14.846 1.403l3.752 3.753.625-.626A2.653 2.653 0 0015.471.778l-.625.625zm2.029 5.472l-3.752-3.753L1.218 15.028 0 19.998l4.97-1.217L16.875 6.875z"
        ></path>
      </svg>
    </>
  );
};

export const UserIcon = ({ height = 18, width = 18 }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill="none"
        viewBox="0 0 24 24"
      >
        <g
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </g>
      </svg>
    </>
  );
};

export const SettingsIcon = ({
  height = 18,
  width = 18,
  fill = "currentColor",
}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.25"
        viewBox="0 0 24 24"
      >
        <g fill={fill} fillRule="evenodd" clipRule="evenodd">
          <path d="M13.354 8.75H4a.75.75 0 010-1.5h9.354a2.751 2.751 0 015.293 0H20a.75.75 0 010 1.5h-1.354a2.751 2.751 0 01-5.293 0zM14.75 8a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zM10.646 16.75H20a.75.75 0 000-1.5h-9.354a2.751 2.751 0 00-5.292 0H4a.75.75 0 000 1.5h1.354a2.751 2.751 0 005.292 0zM6.75 16a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0z"></path>
        </g>
      </svg>
    </>
  );
};

export const LogoutIcon = ({
  height = 18,
  width = 18,
  fill = "currentColor",
  className,
}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill="none"
        viewBox="0 0 24 24"
        className={className}
        stroke="currentColor"
      >
        <path
          fill={fill}
          d="M13 4.009a1 1 0 10-2-.001l-.003 8.003a1 1 0 002 .001L13 4.01z"
        ></path>
        <path
          fill={fill}
          d="M4 12.992c0-2.21.895-4.21 2.343-5.657l1.414 1.414a6 6 0 108.485 0l1.415-1.414A8 8 0 114 12.992z"
        ></path>
      </svg>
    </>
  );
};

export const NextIcon = ({
  height = 18,
  width = 18,
  fill = "currentColor",
  stroke = "currentColor",
}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill={fill}
        stroke={stroke}
        version="1.1"
        viewBox="0 0 512 512"
        xmlSpace="preserve"
      >
        <path d="M505.183 239.544L388.819 123.179a23.276 23.276 0 00-25.363-5.046 23.275 23.275 0 00-14.367 21.501v93.092H23.273C10.42 232.727 0 243.147 0 256s10.42 23.273 23.273 23.273h325.818v93.091a23.27 23.27 0 0014.367 21.501 23.259 23.259 0 0025.361-5.046l116.364-116.364c9.09-9.087 9.09-23.822 0-32.911z"></path>
      </svg>
    </>
  );
};

export const PreviousIcon = ({
  height = 18,
  width = 18,
  fill = "currentColor",
  stroke = "currentColor",
}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill={fill}
        stroke={stroke}
        transform="rotate(180)"
        version="1.1"
        viewBox="0 0 512 512"
        xmlSpace="preserve"
      >
        <path d="M505.183 239.544L388.819 123.179a23.276 23.276 0 00-25.363-5.046 23.275 23.275 0 00-14.367 21.501v93.092H23.273C10.42 232.727 0 243.147 0 256s10.42 23.273 23.273 23.273h325.818v93.091a23.27 23.27 0 0014.367 21.501 23.259 23.259 0 0025.361-5.046l116.364-116.364c9.09-9.087 9.09-23.822 0-32.911z"></path>
      </svg>
    </>
  );
};

export const SearchIcon = ({
  height = 18,
  width = 18,
  stroke = "currentColor",
}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill="none"
        viewBox="0 0 24 24"
      >
        <g>
          <path
            stroke={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 15l6 6m-11-4a7 7 0 110-14 7 7 0 010 14z"
          ></path>
        </g>
      </svg>
    </>
  );
};

export const SpinnerIcon = ({
  height = 18,
  width = 18,
  fill = "currentColor",
  stroke = "currentColor",
  className = "",
}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill={fill}
        stroke={stroke}
        className={`${className} animate-spin`}
        viewBox="0 0 20 20"
      >
        <path d="M10 1v2a7 7 0 11-7 7H1a9 9 0 109-9z"></path>
      </svg>
    </>
  );
};

export const EmailIcon = ({
  height = 18,
  width = 18,
  fill = "currentColor",
  stroke = "currentColor",
  className = "",
}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill={fill}
        stroke={stroke}
        className={className}
        viewBox="0 0 32 32"
      >
        <path d="M28 4.25H4A2.754 2.754 0 001.25 7v18A2.754 2.754 0 004 27.75h24A2.754 2.754 0 0030.75 25V7A2.754 2.754 0 0028 4.25zM4 5.75h24a1.237 1.237 0 011.18.904l.002.009L16 16.079 2.818 6.663a1.238 1.238 0 011.181-.913H4zm24 20.5H4A1.252 1.252 0 012.75 25V8.457l12.814 9.153c.014.01.032.006.046.015.108.073.24.118.382.123h.001l.005.002H16l.005-.002a.74.74 0 00.386-.125l-.003.002c.014-.009.032-.005.046-.015l12.814-9.153V25a1.252 1.252 0 01-1.25 1.25z"></path>
      </svg>
    </>
  );
};

export const CheckCircleIcon = ({
  className = "",
  fill = "currentColor",
  height = 18,
  width = 18,
}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill="none"
        viewBox="0 0 24 24"
      >
        <g>
          <path
            fill="#4cd964"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            opacity="0.1"
          ></path>
          <path
            stroke="#4cd964"
            strokeWidth="2"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
          <path
            stroke="#4cd964"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l1.683 1.683v0c.175.175.459.175.634 0v0L15 10"
          ></path>
        </g>
      </svg>
    </>
  );
};

export const WarningCircleIcon = ({
  className = "",
  fill = "currentColor",
  stroke = "currentColor",
  height = 18,
  width = 18,
}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill="none"
        stroke={stroke}
        strokeWidth="0.25"
        className={className}
        viewBox="0 0 24 24"
      >
        <g fill={fill}>
          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.15"></path>
          <path d="M12.75 7a.75.75 0 00-1.5 0h1.5zm-1.5 7a.75.75 0 001.5 0h-1.5zm1.5 2.99a.75.75 0 00-1.5 0h1.5zm-1.5.01a.75.75 0 001.5 0h-1.5zm0-10v7h1.5V7h-1.5zm0 9.99V17h1.5v-.01h-1.5zm9-4.99A8.25 8.25 0 0112 20.25v1.5c5.385 0 9.75-4.365 9.75-9.75h-1.5zM12 20.25A8.25 8.25 0 013.75 12h-1.5c0 5.385 4.365 9.75 9.75 9.75v-1.5zM3.75 12A8.25 8.25 0 0112 3.75v-1.5c-5.385 0-9.75 4.365-9.75 9.75h1.5zM12 3.75A8.25 8.25 0 0120.25 12h1.5c0-5.385-4.365-9.75-9.75-9.75v1.5z"></path>
        </g>
      </svg>
    </>
  );
};

export const ClockIcon = ({
  className = "",
  fill = "currentColor",
  height = 18,
  width = 18,
}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill="none"
        className={className}
        viewBox="0 0 24 24"
      >
        <path
          fill={fill}
          fillRule="evenodd"
          d="M2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0zM12 .5C5.649.5.5 5.649.5 12S5.649 23.5 12 23.5 23.5 18.351 23.5 12 18.351.5 12 .5zM11 7a1 1 0 112 0v5h4a1 1 0 110 2h-5a1 1 0 01-1-1V7z"
          clipRule="evenodd"
        ></path>
      </svg>
    </>
  );
};

export const CameraIcon = ({
  className = "",
  fill = "currentColor",
  height = 18,
  width = 18,
}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill="none"
        className={className}
        viewBox="0 0 24 24"
      >
        <path
          fill={fill}
          fillRule="evenodd"
          d="M7.342 4.985c.422-.724.633-1.085.927-1.348a2.5 2.5 0 01.898-.516C9.542 3 9.96 3 10.797 3h2.405c.838 0 1.256 0 1.631.121a2.5 2.5 0 01.898.516c.294.263.505.624.927 1.348L17.25 6H18c1.4 0 2.1 0 2.635.272a2.5 2.5 0 011.092 1.093C22 7.9 22 8.6 22 10v6c0 1.4 0 2.1-.273 2.635a2.5 2.5 0 01-1.092 1.092C20.1 20 19.4 20 18 20H6c-1.4 0-2.1 0-2.635-.273a2.5 2.5 0 01-1.093-1.092C2 18.1 2 17.4 2 16v-6c0-1.4 0-2.1.272-2.635a2.5 2.5 0 011.093-1.093C3.9 6 4.6 6 6 6h.75l.592-1.015zM12 17.05a4.75 4.75 0 100-9.5 4.75 4.75 0 000 9.5zm2.7-4.75a2.7 2.7 0 11-5.4 0 2.7 2.7 0 015.4 0z"
          clipRule="evenodd"
        ></path>
      </svg>
    </>
  );
};

export const PlusIcon = ({
  height = 18,
  width = 18,
  fill = "currentColor",
  className = "",
}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        className={className}
        viewBox="0 -0.5 9 9"
      >
        <g>
          <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
            <g fill={fill} transform="translate(-345 -206)">
              <g transform="translate(56 160)">
                <path d="M298 49L298 51 294.625 51 294.625 54 292.375 54 292.375 51 289 51 289 49 292.375 49 292.375 46 294.625 46 294.625 49z"></path>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </>
  );
};

export const DeleteIcon = ({
  height = 18,
  width = 18,
  fill = "currentColor",
  stroke = "currentColor",
  className = "",
}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill={fill}
        stroke={stroke}
        className={className}
        version="1.1"
        viewBox="0 0 100 100"
        xmlSpace="preserve"
      >
        <g>
          <path d="M75.834 33.388h-51.67a2.372 2.372 0 00-2.375 2.373v49.887a2.376 2.376 0 002.375 2.377h51.67a2.374 2.374 0 002.375-2.377V35.76a2.37 2.37 0 00-2.375-2.372zM79.004 17.352H59.402v-2.999a2.373 2.373 0 00-2.373-2.377H42.971a2.375 2.375 0 00-2.375 2.377v2.999h-19.6a2.372 2.372 0 00-2.375 2.373v6.932a2.372 2.372 0 002.375 2.373h58.008a2.37 2.37 0 002.375-2.373v-6.932a2.37 2.37 0 00-2.375-2.373z"></path>
        </g>
      </svg>
    </>
  );
};

export const UploadIcon = ({
  height = 18,
  width = 18,
  fill = "currentColor",
  className = "",
}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill={fill}
        className={className}
        viewBox="0 0 24 24"
      >
        <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"></path>
      </svg>
    </>
  );
};

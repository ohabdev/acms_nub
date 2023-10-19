import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";
import { SearchIcon } from "@/components/icons/Icons";

const Empty = ({
  className,
  title = "No results found",
  subTitle = "Try different keywords or clear search filters",
}) => {
  return (
    <div
      className={twMerge(
        "flex h-full flex-col items-center justify-center text-black/70",
        className,
      )}
    >
      <SearchIcon height={48} width={48} />
      <h3 className="my-3 font-bold">{title}</h3>
      {subTitle && (
        <p className="text-base font-semibold">
          Try different keywords or clear search filters
        </p>
      )}
    </div>
  );
};

Empty.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
};

export default Empty;

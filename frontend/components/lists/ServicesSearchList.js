import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import queryString from "query-string";
import ServicesSearchListItem from "@/components/list-items/ServicesSearchListItem";
import ServicesSearchFilterForm from "@/components/forms/ServicesSearchFilter";
import Spinner from "@/components/spinner/Spinner";
import Empty from "@/components/empty/Empty";
import useFeedback from "@/utils/hooks/useFeedback";
import usePrevious from "@/utils/hooks/usePrevious";
import { searchServices } from "@/services/search";
import {
  getAllServiceTypes,
  getAllSubServiceTypes,
  getAllStates,
  getAllCounties,
  getAllCities,
} from "@/services/utils";
import { generateOptions } from "@/utils/helpers/transformationHelper";
import {
  FAILED_FETCH_ERROR_MESSAGE,
  PROVIDER_ROLES,
  PROVIDER_SLUGS,
} from "@/constants/constants";

const SpinnerIcon = dynamic(() =>
  import("@/components/icons/Icons").then((module) => module.SpinnerIcon),
);

const Pagination = dynamic(() =>
  import("antd").then((module) => module.Pagination),
);

const ClearFilters = ({ onClick }) => {
  return (
    <span
      className="cursor-pointer text-semi-sm font-semibold tracking-wide text-primary"
      role="button"
      onClick={onClick}
    >
      Clear
    </span>
  );
};

const initialValues = {
  serviceTypeIds: [],
  subServiceTypeIds: [],
  stateId: null,
  countyId: null,
  cityId: null,
};

const qsOptions = {
  arrayFormat: "comma",
  encode: false,
  skipEmptyString: true,
  skipNull: true,
};

const limit = 5;
let abortController;

const ServicesSearchList = () => {
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [serviceTypesLoading, setServiceTypesLoading] = useState(true);
  const [subServiceTypesLoading, setSubServiceTypesLoading] = useState(true);
  const [statesLoading, setStatesLoading] = useState(true);
  const [countiesLoading, setCountiesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState();

  const [servicesList, setServicesList] = useState([]);
  const [providerOptions, setProviderOptions] = useState(PROVIDER_ROLES);
  const [subServiceTypesOptions, setSubServiceTypesOptions] = useState([]);
  const [states, setStates] = useState([]);
  const [counties, setCounties] = useState([]);
  const [cities, setCities] = useState([]);

  const [formValues, setFormValues] = useState(initialValues);
  const [showClearFiltersOption, setShowClearFiltersOption] = useState(false);
  const [showEmptyResponseFeedback, setShowEmptyResponseFeedback] =
    useState(false);
  const [showFormLoader, setShowFormLoader] = useState(true);
  const [hasError, setHasError] = useState(false);

  const router = useRouter();
  const { showNotification } = useFeedback();
  const containerRef = useRef();
  const queryParams = router.query;

  const prevRouterQuery = usePrevious(router.query);
  const prevCurrentPage = usePrevious(currentPage);

  const prevParams = useMemo(() => {
    return { ...prevRouterQuery, page: prevCurrentPage };
  }, [prevRouterQuery, prevCurrentPage]);

  const currentParams = useMemo(() => {
    return { ...router.query, page: currentPage };
  }, [router.query, currentPage]);

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

  useEffect(() => {
    if (router.isReady) setCurrentPage(1);
  }, [router.isReady, router.query]);

  const fetchAllServiceTypes = useCallback(async () => {
    try {
      const response = await getAllServiceTypes({ page: 0, limit: 20 });
      const filteredResponse = response?.data?.rows?.filter((row) =>
        PROVIDER_SLUGS.includes(row?.slug?.toLowerCase()),
      );
      setProviderOptions(
        filteredResponse?.sort((a, b) => a?.name?.localeCompare(b?.name)),
      );
    } catch (error) {
      notifyError(error);
    } finally {
      setServiceTypesLoading(false);
    }
  }, [notifyError]);

  const fetchAllSubServiceTypes = useCallback(async () => {
    try {
      const response = await getAllSubServiceTypes({ page: 0, limit: 50 });
      setSubServiceTypesOptions(
        generateOptions(response?.data?.rows, true, true),
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

  const fetchServices = useCallback(
    async (page = 1, queryParams) => {
      if (abortController) abortController.abort();
      abortController = new AbortController();

      setFetching(true);
      try {
        const response = await searchServices(page - 1, limit, queryParams, {
          signal: abortController.signal,
        });
        setServicesList(response.data?.rows);
        setTotal(response.data?.count);
        setShowEmptyResponseFeedback(() => {
          return response.data?.rows?.length === 0 ? true : false;
        });

        abortController = undefined;

        if (typeof window !== "undefined") {
          window.scrollTo({
            top: containerRef.current.offsetTop,
            behavior: "smooth",
          });
        }
        setLoading(false);
        setFetching(false);
        setHasError(false);
      } catch (error) {
        if (error && error?.code !== "ERR_CANCELED") {
          setHasError(true);
          notifyError(error);
          setLoading(false);
          setFetching(false);
        }
      }
    },
    [notifyError],
  );

  useEffect(() => {
    if (typeof location !== "undefined") {
      const { search } = location;
      const parsed = queryString.parse(search, { arrayFormat: "comma" });
      const serviceTypeIds =
        parsed?.serviceTypeIds === undefined
          ? []
          : typeof parsed?.serviceTypeIds === "string"
          ? parsed?.serviceTypeIds?.trim()?.split(",")
          : parsed?.serviceTypeIds;

      const subServiceTypeIds =
        typeof parsed?.subServiceTypeIds === "string"
          ? parsed?.subServiceTypeIds?.trim()?.split(",")
          : parsed?.subServiceTypeIds;

      const stateId =
        typeof parsed?.stateId === "undefined" ? null : parsed?.stateId;

      const countyId =
        typeof parsed?.countyId === "undefined" ? null : parsed?.countyId;

      const cityId =
        typeof parsed?.cityId === "undefined" ? null : parsed?.cityId;

      setFormValues({
        ...initialValues,
        serviceTypeIds,
        subServiceTypeIds,
        stateId,
        countyId,
        cityId,
      });
    }
  }, [queryParams]);

  useEffect(() => {
    if (typeof location !== "undefined") {
      const { search } = location;
      const formObjectKeys = Object.keys(initialValues);
      const urlParams = queryString.pick(
        search,
        ["q", ...formObjectKeys],
        qsOptions,
      );
      const filterParams = queryString.exclude(urlParams, ["q"], qsOptions);
      setShowClearFiltersOption(() => {
        return filterParams ? true : false;
      });
    }
  }, [formValues]);

  useEffect(() => {
    const { page, ...rest } = currentParams;
    const skip = JSON.stringify(prevParams) === JSON.stringify(currentParams);

    if (router.isReady && !skip) {
      fetchServices(page, { ...rest });
    }
  }, [fetchServices, router.isReady, prevParams, currentParams]);

  useEffect(() => {
    fetchAllServiceTypes();
    fetchAllSubServiceTypes();
    fetchStates();
  }, [fetchAllServiceTypes, fetchAllSubServiceTypes, fetchStates]);

  useEffect(() => {
    if (router.query?.stateId) {
      fetchCounties({ stateId: router.query?.stateId });
    }
  }, [fetchCounties, router.query?.stateId]);

  useEffect(() => {
    if (router.query?.countyId) {
      fetchCities({ countyId: router.query?.countyId });
    }
  }, [fetchCities, router.query?.countyId]);

  useEffect(() => {
    if (!serviceTypesLoading && !subServiceTypesLoading) {
      setTimeout(() => {
        setShowFormLoader(false);
      }, 650);
    }
  });

  const clearFilters = () => {
    setCurrentPage(1);
    setFormValues(initialValues);
    setCounties([]);
    setCities([]);
    if (typeof location !== "undefined") {
      const { search } = location;
      const query = queryString.pick(search, ["q"], qsOptions);
      const redirectUrl = query ? `/${query}` : "/";
      router.push(redirectUrl, undefined, { shallow: true });
    }
  };

  return (
    <div className="mx-auto h-full">
      <div className="fixed hidden min-h-[300px] w-[150px] rounded bg-white shadow ring-1 ring-gray-900/5 xs:block sm:max-w-[150px] md:w-[180px] md:max-w-[180px] lg:w-[250px] lg:max-w-[250px]">
        {showFormLoader && (
          <Spinner
            backgroundClassName="bg-white"
            indicator={
              <SpinnerIcon height={24} width={24} className="text-primary" />
            }
          />
        )}
        <div className="flex flex-row items-baseline justify-between border-b border-secondary/25 px-4 py-2">
          <h6 className="font-bold">Filter By</h6>
          {showClearFiltersOption && <ClearFilters onClick={clearFilters} />}
        </div>
        <div className="px-4 pb-3 pt-2">
          <ServicesSearchFilterForm
            formValues={formValues}
            prevParams={prevParams}
            providerOptions={providerOptions}
            subServiceTypesOptions={subServiceTypesOptions}
            states={states}
            counties={counties}
            cities={cities}
            setCities={setCities}
            setCurrentPage={setCurrentPage}
            setFormValues={setFormValues}
          />
        </div>
      </div>

      <div className="relative ml-0 min-h-full pb-3 xs:ml-[165px] sm:ml-[165px] md:ml-[195px] lg:ml-[265px]">
        <div
          className={`${fetching ? "opacity-70" : ""} min-h-full [&>*]:mb-4`}
          ref={containerRef}
        >
          {(loading || (!servicesList?.length && fetching) || hasError) && (
            <Spinner
              indicator={
                <SpinnerIcon height={40} width={40} className="text-primary" />
              }
            />
          )}

          {!loading && !fetching && showEmptyResponseFeedback && (
            <Empty className="h-[calc(100vh-110px)] bg-white shadow ring-1 ring-gray-900/5" />
          )}

          {!!servicesList?.length &&
            servicesList?.map((service) => {
              return (
                <ServicesSearchListItem
                  key={service?.id}
                  loading={fetching}
                  service={service}
                />
              );
            })}
        </div>

        {!loading && total >= limit && (
          <div className="mb-3 flex justify-end bg-white p-3 shadow ring-1 ring-gray-900/5">
            <Pagination
              current={currentPage}
              defaultPageSize={limit}
              total={total}
              responsive={true}
              showSizeChanger={false}
              onChange={(page) => {
                setCurrentPage(page);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesSearchList;

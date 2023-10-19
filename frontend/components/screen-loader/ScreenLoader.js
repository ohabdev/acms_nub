const ScreenLoader = () => {
  return (
    <div id="screen-loader" className="fixed inset-0 z-100 grid place-content-center bg-white">
      <span className="relative flex h-[60px] w-[60px]">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/90 opacity-75"></span>
        <span className="relative inline-flex h-[60px] w-[60px] rounded-full bg-primary"></span>
      </span>
    </div>
  );
};

export default ScreenLoader;

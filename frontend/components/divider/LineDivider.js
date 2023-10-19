const LineDivider = ({ className = "" }) => {
  const classes = `my-3 w-full min-w-full border-t border-t-[#0505051a] ${className}`;
  return <div className={classes}></div>;
};

export default LineDivider;

const regexOptions = {
  patterns: {
    number: /^[0-9]*$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,
    phone: /^[2-9][0-9]*$/,
    space: /^(?!\s+$).*/g,
  },
};

export default regexOptions;

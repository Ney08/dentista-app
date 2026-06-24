function ToothIcon({
  size = 22,
  strokeWidth = 2,
  className = "",
  ...props
}) {

  return (

    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >

      <path
        d="M8.5 3.5C6.4 3.5 4.7 5.2 4.7 7.4c0 1.2.4 2.4 1 3.5.8 1.4 1 2.7 1.1 4.3.1 1.9.6 4.7 2.1 5.2 1.1.4 1.8-1.3 2.2-3.1.3-1.3.5-2.2.9-2.2s.6.9.9 2.2c.4 1.8 1.1 3.5 2.2 3.1 1.5-.5 2-3.3 2.1-5.2.1-1.6.3-2.9 1.1-4.3.6-1.1 1-2.3 1-3.5 0-2.2-1.7-3.9-3.8-3.9-1.1 0-2 .4-2.7.9-.6.4-1.2.4-1.8 0-.7-.5-1.6-.9-2.7-.9Z"
      />

      <path
        d="M9 7.5c.8.5 1.9.8 3 .8s2.2-.3 3-.8"
        opacity="0.7"
      />

    </svg>

  );

}

export default ToothIcon;
const API_URL = "https://dentista-backend-uspt.onrender.com";

function PageWrapper({ children }) {
  return (
    <div className="p-6 bg-gray-100">
      {children}
    </div>
  );
}

export default PageWrapper;
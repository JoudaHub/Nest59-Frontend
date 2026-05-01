import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center p-6">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-500"></div>
    </div>
  );
};

export default Spinner;
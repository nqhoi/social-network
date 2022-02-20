import React from "react";

const LoadMoreBtn = ({ result, load, page, handleLoadMore }) => {
  return (
    <>
      {result < 9 * (page - 1)
        ? ""
        : !load && (
            <button
              className="btn btn-outline-dark mx-auto d-block"
              onClick={handleLoadMore}
            >
              Load more
            </button>
          )}
    </>
  );
};

export default LoadMoreBtn;

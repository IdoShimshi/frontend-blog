import React from "react";

export type PaginationProps = {
    page: number;
    pageCount: number;
    handlePageChange: Function;
};

const Pagination: React.FC<{ props: PaginationProps }> = ({ props }) => {
    const {page,pageCount, handlePageChange} = props
    const pages = [];
    for (let i = Math.max(page - 4, 1); i <= pageCount && i <= page + 4; i++) {
        pages.push(
          <button
            key={i}
            className={i === page ? "active" : ""}
            onClick={() => handlePageChange(i)}
            disabled={i === page}
            aria-disabled={i === page}
          >
            {i}
          </button>
        );
      }

  return (
    <div>
        <button
        className={page === 1 ? "disabled" : ""}
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
        >
        &laquo;
        </button>
        {pages}
        <button
        className={page === pageCount ? "disabled" : ""}
        disabled={page === pageCount}
        onClick={() => handlePageChange(page + 1)}
        >
        &raquo;
        </button>
    </div>
  );
};

export default Pagination;

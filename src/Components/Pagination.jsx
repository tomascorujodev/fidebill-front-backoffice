export default function Pagination({ currentPage, onPageChange }){
  const handlePageChange = (pageNumber) => {
    if (pageNumber !== currentPage) {
      onPageChange(pageNumber);
    }
  };
  return (

    <div className="pagination-container d-flex justify-content-center mt-4">
      <nav aria-label="Page navigation">
        <ul className="pagination">
          <li>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
          </li>
            <p className="page-link">{currentPage}</p>
          <li>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </div>

  );
};


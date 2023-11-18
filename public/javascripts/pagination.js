export async function updatePaginationButtons() {
    const totalPages = Math.ceil(totalAvailableSearchResults / requestedNumResults);
    previousButton.disabled = currentPage === 1;


    if (currentPage === totalPages || totalAvailableSearchResults - beginningParksArray <= requestedNumResults) {
        nextButtonTop.style.display = 'none';
        nextButtonBottom.style.display = 'none';

    } else {
        nextButtonTop.style.display = 'block';
        nextButtonBottom.style.display = 'block';

    }
}
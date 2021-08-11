window.addEventListener('DOMContentLoaded', () => {
    const movieList = document.querySelectorAll('.releases__poster'),
        posters = document.querySelector('.releases__posters'),
        postersBlock = document.querySelector('.releases__posters');
    link = document.querySelectorAll('.releases__link');

    function hideMovie() {
        movieList.forEach((item) => {
            item.classList.add('releases__poster-hide');
        })
        link.forEach((item) => {
            item.classList.remove('releases__link-show');
        })
    }

    function showMovie(i) {
        link[i].classList.add('releases__link-show');
        movieList[i].classList.remove('releases__poster-hide');
    }

    function showAll() {
        movieList.forEach((item) => {
            item.classList.remove('releases__poster-hide');
        })
    }

    posters.addEventListener('mouseover', (event) => {
        const target = event.target;
        if (target && target.classList.contains('releases__poster')) {
            movieList.forEach((item, i) => {
                if (target === item) {
                    hideMovie();
                    showMovie(i);
                }
            })
        }
    });

    postersBlock.addEventListener('mouseout', (event) => {
        showAll();
    })

})
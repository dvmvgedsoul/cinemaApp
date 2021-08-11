window.addEventListener('DOMContentLoaded', () => {
    const btns = document.querySelectorAll('.maininfo__btn');
    const playTrailerBtn = document.querySelector('.maininfo__btn-trailer');
    const trailerSection = document.querySelector('.trailer');

    function toggleBtn(btn) {
        if (btn.classList.contains('maininfo__btn-add')) {
            btn.classList.remove('maininfo__btn-add');
            btn.classList.add('maininfo__btn-remove');
        } else {
            btn.classList.remove('maininfo__btn-remove');
            btn.classList.add('maininfo__btn-add');
        }
    }

    btns.forEach((btn) => {
        btn.addEventListener('click', () => {
            toggleBtn(btn);
        })
    })

    playTrailerBtn.addEventListener('click', () => {
        trailerSection.classList.remove('trailer__disabled');
        document.body.style.overflowY = 'hidden';
    })

    trailerSection.addEventListener('click', (event) => {
        const target = event.target;
        if (target && target.classList.contains('trailer')) {
            target.classList.add('trailer__disabled');
            document.body.style.overflowY = 'visible';
        }
    })
})
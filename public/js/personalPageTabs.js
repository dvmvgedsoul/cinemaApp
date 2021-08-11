window.addEventListener('DOMContentLoaded', () => {
    const tabContent = document.querySelectorAll('.profile-movies__posters');
    const tabs = document.querySelectorAll('.profile-movies__tab');
    const TabMenu = document.querySelector('.profile-movies__bar');

    function highlightTab(i) {
        tabs[i].classList.add('profile-movies__tab-active');
    }

    function downLightTab() {
        tabs.forEach((tab) => {
            tab.classList.remove('profile-movies__tab-active');
        })
    }

    function showTab(i) {
        tabContent[i].classList.remove('profile-movies__posters-hide');
    }

    function hideTab() {
        tabContent.forEach((tabGrid) => {
            tabGrid.classList.add('profile-movies__posters-hide');
        })
    }

    TabMenu.addEventListener('click', (event) => {
        const target = event.target;
        console.log('click on menu');
        if (target && target.classList.contains('profile-movies__tab')) {
            console.log('click');
            tabs.forEach((tab, i) => {
                if (target === tab) {
                    downLightTab();
                    highlightTab(i);
                    hideTab();
                    showTab(i);
                }
            })
        }
    })

    downLightTab();
    highlightTab(0);

    hideTab();
    showTab(0);
})
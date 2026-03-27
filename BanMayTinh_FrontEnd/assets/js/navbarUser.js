function updateUserNavbar() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userInfoElement = document.getElementById('user-info');
    const userAvatarElement = document.getElementById('user-avatar');
    const logoutBtn = document.getElementById('logout-btn');

    if (currentUser && currentUser.role === 'User') {
        userInfoElement.textContent = currentUser.fullname;
        userAvatarElement.src = currentUser.avatar || './assets/img/user/userdefault.webp';

        userAvatarElement.style.display = 'block';
        userInfoElement.style.display = 'block';
        logoutBtn.style.display = 'block';

        document.querySelector('.loginhome.navbar__list-item.weight-text').style.display = 'none';
        document.querySelector('.registerhome.navbar__list-item.weight-text').style.display = 'none';
    } else {
        document.querySelector('.loginhome.navbar__list-item.weight-text').style.display = 'block';
        document.querySelector('.registerhome.navbar__list-item.weight-text').style.display = 'block';

        userAvatarElement.style.display = 'none';
        userInfoElement.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
}
window.onload = function () {
    updateUserNavbar();
};
function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'home.html';
}
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutUser);
}
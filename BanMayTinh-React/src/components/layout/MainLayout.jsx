import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function MainLayout() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  function onSearch(e) {
    e.preventDefault();
    const keyword = q.trim();
    navigate(keyword ? `/san-pham?keyword=${encodeURIComponent(keyword)}` : '/san-pham');
  }

  return (
    <div className="app">
      <header className="header">
        <div className="grid">
          <nav className="navbar">
            <ul className="navbar__list">
              <li className="navbar__list-item upper-text separate">
                <i className="navbar__icon fa-solid fa-phone navbar__icon--nopointer"></i>
                <span className="navbar-title--nopointer">
                  Hotline: 0963 541 319 | Build PC: 0963 541 319 | Giao hàng nhanh chóng
                </span>
              </li>
              <li className="navbar__list-item separate">
                <i className="navbar__icon fa-solid fa-location-dot navbar__icon--nopointer"></i>
                <span className="navbar-title--nopointer">Nhân Hòa, Mỹ Hào, Hưng Yên</span>
              </li>
              <li className="navbar__list-item">
                <span className="navbar-title--nopointer">Kết nối</span>
                <a className="navbar__list-icon-link" href="#">
                  <i className="navbar__icon navbar__icon-blur fa-brands fa-facebook"></i>
                </a>
                <a className="navbar__list-icon-link" href="#">
                  <i className="navbar__icon navbar__icon-blur fa-brands fa-instagram"></i>
                </a>
              </li>
            </ul>
            <ul className="navbar__list">
              <li className="navbar__list-item navbar__list-item--has-notify">
                <a className="navbar__list-item-link" href="#">
                  <i className="navbar__icon fa-solid fa-bell"></i>
                  Thông báo
                </a>
                <div className="navbar__notify">
                  <header className="navbar__notify-header">
                    <h3>Thông báo mới nhất</h3>
                  </header>
                  <ul className="navbar__notify-list"></ul>
                  <footer className="navbar__notify-footer">
                    <a href="#" className="navbar__notify-footer-btn">
                      Xem tất cả
                    </a>
                  </footer>
                </div>
              </li>
              <li className="navbar__list-item">
                <a className="navbar__list-item-link" href="#">
                  <i className="navbar__icon fa-regular fa-circle-question"></i>Trợ giúp
                </a>
              </li>
              {isAuthenticated ? (
                <>
                  <li id="user-info" className="user-info">
                    {user?.userName}
                  </li>
                  <li className="navbar__list-item weight-text" id="logout-btn" onClick={logout}>
                    Đăng xuất
                  </li>
                </>
              ) : (
                <>
                  <li className="registerhome navbar__list-item weight-text separate">Đăng ký</li>
                  <li className="loginhome navbar__list-item weight-text">
                    <Link className="link-login" to="/dang-nhap">
                      Đăng nhập
                    </Link>
                  </li>
                </>
              )}
              {isAdmin && (
                <li className="navbar__list-item weight-text">
                  <Link className="link-login" to="/admin">
                    Admin
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="header-with-search">
            <div className="header__logo">
              <Link to="/">
                {/* Nếu bạn muốn dùng logo cũ, copy ảnh vào public/assets rồi đổi src */}
                <img
                  className="header__logo-img"
                  src="https://placehold.co/200x60?text=BanMayTinh"
                  alt="BanMayTinh"
                />
              </Link>
            </div>
            <form className="header__search" onSubmit={onSearch}>
              <div className="header__search-input-wrap">
                <input
                  className="header__search-input"
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <button className="header__search-btn" type="submit">
                <i className="header__search-btn-icon fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
            <div className="header__cart">
              <Link to="/gio-hang">
                <i className="header__cart-icon fa-solid fa-cart-arrow-down"></i>
                <span className="cart-items">0</span>
              </Link>
            </div>
          </div>

          <div className="header__bottom">
            <ul className="header__bottom-links">
              <li>
                <Link to="/">
                  <i className="menu-icon-right fa-solid fa-house"></i>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/san-pham">
                  <i className="fa-solid fa-cart-shopping"></i>
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/gioi-thieu">
                  <i className="fa-solid fa-share"></i>
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/lien-he">
                  <i className="fa-solid fa-phone"></i>
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="grid">
          <div className="grid__row">
            <div className="grid__column-2-4">
              <h3 className="footer__heading">BanMayTinh</h3>
              <p className="contact-list">
                <b>Điện thoại:</b> <a href="tel:0963541319">0963 541 319</a>
                <br />
                <b>Email:</b> <a href="mailto:long17042005@gmail.com">long17042005@gmail.com</a>
                <br />
                <b>Địa chỉ:</b> Nhân hòa - Mỹ Hào - Hưng Yên
              </p>
            </div>
            <div className="grid__column-2-4">
              <h3 className="footer__heading">Về chúng tôi</h3>
              <ul className="footer-list">
                <li className="footer-item">
                  <Link to="/gioi-thieu" className="footer-item__link">
                    Giới thiệu
                  </Link>
                </li>
                <li className="footer-item">
                  <Link to="/san-pham" className="footer-item__link">
                    Sản phẩm
                  </Link>
                </li>
                <li className="footer-item">
                  <Link to="/lien-he" className="footer-item__link">
                    Liên hệ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="grid__row">
            <div className="footer-copyright">
              © {new Date().getFullYear()} BanMayTinh. Thiết kế UI theo bản `BanMayTinh_FrontEnd`.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

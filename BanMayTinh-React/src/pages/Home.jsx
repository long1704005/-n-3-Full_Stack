import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import ProductCard from '../components/product/ProductCard';

const SLIDES = [
  'https://theme.hstatic.net/1000288298/1001020793/14/banner_top_1_img.jpg',
  'https://file.hstatic.net/1000288298/collection/2_a5fa602851954e68bdb6ea34b3174b9e.png',
  'https://file.hstatic.net/1000288298/collection/2473551-ryzen-8000-7-hero-banner_59d7c39e0d2d4ac9a0cfcbaf29046a12.jpg',
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    productApi
      .getAll({ page: 1, pageSize: 200 })
      .then((r) => setProducts(r.data || []))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSlideIndex((i) => (i + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, []);

  const featured = useMemo(
    () => products.filter((p) => p.isFeatured).slice(0, 5),
    [products]
  );
  const newest = useMemo(
    () => products.filter((p) => p.isNew).slice(0, 10),
    [products]
  );
  const best = useMemo(
    () => products.filter((p) => p.isBestSeller).slice(0, 10),
    [products]
  );

  function goPrev(e) {
    e.preventDefault();
    setSlideIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  }
  function goNext(e) {
    e.preventDefault();
    setSlideIndex((i) => (i + 1) % SLIDES.length);
  }

  return (
    <>
      <div className="slider-container">
        <div className="grid">
          <div className="grid__row grid__row-sup">
            <div className="grid--full-width">
              <div className="slideshow">
                <div
                  className="slide-list"
                  style={{ transform: `translateX(-${slideIndex * 100}%)` }}
                >
                  {SLIDES.map((src, idx) => (
                    <div className="slide" key={idx}>
                      <img className="slide-img" src={src} alt={`slide-${idx}`} />
                    </div>
                  ))}
                </div>
                <div className="arrow-slide arrow--prev">
                  <a href="#" onClick={goPrev}>
                    <i className="fas fa-angle-left"></i>
                  </a>
                </div>
                <div className="slide__list-dot">
                  {SLIDES.map((_, idx) => (
                    <div
                      key={idx}
                      className={`dot-item ${idx === slideIndex ? 'active' : ''}`}
                      onClick={() => setSlideIndex(idx)}
                    ></div>
                  ))}
                </div>
                <div className="arrow-slide arrow--next">
                  <a href="#" onClick={goNext}>
                    <i className="fas fa-angle-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="app__container home">
        <div className="grid">
          <div className="grid__row grid__row-sup">
            <div className="grid--full-width">
              <div className="home-product home">
                <div className="grid--full-width home">
                  <div className="grid--full-width home">
                    <div className="header__card-products bg-white">
                      <h2 className="title-deal">Sản phẩm nổi bật</h2>
                      <Link className="view-more" to="/san-pham">
                        xem tất cả sản phẩm
                        <i className="view-more-right fa-solid fa-right-long"></i>
                      </Link>
                    </div>
                  </div>
                  <div className="home-product bd-ccc">
                    <div className="grid__row">
                      {featured.map((p) => (
                        <ProductCard key={p.id} product={p} variant="home" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid--full-width">
              <div className="home-product home">
                <div className="grid--full-width home">
                  <div className="grid--full-width home">
                    <div className="header__card-products bg-white">
                      <h2 className="title-deal">Sản phẩm mới nhất</h2>
                      <Link className="view-more" to="/san-pham">
                        xem tất cả sản phẩm
                        <i className="view-more-right fa-solid fa-right-long"></i>
                      </Link>
                    </div>
                  </div>
                  <div className="home-product bd-ccc">
                    <div className="grid__row">
                      {newest.map((p) => (
                        <ProductCard key={p.id} product={p} variant="home" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid--full-width">
              <div className="home-product home">
                <div className="grid--full-width home">
                  <div className="grid--full-width home">
                    <div className="header__card-products bg-white">
                      <h2 className="title-deal">Sản phẩm bán chạy</h2>
                      <Link className="view-more" to="/san-pham">
                        xem tất cả sản phẩm
                        <i className="view-more-right fa-solid fa-right-long"></i>
                      </Link>
                    </div>
                  </div>
                  <div className="home-product bd-ccc">
                    <div className="grid__row">
                      {best.map((p) => (
                        <ProductCard key={p.id} product={p} variant="home" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function LienHe() {
  return (
    <section className="app__container mt-header">
      <div className="grid">
        <div className="grid__row">
          <div className="grid--full-width">
            <div className="bg-white pl-pr-20 mt-16 mb-16">
              <div className="pd-15">
                <h1 className="page-title">Liên hệ</h1>
                <div className="page-content hidden">
                  <div className="contact-wrap">
                    <div className="contact">
                      <h1>Gửi tin nhắn cho chúng tôi</h1>
                      <div className="form-contact">
                        <div className="group-contact">
                          <input type="text" placeholder="Tên của bạn" />
                        </div>
                        <div className="group-contact">
                          <input type="text" placeholder="Email của bạn" />
                        </div>
                        <div className="group-contact">
                          <textarea placeholder="Tin nhắn của bạn" />
                        </div>
                        <button type="button">GỬI ĐI</button>
                      </div>
                    </div>

                    <div className="contact-info">
                      <h1>Thông tin liên hệ</h1>
                      <p>
                        <i className="fa-solid fa-phone"></i>0963.541.319
                      </p>
                      <p>
                        <i className="fa-solid fa-envelope"></i>
                        anhtuanhym204@gmail.com
                      </p>
                      <p>
                        <i className="fa-solid fa-location-dot"></i>
                        Nhân Hòa Mỹ Hào Hưng Yên
                      </p>
                    </div>
                  </div>

                  <div className="contact-map">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.490713301591!2d105.81341697476884!3d21.013042588319255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab2e91fb6afb%3A0xbcf848d0137a6596!2sTTG%20Shop!5e0!3m2!1svi!2s!4v1734636888971!5m2!1svi!2s"
                      width="600"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="TTG Shop map"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


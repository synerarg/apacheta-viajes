import { ContactForm } from "./contact-form"

export function ContactSection() {
  return (
    <section id="contacto" className="bg-background py-16 md:py-24">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Contacto
          </p>
          <h2 className="font-serif text-4xl md:text-5xl italic text-foreground">
            Hablemos
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Info */}
          <div>
            <h3 className="text-xl font-medium text-foreground mb-6">
              Datos de Contacto
            </h3>

            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 shrink-0 bg-dark-brown mt-0.5">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                    <path d="M12 6C11.2583 6 10.5333 6.21993 9.91661 6.63199C9.29993 7.04404 8.81928 7.62971 8.53545 8.31494C8.25162 9.00016 8.17736 9.75416 8.32205 10.4816C8.46675 11.209 8.8239 11.8772 9.34835 12.4017C9.8728 12.9261 10.541 13.2833 11.2684 13.4279C11.9958 13.5726 12.7498 13.4984 13.4351 13.2145C14.1203 12.9307 14.706 12.4501 15.118 11.8334C15.5301 11.2167 15.75 10.4917 15.75 9.75C15.75 8.75544 15.3549 7.80161 14.6517 7.09835C13.9484 6.39509 12.9946 6 12 6ZM12 12C11.555 12 11.12 11.868 10.75 11.6208C10.38 11.3736 10.0916 11.0222 9.92127 10.611C9.75097 10.1999 9.70642 9.7475 9.79323 9.31105C9.88005 8.87459 10.0943 8.47368 10.409 8.15901C10.7237 7.84434 11.1246 7.63005 11.561 7.54323C11.9975 7.45642 12.4499 7.50097 12.861 7.67127C13.2722 7.84157 13.6236 8.12996 13.8708 8.49997C14.118 8.86998 14.25 9.30499 14.25 9.75C14.25 10.3467 14.0129 10.919 13.591 11.341C13.169 11.7629 12.5967 12 12 12ZM12 1.5C9.81273 1.50248 7.71575 2.37247 6.16911 3.91911C4.62247 5.46575 3.75248 7.56273 3.75 9.75C3.75 12.6937 5.11031 15.8138 7.6875 18.7734C8.84552 20.1108 10.1489 21.3151 11.5734 22.3641C11.6995 22.4524 11.8498 22.4998 12.0037 22.4998C12.1577 22.4998 12.308 22.4524 12.4341 22.3641C13.856 21.3147 15.1568 20.1104 16.3125 18.7734C18.8859 15.8138 20.25 12.6937 20.25 9.75C20.2475 7.56273 19.3775 5.46575 17.8309 3.91911C16.2843 2.37247 14.1873 1.50248 12 1.5ZM12 20.8125C10.4503 19.5938 5.25 15.1172 5.25 9.75C5.25 7.95979 5.96116 6.2429 7.22703 4.97703C8.4929 3.71116 10.2098 3 12 3C13.7902 3 15.5071 3.71116 16.773 4.97703C18.0388 6.2429 18.75 7.95979 18.75 9.75C18.75 15.1153 13.5497 19.5938 12 20.8125Z" fill="var(--color-off-white)"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Oficina Central</p>
                  <p className="text-foreground">Caseros 450, Salta Capital</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 shrink-0 bg-dark-brown mt-0.5">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                    <path d="M21 4.5H3C2.80109 4.5 2.61032 4.57902 2.46967 4.71967C2.32902 4.86032 2.25 5.05109 2.25 5.25V18C2.25 18.3978 2.40804 18.7794 2.68934 19.0607C2.97064 19.342 3.35218 19.5 3.75 19.5H20.25C20.6478 19.5 21.0294 19.342 21.3107 19.0607C21.592 18.7794 21.75 18.3978 21.75 18V5.25C21.75 5.05109 21.671 4.86032 21.5303 4.71967C21.3897 4.57902 21.1989 4.5 21 4.5ZM19.0716 6L12 12.4828L4.92844 6H19.0716ZM20.25 18H3.75V6.95531L11.4928 14.0531C11.6312 14.1801 11.8122 14.2506 12 14.2506C12.1878 14.2506 12.3688 14.1801 12.5072 14.0531L20.25 6.95531V18Z" fill="var(--color-off-white)"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Escribinos</p>
                  <a href="mailto:hola@apacheta.travel" className="text-foreground hover:text-primary transition-colors">
                    hola@apacheta.travel
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 shrink-0 bg-dark-brown mt-0.5">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                    <path d="M20.8472 14.8556L16.4306 12.8766L16.4184 12.8709C16.1892 12.7729 15.939 12.7335 15.6907 12.7564C15.4424 12.7793 15.2037 12.8638 14.9963 13.0022C14.9718 13.0183 14.9483 13.0359 14.9259 13.0547L12.6441 15C11.1984 14.2978 9.70594 12.8166 9.00375 11.3897L10.9519 9.07313C10.9706 9.04969 10.9884 9.02625 11.0053 9.00094C11.1407 8.79403 11.2229 8.55686 11.2445 8.31054C11.266 8.06421 11.2264 7.81637 11.1291 7.58906V7.57781L9.14438 3.15375C9.01569 2.85681 8.79443 2.60945 8.51361 2.4486C8.2328 2.28775 7.90749 2.22203 7.58625 2.26125C6.31591 2.42841 5.14986 3.05228 4.30588 4.01634C3.46189 4.9804 2.9977 6.21871 3 7.5C3 14.9438 9.05625 21 16.5 21C17.7813 21.0023 19.0196 20.5381 19.9837 19.6941C20.9477 18.8501 21.5716 17.6841 21.7388 16.4137C21.778 16.0926 21.7125 15.7674 21.5518 15.4866C21.3911 15.2058 21.144 14.9845 20.8472 14.8556ZM16.5 19.5C13.3185 19.4965 10.2682 18.2311 8.01856 15.9814C5.76887 13.7318 4.50347 10.6815 4.5 7.5C4.49647 6.58452 4.8263 5.69906 5.42788 5.00897C6.02946 4.31889 6.86166 3.87137 7.76906 3.75C7.76869 3.75374 7.76869 3.75751 7.76906 3.76125L9.73781 8.1675L7.8 10.4869C7.78033 10.5095 7.76246 10.5336 7.74656 10.5591C7.60548 10.7755 7.52272 11.0248 7.5063 11.2827C7.48987 11.5406 7.54034 11.7983 7.65281 12.0309C8.50219 13.7681 10.2525 15.5053 12.0084 16.3537C12.2428 16.4652 12.502 16.5139 12.7608 16.4952C13.0196 16.4764 13.2691 16.3909 13.485 16.2469C13.5091 16.2307 13.5322 16.2131 13.5544 16.1944L15.8334 14.25L20.2397 16.2234C20.2397 16.2234 20.2472 16.2234 20.25 16.2234C20.1301 17.1321 19.6833 17.966 18.993 18.5691C18.3028 19.1721 17.4166 19.5031 16.5 19.5Z" fill="var(--color-off-white)"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Llamanos</p>
                  <a href="tel:+5493875550192" className="text-foreground hover:text-primary transition-colors">
                    +54 9 387 555-0192
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14687.441542044857!2d-65.41499!3d-24.7859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941bc3a0d5a94a3d%3A0x7a7e0c8c7c5c5c5c!2sSalta%2C%20Argentina!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Apacheta Viajes"
                className="grayscale"
              />
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <h3 className="text-xl font-medium text-foreground mb-2">
              Envíenos un mensaje
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Cuéntenos sobre sus planes de viaje y diseñaremos una experiencia a medida.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}

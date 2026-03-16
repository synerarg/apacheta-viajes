import { Check } from "lucide-react"

export function ServicesSection() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        <div className="mb-12">
          <h2 className="font-serif text-3xl md:text-4xl italic text-foreground mb-3">
            Servicios DMC
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Excelencia operativa diseñada para integrarse invisiblemente con su agencia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 - Logística Integral */}
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="w-8 h-8 bg-dark-brown flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                <path d="M21.75 8.25H18V4.5C18 4.30109 17.921 4.11032 17.7803 3.96967C17.6397 3.82902 17.4489 3.75 17.25 3.75H2.25C2.05109 3.75 1.86032 3.82902 1.71967 3.96967C1.57902 4.11032 1.5 4.30109 1.5 4.5V16.5C1.5 16.6989 1.57902 16.8897 1.71967 17.0303C1.86032 17.171 2.05109 17.25 2.25 17.25H3.75C3.75 17.8467 3.98705 18.419 4.40901 18.841C4.83097 19.2629 5.40326 19.5 6 19.5C6.59674 19.5 7.16903 19.2629 7.59099 18.841C8.01295 18.419 8.25 17.8467 8.25 17.25H15.75C15.75 17.8467 15.9871 18.419 16.409 18.841C16.831 19.2629 17.4033 19.5 18 19.5C18.5967 19.5 19.169 19.2629 19.591 18.841C20.0129 18.419 20.25 17.8467 20.25 17.25H21.75C21.9489 17.25 22.1397 17.171 22.2803 17.0303C22.421 16.8897 22.5 16.6989 22.5 16.5V10.5C22.5 9.70435 22.1839 8.94129 21.6213 8.37868C21.0587 7.81607 20.2956 7.5 19.5 7.5L18 8.25ZM18 8.25V15.75H8.25V5.25H16.5V8.25H18ZM6 18C5.80109 18 5.61032 17.921 5.46967 17.7803C5.32902 17.6397 5.25 17.4489 5.25 17.25C5.25 17.0511 5.32902 16.8603 5.46967 16.7197C5.61032 16.579 5.80109 16.5 6 16.5C6.19891 16.5 6.38968 16.579 6.53033 16.7197C6.67098 16.8603 6.75 17.0511 6.75 17.25C6.75 17.4489 6.67098 17.6397 6.53033 17.7803C6.38968 17.921 6.19891 18 6 18ZM18 18C17.8011 18 17.6103 17.921 17.4697 17.7803C17.329 17.6397 17.25 17.4489 17.25 17.25C17.25 17.0511 17.329 16.8603 17.4697 16.7197C17.6103 16.579 17.8011 16.5 18 16.5C18.1989 16.5 18.3897 16.579 18.5303 16.7197C18.671 16.8603 18.75 17.0511 18.75 17.25C18.75 17.4489 18.671 17.6397 18.5303 17.7803C18.3897 17.921 18.1989 18 18 18ZM21 15.75H19.6584C19.3992 15.2955 19.0208 14.9178 18.5658 14.6594C18.1108 14.401 17.5957 14.2712 17.0737 14.2831C16.5518 14.2951 16.0431 14.4484 15.6003 14.727C15.1574 15.0055 14.797 15.3989 14.5584 15.8644C14.5389 15.826 14.5181 15.7883 14.4966 15.7513C14.2374 15.2968 13.859 14.9191 13.404 14.6607C12.949 14.4023 12.4339 14.2725 11.912 14.2844C11.39 14.2963 10.8814 14.4496 10.4385 14.7282C9.99563 15.0067 9.63521 15.4001 9.39656 15.8656C9.15791 15.4001 8.79749 15.0067 8.35464 14.7282C7.91179 14.4496 7.40313 14.2963 6.88117 14.2844C6.35921 14.2725 5.84411 14.4023 5.38912 14.6607C4.93414 14.9191 4.55566 15.2968 4.29656 15.7513C4.27504 15.7883 4.25425 15.826 4.23469 15.8644C3.99604 15.3989 3.63562 15.0055 3.19277 14.727C2.74992 14.4484 2.24126 14.2951 1.71929 14.2831V5.25H6.75V15.75H3C3 15.75 3 15.75 3 15.75H21Z" fill="var(--color-off-white)"/>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-foreground mb-3">
              Logística Integral
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              Coordinación total de transfers, hotelería y expediciones. Desde la recepción
              en aeropuerto hasta la despedida, gestionamos cada minuto con precisión cronométrica.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground">Flota propia de camionetas 4x4</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground">Guías bilingües especializados</span>
              </div>
            </div>
          </div>

          {/* Card 2 - Marca Blanca */}
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="w-8 h-8 bg-dark-brown flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                <path d="M20.25 3H3.75C3.35218 3 2.97064 3.15804 2.68934 3.43934C2.40804 3.72064 2.25 4.10218 2.25 4.5V15C2.25 15.3978 2.40804 15.7794 2.68934 16.0607C2.97064 16.342 3.35218 16.5 3.75 16.5H10.5V19.5H7.5C7.30109 19.5 7.11032 19.579 6.96967 19.7197C6.82902 19.8603 6.75 20.0511 6.75 20.25C6.75 20.4489 6.82902 20.6397 6.96967 20.7803C7.11032 20.921 7.30109 21 7.5 21H16.5C16.6989 21 16.8897 20.921 17.0303 20.7803C17.171 20.6397 17.25 20.4489 17.25 20.25C17.25 20.0511 17.171 19.8603 17.0303 19.7197C16.8897 19.579 16.6989 19.5 16.5 19.5H13.5V16.5H20.25C20.6478 16.5 21.0294 16.342 21.3107 16.0607C21.592 15.7794 21.75 15.3978 21.75 15V4.5C21.75 4.10218 21.592 3.72064 21.3107 3.43934C21.0294 3.15804 20.6478 3 20.25 3ZM12 19.5H10.5V16.5H12V19.5ZM13.5 16.5V19.5H12V16.5H13.5ZM20.25 15H3.75V4.5H20.25V15Z" fill="var(--color-off-white)"/>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-foreground mb-3">
              Marca Blanca
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              Operamos bajo su identidad corporativa. Sus pasajeros verán su logo en
              cartelería de bienvenida, uniformes (opcional) y papelería a bordo.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground">Cartelería personalizada</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground">Bienvenida en nombre de su agencia</span>
              </div>
            </div>
          </div>

          {/* Card 3 - Soporte 24/7 */}
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="w-8 h-8 bg-dark-brown flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                <path d="M12 2.25C10.0716 2.25 8.18657 2.82183 6.58319 3.89317C4.97982 4.96451 3.73013 6.48726 2.99218 8.26884C2.25422 10.0504 2.06114 12.0108 2.43735 13.9021C2.81355 15.7934 3.74215 17.5307 5.10571 18.8943C6.46928 20.2579 8.20656 21.1865 10.0979 21.5627C11.9892 21.9389 13.9496 21.7458 15.7312 21.0078C17.5127 20.2699 19.0355 19.0202 20.1068 17.4168C21.1782 15.8134 21.75 13.9284 21.75 12C21.7473 9.41498 20.7192 6.93661 18.8913 5.10872C17.0634 3.28084 14.585 2.25273 12 2.25ZM8.25 13.5C8.25 13.6989 8.17098 13.8897 8.03033 14.0303C7.88968 14.171 7.69891 14.25 7.5 14.25H6.84375C7.08466 15.2552 7.61619 16.1669 8.37146 16.8759C9.12673 17.585 10.0742 18.0611 11.0963 18.2474C12.1183 18.4337 13.1722 18.3222 14.1325 17.9262C15.0928 17.5302 15.9182 16.8667 16.5094 16.0143C17.1007 15.1619 17.4328 14.1567 17.4668 13.12C17.5008 12.0834 17.235 11.059 16.7015 10.1699C16.1679 9.28073 15.389 8.56384 14.4582 8.10616C13.5274 7.64849 12.4841 7.46897 11.4525 7.58906C11.4525 7.58906 11.4619 7.58906 11.4694 7.58906C10.1166 7.74461 8.86719 8.36621 7.93406 9.34782C7.00094 10.3294 6.44147 11.6098 6.35344 12.9656C6.34688 13.0677 6.34969 13.17 6.35156 13.2722C6.35156 13.3481 6.36094 13.4231 6.36469 13.5H8.25ZM12 3.75C13.4834 3.75 14.9334 4.19987 16.1668 5.04199C17.4001 5.88412 18.3614 7.0783 18.9291 8.46632C19.4968 9.85434 19.6453 11.3783 19.3559 12.8496C19.0665 14.3209 18.3522 15.6727 17.3033 16.7217C16.2543 17.7706 14.9026 18.4849 13.4312 18.7743C11.9599 19.0637 10.436 18.9152 9.04796 18.3475C7.65994 17.7798 6.46576 16.8185 5.62364 15.5852C4.78151 14.3518 4.33163 12.9017 4.33163 11.4183C4.33163 11.4183 4.33163 11.4099 4.33163 11.4056C4.33319 9.41707 5.12458 7.51046 6.53088 6.10416C7.93718 4.69786 9.84379 3.90647 11.8322 3.90491C11.8884 3.75 11.9428 3.75 12 3.75ZM9.75 12C9.75 11.4033 9.98705 10.831 10.409 10.409C10.831 9.98705 11.4033 9.75 12 9.75C12.5967 9.75 13.169 9.98705 13.591 10.409C14.0129 10.831 14.25 11.4033 14.25 12C14.25 12.5967 14.0129 13.169 13.591 13.591C13.169 14.0129 12.5967 14.25 12 14.25C11.4033 14.25 10.831 14.0129 10.409 13.591C9.98705 13.169 9.75 12.5967 9.75 12Z" fill="var(--color-off-white)"/>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-foreground mb-3">
              Soporte 24/7
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              Resolución de incidencias en tiempo real. Un equipo de guardia permanente
              monitoreando cada movimiento de sus pasajeros en la puna y valles.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground">Línea directa para emergencias</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span className="text-foreground">Monitoreo continuo de operaciones</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

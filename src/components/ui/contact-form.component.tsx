"use client";

const INPUT_CLASS =
  "border-b border-muted bg-transparent font-lato text-[16px] text-body-text py-3 w-full outline-none focus:border-primary transition-colors placeholder:text-muted";

export function ContactForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: conectar con API
      }}
      className="flex flex-col gap-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Nombre */}
        <div className="flex flex-col gap-2">
          <label className="font-lato text-[14px] text-body-text font-normal">
            Nombre completo
          </label>
          <input
            type="text"
            required
            placeholder="Juan Pérez"
            className={INPUT_CLASS}
          />
        </div>

        {/* Agencia */}
        <div className="flex flex-col gap-2">
          <label className="font-lato text-[14px] text-body-text font-normal">
            Agencia
          </label>
          <input
            type="text"
            placeholder="Nombre de la agencia"
            className={INPUT_CLASS}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="font-lato text-[14px] text-body-text font-normal">
            Email
          </label>
          <input
            type="email"
            required
            placeholder="email@agencia.com"
            className={INPUT_CLASS}
          />
        </div>

        {/* Teléfono */}
        <div className="flex flex-col gap-2">
          <label className="font-lato text-[14px] text-body-text font-normal">
            Teléfono
          </label>
          <input
            type="tel"
            placeholder="+54 9 387 ..."
            className={INPUT_CLASS}
          />
        </div>
      </div>

      {/* Mensaje */}
      <div className="flex flex-col gap-2">
        <label className="font-lato text-[14px] text-body-text font-normal">
          Mensaje
        </label>
        <textarea
          rows={5}
          placeholder="Cuéntenos sobre sus grupos y necesidades..."
          className={`${INPUT_CLASS} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-off-white font-lato text-[18px] font-bold py-4 uppercase tracking-[1.6px] hover:bg-dark-brown transition-colors"
      >
        Enviar
      </button>
    </form>
  );
}

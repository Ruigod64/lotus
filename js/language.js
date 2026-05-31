/* ============================================================
   language.js — Bilingual (ES / EN) i18n controller
   Single Responsibility: hold copy + swap it on demand.
   Rule: every new string MUST have both `es` and `en`.
   ============================================================ */

(function (global) {
  "use strict";

  /* ---- Dictionary. Keys map to [data-i18n] in the markup. ---- */
  var i18n = {
    /* Accessibility / utility */
    "a11y.skip":     { es: "Ir al contenido",   en: "Skip to content" },
    "a11y.menu":     { es: "Abrir menú",        en: "Open menu" },

    /* Nav */
    "nav.about":        { es: "Sobre Rose",     en: "About" },
    "nav.services":     { es: "Servicios",      en: "Services" },
    "nav.atmosphere":   { es: "Experiencia",    en: "Experience" },
    "nav.testimonials": { es: "Testimonios",    en: "Testimonials" },
    "nav.cta":          { es: "Agendar Sesión", en: "Book a Session" },

    /* Hero */
    "hero.eyebrow":  { es: "Centro Holístico de Sanación", en: "Holistic Healing Center" },
    "hero.subtitle": {
      es: "Sanación integral, terapias energéticas y restauración emocional en un espacio sereno, elegante y profesional.",
      en: "Integral healing, energy therapies and emotional restoration within a serene, elegant and professional space."
    },
    "hero.cta1":   { es: "Agendar Sesión",    en: "Book a Session" },
    "hero.cta2":   { es: "Conocer Servicios", en: "Explore Services" },
    "hero.scroll": { es: "Desliza",           en: "Scroll" },

    /* About */
    "about.eyebrow": { es: "Sobre Rose Segura", en: "About Rose Segura" },
    "about.title":   { es: "Un espacio seguro para sanar y reconectar contigo",
                       en: "A safe space to heal and reconnect with yourself" },
    "about.p1": {
      es: "En Lotus Transformation Healing acompaño cada proceso desde la calidez, el respeto y la presencia. Mi enfoque integra la sanación energética y el bienestar emocional para sostener a la persona en su totalidad.",
      en: "At Lotus Transformation Healing I walk beside every process with warmth, respect and presence. My approach blends energetic healing and emotional wellbeing to hold each person as a whole."
    },
    "about.p2": {
      es: "Cada sesión está diseñada para favorecer el equilibrio integral, liberar lo que pesa y reconectar con la paz interior, siempre desde una atención personalizada y profesional.",
      en: "Every session is designed to restore integral balance, release what weighs on you and reconnect with inner peace — always through personalized, professional care."
    },
    "about.p3": {
      es: "Aquí encontrarás cercanía, profesionalismo y un acompañamiento humano para transitar el duelo, el cambio y la transformación con suavidad.",
      en: "Here you will find closeness, professionalism and human accompaniment to move through grief, change and transformation with gentleness."
    },
    "about.signature": { es: "Rose Segura · Terapeuta Holística",
                         en: "Rose Segura · Holistic Therapist" },

    /* Services */
    "services.eyebrow": { es: "Terapias", en: "Therapies" },
    "services.title":   { es: "Servicios de sanación integral",
                          en: "Integral healing services" },
    "services.lead": {
      es: "Cada terapia honra las dimensiones emocional, mental, física y espiritual del bienestar.",
      en: "Each therapy honors the emotional, mental, physical and spiritual dimensions of wellbeing."
    },
    "services.cta": { es: "Agendar", en: "Book" },

    "service.1.title": { es: "Sesiones Tanatológicas Holísticas", en: "Holistic Grieving Therapy" },
    "service.1.desc": {
      es: "Un acompañamiento terapéutico profundo y compasivo diseñado para ayudar a las personas a transitar procesos de duelo, pérdida y transformación emocional desde una mirada integral. Estas sesiones combinan herramientas terapéuticas, energéticas y holísticas para favorecer la liberación emocional, el equilibrio interior y la reconexión con la paz y el bienestar. El enfoque holístico permite acompañar no solo el dolor emocional, sino también el impacto mental, físico y energético que puede surgir durante momentos difíciles de la vida.",
      en: "A compassionate and integrative approach designed to support individuals navigating grief, emotional pain and life transitions. These sessions combine emotional guidance, energetic restoration and holistic healing techniques to help release suppressed emotions, restore inner balance and reconnect with peace, meaning and emotional stability. This therapy honors the emotional, mental, physical and spiritual dimensions of healing, creating a safe and nurturing space for profound transformation."
    },
    "service.2.title": { es: "Sesiones Tanatológicas Tradicionales", en: "Traditional Grieving Therapy" },
    "service.2.desc": {
      es: "Espacio terapéutico profesional enfocado en brindar apoyo emocional durante procesos de duelo, pérdida o cambios importantes en la vida. A través del acompañamiento emocional y la escucha compasiva, estas sesiones ayudan a comprender las emociones, procesar el dolor y desarrollar herramientas saludables para avanzar con mayor estabilidad emocional. Diseñadas para ofrecer contención, claridad y apoyo humano en momentos de vulnerabilidad y transformación.",
      en: "Professional emotional support focused on helping individuals process grief in a healthy and compassionate way. Through guided therapeutic conversations and emotional accompaniment, these sessions provide tools to understand loss, navigate emotional pain and gradually rebuild emotional strength and resilience. Designed to offer clarity, emotional containment and supportive guidance during difficult moments of transition and healing."
    },
    "service.3.title": { es: "Coach de Duelo", en: "Grief Coaching" },
    "service.3.desc": {
      es: "Acompañamiento emocional enfocado en ayudar a las personas a reconstruirse después de una pérdida significativa. Este proceso brinda herramientas de crecimiento personal, fortalecimiento emocional y guía consciente para recuperar la estabilidad, resignificar experiencias y volver a conectar con la vida desde un lugar más consciente y amoroso. Un espacio cálido y profesional para avanzar paso a paso hacia la transformación interior.",
      en: "Emotional accompaniment focused on helping individuals rebuild themselves after a significant loss. This process provides tools for personal growth, emotional strengthening and conscious guidance to recover stability, give new meaning to experiences and reconnect with life from a more conscious and loving place. A warm and professional space to move forward, step by step, toward inner transformation."
    },
    "service.4.title": { es: "Sesiones de Reiki", en: "Reiki Sessions" },
    "service.4.desc": {
      es: "Sesiones de sanación energética enfocadas en restaurar la armonía física, emocional y espiritual. Reiki trabaja sobre el campo energético ayudando a liberar tensión, reducir el estrés, favorecer la relajación profunda y promover equilibrio integral. Estas sesiones están diseñadas para brindar calma, bienestar y restauración energética en un ambiente seguro, sereno y terapéutico.",
      en: "Gentle yet powerful energy healing sessions focused on restoring harmony within the body, mind and spirit. Reiki works through the energetic field to promote deep relaxation, emotional release, stress reduction and energetic balance. These sessions are designed to help restore vitality, calm the nervous system and support emotional and spiritual wellbeing in a peaceful and restorative environment."
    },
    "service.5.title": { es: "Terapia con Diapasones", en: "Tuning Fork Therapy Sessions" },
    "service.5.desc": {
      es: "Terapia vibracional y sonora que utiliza diapasones terapéuticos para ayudar a equilibrar la frecuencia energética del cuerpo. Las vibraciones y frecuencias emitidas favorecen la relajación, el desbloqueo energético y la armonización emocional y física. Esta terapia busca estimular estados de bienestar, equilibrio y restauración energética mediante sonido terapéutico y vibración consciente.",
      en: "A vibrational sound therapy that utilizes therapeutic tuning forks to stimulate energetic balance and relaxation throughout the body. The frequencies produced by the tuning forks help harmonize the energetic system, reduce tension and encourage a state of emotional and physical equilibrium. This therapy supports energetic alignment, relaxation and vibrational restoration through therapeutic sound frequencies."
    },
    "service.6.title": { es: "Alineación de Chakras", en: "Chakra Alignment Sessions" },
    "service.6.desc": {
      es: "Sesiones de alineación energética enfocadas en equilibrar y armonizar el sistema de chakras para favorecer la claridad emocional, el flujo energético y el bienestar interior. A través de técnicas holísticas y trabajo energético, estas sesiones buscan liberar bloqueos energéticos y restaurar el equilibrio en todo el cuerpo y la mente. Diseñadas para promover estabilidad emocional, conexión espiritual y una mayor sensación de armonía interior.",
      en: "Energy alignment sessions focused on balancing and harmonizing the chakra system to support emotional clarity, energetic flow and inner wellbeing. Through holistic techniques and energetic work, these sessions aim to release energetic blockages and restore balance throughout the body and mind. Designed to promote emotional stability, spiritual connection and a greater sense of inner harmony."
    },
    "service.7.title": { es: "Terapias con Programación Neurolingüística", en: "PNL Technique Therapy" },
    "service.7.desc": {
      es: "Sesiones terapéuticas enfocadas en transformar patrones emocionales, creencias limitantes y respuestas automáticas que afectan el bienestar personal. A través de técnicas de Programación Neurolingüística, se trabaja en la reestructuración mental y emocional para favorecer cambios positivos y mayor claridad interior. Diseñadas para fortalecer la autoestima, mejorar la gestión emocional y desarrollar una mentalidad más consciente y empoderada.",
      en: "Therapeutic sessions based on Neurolinguistic Programming techniques designed to transform limiting beliefs, emotional patterns and subconscious conditioning. Through guided therapeutic processes, these sessions support emotional empowerment, mindset transformation and personal growth. Focused on helping individuals create healthier emotional responses, greater self-awareness and positive behavioral change."
    },
    "service.8.title": { es: "Terapias con Biogeometría Avanzada", en: "Advanced Bio-geometry Therapy" },
    "service.8.desc": {
      es: "Sesiones enfocadas en la armonización energética a través de principios de biogeometría y equilibrio vibracional. Este enfoque busca favorecer la coherencia energética del cuerpo y del entorno, promoviendo bienestar, relajación y estabilidad integral. Una experiencia terapéutica orientada a restaurar el equilibrio energético y apoyar procesos naturales de bienestar físico y emocional.",
      en: "Advanced energetic balancing sessions integrating principles of bio-geometry, vibrational harmony and energetic restoration. This therapeutic approach is designed to support energetic coherence within the body and environment while promoting balance, relaxation and overall wellbeing. These sessions aim to help restore energetic equilibrium and support the body's natural healing processes."
    },
    "service.9.title": { es: "Restauración Energética de Reseteo", en: "Energetic Reset Restoration" },
    "service.9.desc": {
      es: "Sesión terapéutica enfocada en liberar tensión acumulada, favorecer la relajación profunda y ayudar a restaurar el equilibrio energético del cuerpo. Este enfoque busca apoyar el bienestar físico y emocional mediante técnicas de armonización energética y restauración integral. Diseñada para ayudar a disminuir sensación de tensión y malestar energético relacionado con: cabeza, hombros, espalda, cervicales y rodillas. Brindando una experiencia de descanso, alivio y reconexión corporal desde una perspectiva holística y terapéutica.",
      en: "A therapeutic session focused on releasing accumulated tension, encouraging deep relaxation and helping restore the body's energetic balance. This approach aims to support physical and emotional wellbeing through energetic harmonization and integral restoration techniques. Designed to help ease the sensation of tension and energetic discomfort related to the head, shoulders, back, cervical area and knees — offering an experience of rest, relief and bodily reconnection from a holistic and therapeutic perspective."
    },

    /* Atmosphere */
    "atmosphere.eyebrow": { es: "La Experiencia", en: "The Experience" },
    "atmosphere.title":   { es: "Un ambiente diseñado para tu calma",
                            en: "An atmosphere designed for your calm" },
    "atmosphere.lead": {
      es: "Velas suaves, cuarzos, flores blancas y luz cálida: cada detalle invita a respirar y soltar.",
      en: "Soft candles, quartz, white flowers and warm light — every detail invites you to breathe and let go."
    },
    "atmosphere.cap1": { es: "Luz cálida",     en: "Warm light" },
    "atmosphere.cap2": { es: "Cuarzos",        en: "Healing crystals" },
    "atmosphere.cap3": { es: "Aromaterapia",   en: "Aromatherapy" },
    "atmosphere.cap4": { es: "Espacio sereno", en: "Serene space" },
    "atmosphere.cap5": { es: "Flores blancas", en: "White flowers" },
    "atmosphere.cap6": { es: "Piedras calientes", en: "Hot stones" },

    /* Testimonials */
    "testimonials.eyebrow": { es: "Testimonios", en: "Testimonials" },
    "testimonials.title":   { es: "Historias de transformación",
                              en: "Stories of transformation" },
    "t1.text": {
      es: "Llegué con un dolor que no sabía nombrar y salí sintiéndome en paz. Rose sostiene cada sesión con una calidez que sana.",
      en: "I arrived with a pain I couldn't name and left feeling at peace. Rose holds every session with a warmth that heals."
    },
    "t1.name": { es: "María G.", en: "María G." },
    "t1.role": { es: "Sesiones de Reiki", en: "Reiki Sessions" },
    "t2.text": {
      es: "El acompañamiento en mi proceso de duelo fue profundamente humano y profesional. Recuperé el equilibrio que creía perdido.",
      en: "The support through my grieving process was deeply human and professional. I recovered the balance I thought I had lost."
    },
    "t2.name": { es: "Daniel R.", en: "Daniel R." },
    "t2.role": { es: "Terapia Tanatológica", en: "Grieving Therapy" },
    "t3.text": {
      es: "Un espacio elegante, seguro y luminoso. Cada visita se siente como un regalo para mi bienestar emocional.",
      en: "An elegant, safe and luminous space. Every visit feels like a gift to my emotional wellbeing."
    },
    "t3.name": { es: "Sofía L.", en: "Sofía L." },
    "t3.role": { es: "Alineación de Chakras", en: "Chakra Alignment" },

    /* Booking */
    "booking.eyebrow": { es: "Reserva", en: "Reservation" },
    "booking.title":   { es: "Agenda tu sesión",   en: "Book your session" },
    "booking.lead": {
      es: "Reserva por teléfono o WhatsApp. Elige tu terapia y te respondemos personalmente.",
      en: "Reserve by phone or WhatsApp. Choose your therapy and we'll reply personally."
    },
    "booking.label":   { es: "¿Qué terapia te interesa?", en: "Which therapy interests you?" },
    "booking.call":    { es: "Llamar",    en: "Call" },
    "booking.whatsapp":{ es: "WhatsApp",  en: "WhatsApp" },
    "booking.note": {
      es: "Atención personalizada · Respuesta cálida y profesional",
      en: "Personalized attention · Warm, professional response"
    },

    "social.follow": { es: "Síguenos", en: "Follow us" },

    /* Final CTA */
    "cta.title": { es: "Tu proceso de transformación puede comenzar hoy",
                   en: "Your process of transformation can begin today" },
    "cta.sub": {
      es: "Permítete sanar, reconectar contigo y recuperar tu equilibrio interior.",
      en: "Allow yourself to heal, reconnect with yourself and restore your inner balance."
    },
    "cta.btn": { es: "Agendar Mi Sesión", en: "Book My Session" },

    /* Footer */
    "footer.tagline": {
      es: "Centro holístico de sanación integral, terapias energéticas y restauración emocional.",
      en: "Holistic center for integral healing, energy therapies and emotional restoration."
    },
    "footer.contact":   { es: "Contacto",  en: "Contact" },
    "footer.hoursTitle":{ es: "Horarios",  en: "Hours" },
    "footer.hours": {
      es: "Lun – Sáb · 9:00 – 19:00",
      en: "Mon – Sat · 9:00 AM – 7:00 PM"
    },
    "footer.location": { es: "Los Ángeles, California", en: "Los Angeles, California" },
    "footer.rights": {
      es: "© 2026 Lotus Transformation Healing. Todos los derechos reservados.",
      en: "© 2026 Lotus Transformation Healing. All rights reserved."
    }
  };

  /* WhatsApp pre-filled messages per language */
  var waMessages = {
    es: "Hola Rose, me gustaría agendar una sesión de ",
    en: "Hello Rose, I would like to book a session of "
  };

  var LangController = {
    current: "es",

    /** Apply a language across the whole document. */
    apply: function (lang) {
      if (lang !== "es" && lang !== "en") { lang = "es"; }
      this.current = lang;

      var nodes = document.querySelectorAll("[data-i18n]");
      for (var i = 0; i < nodes.length; i++) {
        var key = nodes[i].getAttribute("data-i18n");
        var entry = i18n[key];
        if (entry && entry[lang] != null) {
          nodes[i].textContent = entry[lang];
        }
      }

      /* Translatable attributes: data-i18n-attr="aria-label:key" (comma list) */
      var attrNodes = document.querySelectorAll("[data-i18n-attr]");
      for (var j = 0; j < attrNodes.length; j++) {
        var pairs = attrNodes[j].getAttribute("data-i18n-attr").split(",");
        for (var k = 0; k < pairs.length; k++) {
          var parts = pairs[k].split(":");
          var attr = parts[0].trim();
          var ekey = parts[1] && parts[1].trim();
          var e = i18n[ekey];
          if (e && e[lang] != null) {
            attrNodes[j].setAttribute(attr, e[lang]);
          }
        }
      }

      document.documentElement.setAttribute("lang", lang);

      /* reflect active state on toggle buttons */
      var btns = document.querySelectorAll(".lang-toggle__btn");
      for (var b = 0; b < btns.length; b++) {
        var isActive = btns[b].getAttribute("data-lang") === lang;
        btns[b].classList.toggle("is-active", isActive);
        btns[b].setAttribute("aria-pressed", isActive ? "true" : "false");
      }

      try { localStorage.setItem("lth-lang", lang); } catch (e) {}

      document.dispatchEvent(new CustomEvent("languagechange", { detail: { lang: lang } }));
    },

    /** Resolve a translated string by key (for JS-built strings). */
    t: function (key) {
      var entry = i18n[key];
      return entry ? entry[this.current] : key;
    },

    waPrefix: function () {
      return waMessages[this.current] || waMessages.es;
    },

    init: function () {
      var saved = null;
      try { saved = localStorage.getItem("lth-lang"); } catch (e) {}
      var browser = (navigator.language || "es").toLowerCase().indexOf("en") === 0 ? "en" : "es";
      this.apply(saved || browser);

      var self = this;
      var toggle = document.querySelector(".lang-toggle");
      if (toggle) {
        toggle.addEventListener("click", function (ev) {
          var btn = ev.target.closest(".lang-toggle__btn");
          if (btn) { self.apply(btn.getAttribute("data-lang")); }
        });
      }
    }
  };

  global.LTH = global.LTH || {};
  global.LTH.Lang = LangController;
})(window);

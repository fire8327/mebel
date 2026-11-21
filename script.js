/**
 * УНИВЕРСАЛЬНЫЙ ШАБЛОН МЕБЕЛЬНОЙ ФАБРИКИ
 * Доступ строго по ссылке с URL-параметром:
 * ?brand=victoriya (или ?brand=1) — «Виктория Мебель» (ул. Калинина, 111/1)
 * ?brand=avanta (или ?brand=2) — «Аванта Мебель» (Водопроводная ул., 2А)
 * ?brand=vita (или ?brand=3) — «Вита Мебель» (Хевешская ул., 34А)
 *
 * Никаких переключателей в интерфейсе — для заказчика это 100% индивидуальный сайт.
 * Ассеты и фото строго изолированы (0 дублирования между брендами).
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. ОПРЕДЕЛЕНИЕ БРЕНДА ИЗ URL (БЕЗ ПАРАМЕТРА ДОСТУП ЗАКРЫТ — 404)
  // =========================================================================
  const currentBrandKey = getBrandFromUrl();
  
  if (!currentBrandKey) {
    document.documentElement.classList.add('no-access');
    document.title = '404 — Страница не найдена';
    const pageFavicon = document.getElementById('pageFavicon');
    if (pageFavicon) pageFavicon.href = 'data:image/x-icon;,';
    return; // Останавливаем выполнение — шаблон не загружается
  }

  const currentBrand = BRANDS_DATABASE[currentBrandKey];
  if (!currentBrand) {
    document.documentElement.classList.add('no-access');
    document.title = '404 — Страница не найдена';
    return;
  }

  function getBrandFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const raw = (params.get('brand') || params.get('id') || params.get('b') || '').trim().toLowerCase();

    if (!raw) return null; // Параметр отсутствует — доступ закрыт

    if (raw === '1' || raw.includes('vic') || raw.includes('vik') || raw.includes('викт')) return 'victoriya';
    if (raw === '2' || raw.includes('avan') || raw.includes('аван')) return 'avanta';
    if (raw === '3' || raw.includes('vita') || raw.includes('вит')) return 'vita';
    if (raw === '4' || raw === 'asmebel' || raw.includes('asmeb') || raw.includes('асмеб') || raw.includes('as21') || raw === 'as') return 'asmebel';

    return BRANDS_DATABASE[raw] ? raw : null;
  }

  // =========================================================================
  // 2. РЕНДЕР ВСЕХ ЭЛЕМЕНТОВ СТРАНИЦЫ ПОД ВЫБРАННЫЙ БРЕНД
  // =========================================================================
  function applyTheme(theme) {
    if (!theme) return;
    const root = document.documentElement;
    if (theme.accentPrimary) {
      root.style.setProperty('--accent-primary', theme.accentPrimary);
      root.style.setProperty('--accent-gold', theme.accentPrimary);
      root.style.setProperty('--border-active', theme.accentPrimary);
    }
    if (theme.accentHover) {
      root.style.setProperty('--accent-hover', theme.accentHover);
      root.style.setProperty('--accent-gold-hover', theme.accentHover);
    }
    if (theme.accentLight) {
      root.style.setProperty('--accent-light', theme.accentLight);
    }
    if (theme.accentDark) {
      root.style.setProperty('--accent-dark', theme.accentDark);
    }
    if (theme.accentRgb) {
      root.style.setProperty('--accent-rgb', theme.accentRgb);
      root.style.setProperty('--border-hover', `rgba(${theme.accentRgb}, 0.35)`);
      root.style.setProperty('--accent-glow', `rgba(${theme.accentRgb}, 0.25)`);
      root.style.setProperty('--accent-gold-glow', `rgba(${theme.accentRgb}, 0.25)`);
      root.style.setProperty('--shadow-gold', `0 8px 32px rgba(${theme.accentRgb}, 0.25)`);
    }
    if (theme.accentContrast) {
      root.style.setProperty('--accent-contrast', theme.accentContrast);
    }

    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = theme.accentPrimary || '#0B0C0E';
  }

  function renderBrand(brand) {
    // 2.0 Индивидуальная палитра бренда (динамическая адаптация темы)
    if (brand.theme) {
      applyTheme(brand.theme);
    }

    // 2.1 Title, Meta & Favicon
    document.title = `${brand.name} — Кухни и мебель на заказ в Чебоксарах | Фабрика`;
    const pageDesc = document.getElementById('pageDescription');
    if (pageDesc) {
      pageDesc.setAttribute('content', `${brand.name}: кухни, шкафы-купе и мебель на заказ в Чебоксарах. ${brand.address}. Телефон: ${brand.phone}.`);
    }
    const pageFavicon = document.getElementById('pageFavicon');
    if (pageFavicon) pageFavicon.href = brand.logo;

    // 2.2 Логотип, название и слоган
    const brandLogoImg = document.getElementById('brandLogoImg');
    if (brandLogoImg) brandLogoImg.src = brand.logo;
    const brandNameText = document.getElementById('brandNameText');
    if (brandNameText) brandNameText.textContent = brand.name;
    const brandTaglineText = document.getElementById('brandTaglineText');
    if (brandTaglineText) brandTaglineText.textContent = brand.tagline;

    // 2.3 Топ-бар
    const topBarAddress = document.getElementById('topBarAddress');
    if (topBarAddress) topBarAddress.textContent = `${brand.shortAddress} • Шоурум открыт`;
    const topBarRatingLink = document.getElementById('topBarRatingLink');
    if (topBarRatingLink) topBarRatingLink.href = brand.mapsUrl;
    const topBarRatingScore = document.getElementById('topBarRatingScore');
    if (topBarRatingScore) topBarRatingScore.textContent = brand.rating;
    const topBarRatingCount = document.getElementById('topBarRatingCount');
    if (topBarRatingCount) topBarRatingCount.textContent = `(${brand.ratingCount})`;
    const topBarPromoText = document.getElementById('topBarPromoText');
    if (topBarPromoText) {
      topBarPromoText.innerHTML = `Акция: <strong>${brand.promoTitle}</strong>`;
    }

    // 2.4 Header контакты
    const headerPhoneLink = document.getElementById('headerPhoneLink');
    if (headerPhoneLink) {
      headerPhoneLink.textContent = brand.phone;
      headerPhoneLink.href = `tel:${brand.phoneRaw}`;
    }
    const headerTgLink = document.getElementById('headerTgLink');
    if (headerTgLink) headerTgLink.href = brand.telegram;
    const headerPhoneMobileBtn = document.getElementById('headerPhoneMobileBtn');
    if (headerPhoneMobileBtn) {
      headerPhoneMobileBtn.href = `tel:${brand.phoneRaw}`;
    }


    // 2.5 Hero-секция (фон строго этого бренда)
    const heroBgImg = document.getElementById('heroBgImg');
    if (heroBgImg) heroBgImg.src = brand.heroBg;
    const heroBadgeText = document.getElementById('heroBadgeText');
    if (heroBadgeText) heroBadgeText.textContent = brand.badge;
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) heroTitle.innerHTML = brand.heroTitle;
    const heroSubtitle = document.getElementById('heroSubtitle');
    if (heroSubtitle) heroSubtitle.textContent = brand.heroSubtitle;
    const heroStatsProjects = document.getElementById('heroStatsProjects');
    if (heroStatsProjects) heroStatsProjects.textContent = brand.projectsCount;
    const heroGiftBenefit = document.getElementById('heroGiftBenefit');
    if (heroGiftBenefit) heroGiftBenefit.textContent = `${brand.promoGiftName} в подарок`;

    // 2.6 Hero Trust & Аватары реальных клиентов этого бренда
    const heroTrustLink = document.getElementById('heroTrustLink');
    if (heroTrustLink) heroTrustLink.href = brand.mapsUrl;
    const heroTrustRating = document.getElementById('heroTrustRating');
    if (heroTrustRating) heroTrustRating.textContent = `★ ${brand.rating} из 5 на Яндекс Картах`;
    const heroTrustSub = document.getElementById('heroTrustSub');
    if (heroTrustSub && brand.reviews.length > 0) {
      heroTrustSub.textContent = `«${brand.reviews[0].category}: ${brand.reviews[0].text.substring(0, 48)}...»`;
    }
    const heroTrustAvatars = document.getElementById('heroTrustAvatars');
    if (heroTrustAvatars && brand.reviews.length >= 3) {
      heroTrustAvatars.innerHTML = `
        <img src="${brand.reviews[0].avatar}" alt="${brand.reviews[0].name}" class="trust-avatar">
        <img src="${brand.reviews[1].avatar}" alt="${brand.reviews[1].name}" class="trust-avatar">
        <img src="${brand.reviews[2].avatar}" alt="${brand.reviews[2].name}" class="trust-avatar">
      `;
    }

    // 2.7 Промо-баннер (картинка и условия строго этого бренда)
    const promoTag = document.getElementById('promoTag');
    if (promoTag) promoTag.textContent = brand.promoTag;
    const promoTitle = document.getElementById('promoTitle');
    if (promoTitle) promoTitle.textContent = brand.promoTitle;
    const promoDesc = document.getElementById('promoDesc');
    if (promoDesc) promoDesc.textContent = brand.promoDesc;
    const promoImg = document.getElementById('promoImg');
    if (promoImg) promoImg.src = brand.promoImg;
    const promoBenefitsList = document.getElementById('promoBenefitsList');
    if (promoBenefitsList) {
      promoBenefitsList.innerHTML = brand.promoBenefits.map(b => `<li>${b}</li>`).join('');
    }

    // 2.8 Bento Grid — 100% раздельные фотографии и описания
    const bento = brand.bento;
    const bentoKitchenImg = document.getElementById('bentoKitchenImg');
    if (bentoKitchenImg) bentoKitchenImg.src = bento.kitchenImg;
    const bentoKitchenTitle = document.getElementById('bentoKitchenTitle');
    if (bentoKitchenTitle) bentoKitchenTitle.textContent = bento.kitchenTitle;
    const bentoKitchenDesc = document.getElementById('bentoKitchenDesc');
    if (bentoKitchenDesc) bentoKitchenDesc.textContent = bento.kitchenDesc;
    const bentoKitchenPrice = document.getElementById('bentoKitchenPrice');
    if (bentoKitchenPrice) bentoKitchenPrice.textContent = bento.kitchenPrice;

    const bentoFeaturedImg = document.getElementById('bentoFeaturedImg');
    if (bentoFeaturedImg) bentoFeaturedImg.src = bento.featuredImg;
    const bentoFeaturedBadge = document.getElementById('bentoFeaturedBadge');
    if (bentoFeaturedBadge) bentoFeaturedBadge.textContent = bento.featuredBadge;
    const bentoFeaturedTitle = document.getElementById('bentoFeaturedTitle');
    if (bentoFeaturedTitle) bentoFeaturedTitle.textContent = bento.featuredTitle;
    const bentoFeaturedDesc = document.getElementById('bentoFeaturedDesc');
    if (bentoFeaturedDesc) bentoFeaturedDesc.textContent = bento.featuredDesc;
    const bentoFeaturedPrice = document.getElementById('bentoFeaturedPrice');
    if (bentoFeaturedPrice) bentoFeaturedPrice.textContent = bento.featuredPrice;

    const bentoWardrobeImg = document.getElementById('bentoWardrobeImg');
    if (bentoWardrobeImg) bentoWardrobeImg.src = bento.wardrobeImg;
    const bentoWardrobeTitle = document.getElementById('bentoWardrobeTitle');
    if (bentoWardrobeTitle) bentoWardrobeTitle.textContent = bento.wardrobeTitle;
    const bentoWardrobeDesc = document.getElementById('bentoWardrobeDesc');
    if (bentoWardrobeDesc) bentoWardrobeDesc.textContent = bento.wardrobeDesc;
    const bentoWardrobePrice = document.getElementById('bentoWardrobePrice');
    if (bentoWardrobePrice) bentoWardrobePrice.textContent = bento.wardrobePrice;

    const bentoFourthImg = document.getElementById('bentoFourthImg');
    if (bentoFourthImg) bentoFourthImg.src = bento.fourthImg;
    const bentoFourthTitle = document.getElementById('bentoFourthTitle');
    if (bentoFourthTitle) bentoFourthTitle.textContent = bento.fourthTitle;
    const bentoFourthDesc = document.getElementById('bentoFourthDesc');
    if (bentoFourthDesc) bentoFourthDesc.textContent = bento.fourthDesc;
    const bentoFourthPrice = document.getElementById('bentoFourthPrice');
    if (bentoFourthPrice) bentoFourthPrice.textContent = bento.fourthPrice;

    // 2.9 Динамическая секция фичи (Студия камня для Виктории / Студия эргономики для Аванты и Виты)
    renderFeatureSection(brand);

    // 2.10 Калькулятор сметы
    updateCalcForBrand(brand);

    // 2.11 Портфолио (только собственные сданные объекты)
    renderPortfolio(brand);

    // 2.12 О производстве / Статистика
    const factoryTitle = document.getElementById('factoryTitle');
    if (factoryTitle) factoryTitle.textContent = `Почему чебоксарцы заказывают мебель в «${brand.name}»`;
    const statYears = document.getElementById('statYears');
    if (statYears) statYears.textContent = brand.experienceYears;
    const statYearsLabel = document.getElementById('statYearsLabel');
    if (statYearsLabel) statYearsLabel.textContent = brand.experienceText;
    const statProjects = document.getElementById('statProjects');
    if (statProjects) statProjects.textContent = brand.projectsCount;
    const statRating = document.getElementById('statRating');
    if (statRating) statRating.textContent = `${brand.rating} ★`;
    const factoryLegalText = document.getElementById('factoryLegalText');
    if (factoryLegalText) factoryLegalText.textContent = `Официальный договор с ${brand.legalInfo}. Точные сроки и гарантия качества.`;

    // 2.13 Отзывы (строго свои верифицированные заказчики)
    renderReviews(brand);

    // 2.14 Контакты и Яндекс Карта (индивидуальные координаты)
    const contactsBrandName = document.getElementById('contactsBrandName');
    if (contactsBrandName) contactsBrandName.textContent = brand.name;
    const contactsBrandTagline = document.getElementById('contactsBrandTagline');
    if (contactsBrandTagline) contactsBrandTagline.textContent = brand.tagline;
    const contactsAddress = document.getElementById('contactsAddress');
    if (contactsAddress) contactsAddress.textContent = brand.address;
    const contactsPhone = document.getElementById('contactsPhone');
    if (contactsPhone) {
      contactsPhone.textContent = brand.phone;
      contactsPhone.href = `tel:${brand.phoneRaw}`;
    }
    const contactsTgLink = document.getElementById('contactsTgLink');
    if (contactsTgLink) contactsTgLink.href = brand.telegram;
    const contactsWaLink = document.getElementById('contactsWaLink');
    if (contactsWaLink) contactsWaLink.href = brand.whatsapp;
    const contactsLegal = document.getElementById('contactsLegal');
    if (contactsLegal) contactsLegal.innerHTML = brand.legalInfo.replace(' • ', '<br>');
    const contactsMapsBtn = document.getElementById('contactsMapsBtn');
    if (contactsMapsBtn) contactsMapsBtn.href = brand.mapsUrl;

    const contactsMapIframe = document.getElementById('contactsMapIframe');
    if (contactsMapIframe) {
      const coords = brand.mapCoords.split(',');
      const ll = `${coords[0]}%2C${coords[1]}`;
      const pt = `${coords[0]},${coords[1]},pm2rdm`;
      contactsMapIframe.src = `https://yandex.ru/map-widget/v1/?ll=${ll}&z=16&pt=${pt}`;
    }

    // 2.15 Футер
    const footerLogoImg = document.getElementById('footerLogoImg');
    if (footerLogoImg) footerLogoImg.src = brand.logo;
    const footerBrandName = document.getElementById('footerBrandName');
    if (footerBrandName) footerBrandName.textContent = brand.name;
    const footerRatingScore = document.getElementById('footerRatingScore');
    if (footerRatingScore) footerRatingScore.textContent = brand.rating;
    const footerRatingCount = document.getElementById('footerRatingCount');
    if (footerRatingCount) footerRatingCount.textContent = brand.ratingCount;
    const footerRatingPill = document.getElementById('footerRatingPill');
    if (footerRatingPill) footerRatingPill.href = brand.mapsUrl;
    const footerAddress = document.getElementById('footerAddress');
    if (footerAddress) footerAddress.textContent = brand.shortAddress;
    const footerPhone = document.getElementById('footerPhone');
    if (footerPhone) {
      footerPhone.textContent = brand.phone;
      footerPhone.href = `tel:${brand.phoneRaw}`;
    }
    const footerTg = document.getElementById('footerTg');
    if (footerTg) footerTg.href = brand.telegram;
    const footerWa = document.getElementById('footerWa');
    if (footerWa) footerWa.href = brand.whatsapp;
    const footerMaps = document.getElementById('footerMaps');
    if (footerMaps) footerMaps.href = brand.mapsUrl;
    const footerCopyright = document.getElementById('footerCopyright');
    if (footerCopyright) {
      footerCopyright.textContent = `© 2008–2026 ${brand.legalInfo}. Все права защищены.`;
    }

    // 2.16 Мобильный плавающий бар
    const mobileActionPhone = document.getElementById('mobileActionPhone');
    if (mobileActionPhone) mobileActionPhone.href = `tel:${brand.phoneRaw}`;
    const mobileActionWa = document.getElementById('mobileActionWa');
    if (mobileActionWa) mobileActionWa.href = brand.whatsapp;
  }


  // =========================================================================
  // 3. СЕКЦИЯ СТУДИИ: КАМЕНЬ (ВИКТОРИЯ) / МАТЕРИАЛЫ И ФУРНИТУРА (АВАНТА И ВИТА)
  // =========================================================================
  function renderFeatureSection(brand) {
    const navFeatureLink = document.getElementById('navFeatureLink');
    const footerLinkFeature = document.getElementById('footerLinkFeature');
    const featureTag = document.getElementById('featureTag');
    const featureTitle = document.getElementById('featureTitle');
    const featureDesc = document.getElementById('featureDesc');
    const chipsContainer = document.getElementById('featureChipsContainer');
    const featurePreviewImg = document.getElementById('featurePreviewImg');
    const featureBadge = document.getElementById('featureBadge');
    const featureSecondaryPreview = document.getElementById('featureSecondaryPreview');
    const featureSecondaryImg = document.getElementById('featureSecondaryImg');
    const featureSecondaryCaption = document.getElementById('featureSecondaryCaption');
    const featureActionBtn = document.getElementById('featureActionBtn');
    const featItem1Title = document.getElementById('featItem1Title');
    const featItem1Text = document.getElementById('featItem1Text');
    const featItem2Title = document.getElementById('featItem2Title');
    const featItem2Text = document.getElementById('featItem2Text');
    const featItem3Title = document.getElementById('featItem3Title');
    const featItem3Text = document.getElementById('featItem3Text');

    if (brand.hasStoneStudio) {
      // Только для Виктории: Студия камня
      if (navFeatureLink) navFeatureLink.textContent = 'Цех камня';
      if (footerLinkFeature) footerLinkFeature.textContent = 'Столешницы из камня';
      if (featureTag) featureTag.textContent = 'ЭКСКЛЮЗИВ «ВИКТОРИЯ МЕБЕЛЬ»';
      if (featureTitle) featureTitle.textContent = `Собственный цех обработки камня в Чебоксарах`;
      if (featureDesc) {
        featureDesc.textContent = 'Мы не заказываем каменные столешницы у перекупщиков, а обрабатываем акриловый камень и кварц на собственном высокоточном оборудовании. Это гарантирует идеальные стыки без видимых швов, скругления любой сложности и цену на 25–40% ниже салонной.';
      }
      if (featItem1Title) featItem1Title.textContent = 'Монолит без швов';
      if (featItem1Text) featItem1Text.textContent = 'Любая длина, эркеры и П-образные кухни выглядят как единый цельный массив.';
      if (featItem2Title) featItem2Title.textContent = '100% влагостойкость';
      if (featItem2Text) featItem2Text.textContent = 'Не разбухает от протечек, не красится вином, свеклой или кофе.';
      if (featItem3Title) featItem3Title.textContent = 'Ремонтопригодность 100%';
      if (featItem3Text) featItem3Text.textContent = 'Любые царапины устраняются полировкой прямо на дому за 30 минут.';

      const samples = brand.stoneSamples;
      if (chipsContainer && samples) {
        chipsContainer.innerHTML = samples.map((s, idx) => `
          <button class="stone-chip ${idx === 0 ? 'active' : ''}" data-name="${s.name}" data-img="${s.img}">
            <span class="stone-chip__color" style="background: ${s.color};"></span>
            <span>${s.name.split(' (')[0]}</span>
          </button>
        `).join('');

        if (featurePreviewImg) featurePreviewImg.src = samples[0].img;
        if (featureBadge) featureBadge.textContent = samples[0].name;
      }

      if (featureSecondaryPreview) featureSecondaryPreview.style.display = 'flex';
      if (featureSecondaryImg) featureSecondaryImg.src = 'assets/victoriya/stone-sink.jpg';
      if (featureSecondaryCaption) featureSecondaryCaption.textContent = 'Интегрированная бесшовная мойка под цвет столешницы';

      if (featureActionBtn) {
        featureActionBtn.innerHTML = '<span>Заказать расчет каменной столешницы</span>';
        featureActionBtn.onclick = () => openMeasureModalWithProduct('Столешница из камня');
      }
    } else {
      // Для Аванты и Виты: Студия материалов и австрийской фурнитуры (СТРОГО СВОИ ФОТО)
      if (navFeatureLink) navFeatureLink.textContent = 'Материалы';
      if (footerLinkFeature) footerLinkFeature.textContent = 'Материалы и фурнитура';
      if (featureTag) featureTag.textContent = `СТАНДАРТЫ КАЧЕСТВА «${brand.name.toUpperCase()}»`;
      if (featureTitle) featureTitle.textContent = `Премиальные фасады и фурнитура Blum`;
      if (featureDesc) {
        featureDesc.textContent = `В фабричных гарнитурах «${brand.name}» мы используем экологичные фасады МДФ класса E0.5, австрийскую фурнитуру Blum и бесшумные доводчики. Каждый проект проектируется с учетом идеальной эргономики рабочего треугольника.`;
      }
      if (featItem1Title) featItem1Title.textContent = 'Фурнитура Blum и Boyard';
      if (featItem1Text) featItem1Text.textContent = 'Плавный и тихий ход ящиков, доводчики на 100 000 циклов без провисания.';
      if (featItem2Title) featItem2Title.textContent = 'Влагостойкий PUR-шов';
      if (featItem2Text) featItem2Text.textContent = 'Нулевой клеевой шов защищает кромку от пара, влаги и высоких температур.';
      if (featItem3Title) featItem3Title.textContent = 'Монтаж в день доставки';
      if (featItem3Text) featItem3Text.textContent = 'Штатная бригада монтажников собирает гарнитур под ключ за 1 рабочий день.';

      const samples = brand.materialsSamples;
      if (chipsContainer && samples) {
        chipsContainer.innerHTML = samples.map((s, idx) => `
          <button class="stone-chip ${idx === 0 ? 'active' : ''}" data-name="${s.name}" data-img="${s.img}">
            <span class="stone-chip__color" style="background: ${s.color};"></span>
            <span>${s.name.split(' (')[0]}</span>
          </button>
        `).join('');

        if (featurePreviewImg) featurePreviewImg.src = samples[0].img;
        if (featureBadge) featureBadge.textContent = samples[0].name;
      }

      if (featureSecondaryPreview) featureSecondaryPreview.style.display = 'none';

      if (featureActionBtn) {
        featureActionBtn.innerHTML = `<span>Получить подарок: ${brand.promoGiftName}</span>`;
        featureActionBtn.onclick = () => openMeasureModalWithProduct('Кухня с подарком');
      }
    }

    // Слушатель смены сэмплов
    if (chipsContainer && featurePreviewImg) {
      chipsContainer.onclick = (e) => {
        const chip = e.target.closest('.stone-chip');
        if (!chip) return;
        chipsContainer.querySelectorAll('.stone-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        featurePreviewImg.style.opacity = '0.3';
        setTimeout(() => {
          featurePreviewImg.src = chip.dataset.img;
          featurePreviewImg.style.opacity = '1';
          if (featureBadge) featureBadge.textContent = chip.dataset.name;
        }, 120);
      };
    }
  }


  // =========================================================================
  // 4. ПОРТФОЛИО И ОТЗЫВЫ (СТРОГО СОБСТВЕННЫЕ ФОТОГРАФИИ)
  // =========================================================================
  function renderPortfolio(brand) {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;

    grid.innerHTML = brand.portfolio.map(item => `
      <div class="portfolio-card" data-category="${item.category}">
        <div class="portfolio-card__img-wrap">
          <img src="${item.img}" alt="${item.name}" class="portfolio-img">
          <div class="portfolio-card__badge">${item.badge}</div>
        </div>
        <div class="portfolio-card__info">
          <h3 class="portfolio-card__name">${item.name}</h3>
          <p class="portfolio-card__desc">${item.desc}</p>
          <div class="portfolio-card__footer">
            <span class="card-price">${item.price}</span>
            <button class="btn-detail" onclick="openPhotoModal('${item.img}', '${item.name}')">Фото крупнее 🔍</button>
          </div>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.portfolio-tab').forEach(t => t.classList.remove('active'));
    const allTab = document.querySelector('.portfolio-tab[data-filter="all"]');
    if (allTab) allTab.classList.add('active');

    const tabStone = document.getElementById('tabFilterStone');
    if (tabStone) {
      const hasStone = brand.portfolio.some(p => p.category === 'stone');
      tabStone.style.display = hasStone ? 'inline-block' : 'none';
    }
  }

  function renderReviews(brand) {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;

    const reviewsBadgeScore = document.getElementById('reviewsBadgeScore');
    if (reviewsBadgeScore) reviewsBadgeScore.textContent = `★ ${brand.rating}`;
    const reviewsMapsLink = document.getElementById('reviewsMapsLink');
    if (reviewsMapsLink) reviewsMapsLink.href = brand.mapsUrl;

    container.innerHTML = brand.reviews.map(rev => `
      <article class="review-card">
        <div class="review-card__head">
          <img src="${rev.avatar}" alt="${rev.name}" class="review-avatar">
          <div class="review-meta">
            <h3 class="review-author">${rev.name}</h3>
            <span class="review-date">${rev.date} • ${rev.category}</span>
          </div>
          <div class="review-stars">★★★★★</div>
        </div>
        <p class="review-text">«${rev.text}»</p>
        <div class="review-tag">✓ Проверенный отзыв с Яндекс Карт</div>
      </article>
    `).join('');
  }


  // =========================================================================
  // 5. КАЛЬКУЛЯТОР СТОИМОСТИ
  // =========================================================================
  const calcState = {
    product: 'Кухня',
    basePrice: 45000,
    size: 3.0,
    material: 'МДФ в пленке Soft-Touch',
    materialMult: 1.0,
    hasGift: true,
    hasBlum: true,
    hasLed: false,
    messenger: 'whatsapp'
  };

  const calcSizeRange = document.getElementById('calcSizeRange');
  const calcSizeDisplay = document.getElementById('calcSizeDisplay');
  const calcTotalPrice = document.getElementById('calcTotalPrice');
  const calcSavings = document.getElementById('calcSavings');
  const calcPhoneInput = document.getElementById('calcPhoneInput');
  const sendCalcBtn = document.getElementById('sendCalcBtn');

  function updateCalcForBrand(brand) {
    const giftTitle = document.getElementById('calcGiftOptionTitle');
    const giftDesc = document.getElementById('calcGiftOptionDesc');
    const giftBadge = document.getElementById('calcGiftBadge');
    const receiptGiftName = document.getElementById('receiptGiftName');
    const receiptGiftOldPrice = document.getElementById('receiptGiftOldPrice');
    const receiptLogoImg = document.getElementById('receiptLogoImg');

    if (giftTitle) giftTitle.textContent = `${brand.promoGiftName} (По акции в ПОДАРОК 0 ₽)`;
    if (giftDesc) giftDesc.textContent = `Специальный подарок от фабрики «${brand.name}»`;
    if (giftBadge) giftBadge.textContent = `Экономия ${brand.promoGiftSavings}`;
    if (receiptGiftName) receiptGiftName.textContent = `Подарок: ${brand.promoGiftName}`;
    if (receiptGiftOldPrice) receiptGiftOldPrice.textContent = brand.promoGiftSavings;
    if (receiptLogoImg) receiptLogoImg.src = brand.logo;

    updateCalculator();
  }

  function updateCalculator() {
    const itemSubtotal = Math.round(calcState.basePrice * calcState.size * calcState.materialMult);
    let fittingsPrice = calcState.hasBlum ? (calcState.product === 'Столешница из камня' ? 0 : 18000) : 0;
    let ledPrice = calcState.hasLed ? 9500 : 0;

    let giftValue = calcState.hasGift ? parseInt(currentBrand.promoGiftSavings.replace(/\D/g, '') || '45000', 10) : 0;
    let totalSavings = giftValue + Math.round(itemSubtotal * 0.15);

    const total = itemSubtotal + fittingsPrice + ledPrice;

    const receiptItemName = document.getElementById('receiptItemName');
    const receiptItemPrice = document.getElementById('receiptItemPrice');
    const receiptMaterialName = document.getElementById('receiptMaterialName');
    const receiptFittingsRow = document.getElementById('receiptFittingsRow');
    const receiptLedRow = document.getElementById('receiptLedRow');

    if (receiptItemName) receiptItemName.textContent = `${calcState.product} (${calcState.size} м)`;
    if (receiptItemPrice) receiptItemPrice.textContent = `${itemSubtotal.toLocaleString('ru-RU')} ₽`;
    if (receiptMaterialName) receiptMaterialName.textContent = `Фасады: ${calcState.material}`;
    if (receiptFittingsRow) receiptFittingsRow.style.display = (calcState.hasBlum && calcState.product !== 'Столешница из камня') ? 'flex' : 'none';
    if (receiptLedRow) receiptLedRow.style.display = calcState.hasLed ? 'flex' : 'none';

    animateValue(calcTotalPrice, total);
    if (calcSavings) calcSavings.textContent = `~${totalSavings.toLocaleString('ru-RU')} ₽`;
  }

  let currentAnimatedPrice = 153000;
  function animateValue(elem, target) {
    if (!elem) return;
    const start = currentAnimatedPrice;
    const duration = 250;
    const startTime = performance.now();

    function step(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const val = Math.round(start + (target - start) * progress);
      elem.textContent = `${val.toLocaleString('ru-RU')} ₽`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        currentAnimatedPrice = target;
      }
    }
    requestAnimationFrame(step);
  }

  // Слушатели калькулятора
  const calcProductType = document.getElementById('calcProductType');
  if (calcProductType) {
    calcProductType.addEventListener('click', (e) => {
      const chip = e.target.closest('.calc-chip');
      if (!chip) return;
      calcProductType.querySelectorAll('.calc-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      calcState.product = chip.dataset.val;
      calcState.basePrice = parseInt(chip.dataset.base, 10);
      updateCalculator();
    });
  }

  if (calcSizeRange && calcSizeDisplay) {
    calcSizeRange.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      calcState.size = val;
      calcSizeDisplay.textContent = `${val.toFixed(1)} м`;
      updateCalculator();
    });
  }

  const calcMaterial = document.getElementById('calcMaterial');
  if (calcMaterial) {
    calcMaterial.addEventListener('click', (e) => {
      const chip = e.target.closest('.calc-chip');
      if (!chip) return;
      calcMaterial.querySelectorAll('.calc-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      calcState.material = chip.dataset.val;
      calcState.materialMult = parseFloat(chip.dataset.mult);
      updateCalculator();
    });
  }

  const checkStoneGift = document.getElementById('checkStoneGift');
  if (checkStoneGift) {
    checkStoneGift.addEventListener('change', (e) => {
      calcState.hasGift = e.target.checked;
      updateCalculator();
    });
  }
  const checkBlumFittings = document.getElementById('checkBlumFittings');
  if (checkBlumFittings) {
    checkBlumFittings.addEventListener('change', (e) => {
      calcState.hasBlum = e.target.checked;
      updateCalculator();
    });
  }
  const checkLedLighting = document.getElementById('checkLedLighting');
  if (checkLedLighting) {
    checkLedLighting.addEventListener('change', (e) => {
      calcState.hasLed = e.target.checked;
      updateCalculator();
    });
  }

  document.querySelectorAll('.btn-messenger').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-messenger').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calcState.messenger = btn.dataset.msg;
    });
  });

  if (sendCalcBtn) {
    sendCalcBtn.addEventListener('click', () => {
      const phone = calcPhoneInput ? calcPhoneInput.value.trim() : '';
      if (!phone || phone.length < 7) {
        showToast('Пожалуйста, укажите ваш номер телефона для связи', 'error');
        if (calcPhoneInput) calcPhoneInput.focus();
        return;
      }

      const text = `Здравствуйте, ${currentBrand.name}!
Хочу зафиксировать расчет сметы:
• Изделие: ${calcState.product} (${calcState.size} м)
• Материал фасадов: ${calcState.material}
• Подарок по акции (${currentBrand.promoGiftName}): ${calcState.hasGift ? 'Да (0 ₽)' : 'Нет'}
• Фурнитура Blum/Boyard: ${calcState.hasBlum ? 'Да' : 'Нет'}
• LED-подсветка: ${calcState.hasLed ? 'Да' : 'Нет'}
• Ориентир сметы: ${calcTotalPrice.textContent}
• Мой телефон: ${phone}
Жду точный 3D-проект!`;

      if (calcState.messenger === 'whatsapp') {
        window.open(`https://wa.me/${currentBrand.phoneRaw.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
      } else if (calcState.messenger === 'telegram') {
        window.open(currentBrand.telegram, '_blank');
      }

      showToast(`Заявка для «${currentBrand.name}» принята! Технолог свяжется с вами.`, 'success');
      if (calcPhoneInput) calcPhoneInput.value = '';
    });
  }

  window.openCalcFor = function(productName) {
    const calcSection = document.getElementById('calculator');
    if (calcSection) calcSection.scrollIntoView({ behavior: 'smooth' });
    const chip = document.querySelector(`.calc-chip[data-val="${productName}"]`);
    if (chip) chip.click();
  };


  // =========================================================================
  // 6. ТАБЫ ПОРТФОЛИО
  // =========================================================================
  document.querySelectorAll('.portfolio-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.portfolio-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      document.querySelectorAll('.portfolio-card').forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // =========================================================================
  // 7. МОДАЛЬНЫЕ ОКНА
  // =========================================================================
  const measureModal = document.getElementById('measureModal');
  const openMeasureModalBtn = document.getElementById('openMeasureModalBtn');
  const heroMeasureBtn = document.getElementById('heroMeasureBtn');
  const claimPromoBtn = document.getElementById('claimPromoBtn');
  const closeMeasureModalBtn = document.getElementById('closeMeasureModalBtn');
  const measureModalOverlay = document.getElementById('measureModalOverlay');
  const modalForm = document.getElementById('modalForm');

  function openMeasureModal() {
    if (measureModal) measureModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMeasureModal() {
    if (measureModal) measureModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  window.openMeasureModalWithProduct = function(prodName) {
    openMeasureModal();
    const select = document.getElementById('mType');
    if (select) {
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text.includes(prodName) || select.options[i].value.includes(prodName)) {
          select.selectedIndex = i;
          break;
        }
      }
    }
  };

  if (openMeasureModalBtn) openMeasureModalBtn.addEventListener('click', openMeasureModal);
  if (heroMeasureBtn) heroMeasureBtn.addEventListener('click', openMeasureModal);
  if (claimPromoBtn) {
    claimPromoBtn.addEventListener('click', () => {
      openMeasureModalWithProduct('Кухня');
    });
  }
  if (closeMeasureModalBtn) closeMeasureModalBtn.addEventListener('click', closeMeasureModal);
  if (measureModalOverlay) measureModalOverlay.addEventListener('click', closeMeasureModal);

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('mName').value.trim();
      const phone = document.getElementById('mPhone').value.trim();
      const type = document.getElementById('mType').value;

      const text = `Здравствуйте, ${currentBrand.name}!
Заявка на бесплатный выезд замерщика:
• Имя: ${name}
• Телефон: ${phone}
• Что интересует: ${type}
Хочу зафиксировать специальный подарок по акции!`;

      window.open(`https://wa.me/${currentBrand.phoneRaw.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
      closeMeasureModal();
      showToast(`Спасибо, ${name}! Заявка для «${currentBrand.name}» отправлена.`, 'success');
      modalForm.reset();
    });
  }

  const mainMeasureForm = document.getElementById('mainMeasureForm');
  if (mainMeasureForm) {
    mainMeasureForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('userName').value.trim();
      const phone = document.getElementById('userPhone').value.trim();
      const furniture = document.getElementById('furnitureSelect').value;
      const commWay = document.querySelector('input[name="commWay"]:checked').value;

      const text = `Здравствуйте, ${currentBrand.name}!
Заявка на замер с сайта:
• Имя: ${name}
• Телефон: ${phone}
• Изделие: ${furniture}
• Способ связи: ${commWay}
Закрепите за мной подарок по акции!`;

      if (commWay === 'whatsapp') {
        window.open(`https://wa.me/${currentBrand.phoneRaw.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
      } else if (commWay === 'telegram') {
        window.open(currentBrand.telegram, '_blank');
      }

      showToast(`Спасибо, ${name}! Заявка принята.`, 'success');
      mainMeasureForm.reset();
    });
  }

  // Просмотр фото крупно
  const photoModal = document.getElementById('photoModal');
  const photoModalImg = document.getElementById('photoModalImg');
  const photoModalCaption = document.getElementById('photoModalCaption');
  const closePhotoModalBtn = document.getElementById('closePhotoModalBtn');
  const photoModalOverlay = document.getElementById('photoModalOverlay');

  window.openPhotoModal = function(src, caption) {
    if (!photoModal || !photoModalImg) return;
    photoModalImg.src = src;
    if (photoModalCaption) photoModalCaption.textContent = caption || '';
    photoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closePhotoModal() {
    if (photoModal) photoModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closePhotoModalBtn) closePhotoModalBtn.addEventListener('click', closePhotoModal);
  if (photoModalOverlay) photoModalOverlay.addEventListener('click', closePhotoModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMeasureModal();
      closePhotoModal();
    }
  });


  // =========================================================================
  // 8. TOAST УВЕДОМЛЕНИЯ
  // =========================================================================
  function showToast(message, type = 'info') {
    const hub = document.getElementById('toastHub');
    if (!hub) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    hub.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }


  // =========================================================================
  // 9. МОБИЛЬНЫЙ БУРГЕР
  // =========================================================================
  const burgerBtn = document.getElementById('burgerBtn');
  const headerNav = document.getElementById('headerNav');

  if (burgerBtn && headerNav) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = headerNav.classList.toggle('active');
      burgerBtn.classList.toggle('active', isOpen);
      if (isOpen) {
        headerNav.style.display = 'flex';
        headerNav.style.flexDirection = 'column';
        headerNav.style.position = 'absolute';
        headerNav.style.top = '76px';
        headerNav.style.left = '0';
        headerNav.style.right = '0';
        headerNav.style.background = '#14161A';
        headerNav.style.padding = '24px';
        headerNav.style.borderBottom = '1px solid var(--border-subtle)';
      } else {
        headerNav.style.display = '';
      }
    });

    headerNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        headerNav.classList.remove('active');
        burgerBtn.classList.remove('active');
        headerNav.style.display = '';
      });
    });
  }

  // =========================================================================
  // 10. ИНИЦИАЛИЗАЦИЯ
  // =========================================================================
  renderBrand(currentBrand);
});

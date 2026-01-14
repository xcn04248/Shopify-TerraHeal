(function () {
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const $ = (s, r = document) => r.querySelector(s);

  const cache = new Map(); // handle -> product json

  async function fetchProduct(handle) {
    if (!handle) throw new Error("Missing handle");
    if (cache.has(handle)) return cache.get(handle);
    const res = await fetch(`/products/${handle}.js`, { credentials: "same-origin" });
    if (!res.ok) throw new Error(`Failed to load product: ${handle}`);
    const json = await res.json();
    cache.set(handle, json);
    return json;
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  function formatMoney(cents, moneyFormat) {
    // 支持常见的 {{amount}} / {{amount_no_decimals}}
    const amount = (cents / 100).toFixed(2);
    const amountNoDecimals = String(Math.round(cents / 100));

    const fmt = moneyFormat || "{{amount}}";
    return fmt
      .replace(/\{\{\s*amount_no_decimals\s*\}\}/g, amountNoDecimals)
      .replace(/\{\{\s*amount\s*\}\}/g, amount);
  }

  function getOfferConfig(offerEl) {
    const script = $("[data-kb-config]", offerEl);
    return script ? JSON.parse(script.textContent) : {};
  }

  function setSelected(offerEls, selectedEl) {
    offerEls.forEach(el => el.classList.toggle("is-selected", el === selectedEl));
  }

  function getSelectedOffer(offerEls) {
    return offerEls.find(o => $("[data-kb-radio]", o)?.checked) || offerEls[0];
  }

  function findMainProductVariantId(root) {
    // Shrine 的产品表单一般是 form[action*="/cart/add"]，内部会有 input[name="id"]
    // 这里从当前 block 往上找最近的 product-info 容器再找 form
    const host = root.closest("product-info") || document;
    const idInput =
      host.querySelector('form[action*="/cart/add"] input[name="id"]') ||
      document.querySelector('form[action*="/cart/add"] input[name="id"]');

    const vid = Number(idInput?.value || 0);
    if (!vid) throw new Error("找不到主产品的 variant id（input[name='id']）");
    return vid;
  }

  async function renderExpandedItems(root, offerEl) {
    const itemsWrap = $("[data-kb-items]", offerEl);
    if (!itemsWrap) return;

    const moneyFormat = root.getAttribute("data-money-format") || "{{amount}}";

    const item1Handle = itemsWrap.getAttribute("data-item1-handle");
    const item2Handle = itemsWrap.getAttribute("data-item2-handle");

    const item1Qty = Number(itemsWrap.getAttribute("data-item1-qty") || 1);
    const item2Qty = Number(itemsWrap.getAttribute("data-item2-qty") || 1);

    // block 版里 item1Selectable 你可以不传；有 select 就算 selectable
    const item2FixedVariantId = Number(itemsWrap.getAttribute("data-item2-fixed-variant-id") || 0);

    const [p1, p2] = await Promise.all([fetchProduct(item1Handle), fetchProduct(item2Handle)]);

    const p1Default = p1.variants?.[0];
    const p2Default = p2.variants?.[0];
    const p2VariantId = item2FixedVariantId || Number(p2Default?.id || 0);

    const p1Img = p1.images?.[0] || "";
    const p2Img = p2.images?.[0] || "";

    const p1OptionLabel = p1.options?.[0] || "Variant";

    const p1SelectHtml = `
      <div class="kb__variant">
        <div class="kb__variant-label">${escapeHtml(p1OptionLabel)}</div>
        <select class="kb__select" data-kb-item1-select>
          ${p1.variants.map(v => `<option value="${v.id}">${escapeHtml(v.title)}</option>`).join("")}
        </select>
      </div>
    `;

    itemsWrap.innerHTML = `
      <div class="kb__items-box">
        <div class="kb__item" data-kb-item data-item="1" data-qty="${item1Qty}">
          <div class="kb__item-left">
            <div class="kb__thumb">${p1Img ? `<img src="${p1Img}" alt="${escapeHtml(p1.title)}">` : ""}</div>
            <div class="kb__meta">
              <div class="kb__pname">${escapeHtml(p1.title)}</div>
              ${p1SelectHtml}
            </div>
          </div>
          <div class="kb__iprice">${formatMoney(p1.price ?? 0, moneyFormat)}</div>
        </div>

        <div class="kb__plus">+</div>

        <div class="kb__item" data-kb-item data-item="2" data-qty="${item2Qty}">
          <div class="kb__item-left">
            <div class="kb__thumb">${p2Img ? `<img src="${p2Img}" alt="${escapeHtml(p2.title)}">` : ""}</div>
            <div class="kb__meta">
              <div class="kb__pname">${escapeHtml(p2.title)}</div>
            </div>
          </div>
          <div class="kb__iprice">${formatMoney(p2.price ?? 0, moneyFormat)}</div>
          <input type="hidden" data-kb-item2-fixed value="${p2VariantId}">
        </div>
      </div>
    `;

    // 如果 item1 没 variants，兜底
    if (!p1Default?.id) {
      const sel = $("[data-kb-item1-select]", itemsWrap);
      if (sel) sel.disabled = true;
    }
  }

  async function renderPerUnitVariants(root, offerEl) {
  const box = offerEl.querySelector("[data-kb-unit-variants]");
  if (!box) return;

  const handle = box.getAttribute("data-handle");
  const units = Math.max(2, Number(box.getAttribute("data-units") || 2));
  const p = await fetchProduct(handle);

  const optionLabel = p.options?.[0] || "Variant";
  const img = p.images?.[0] || "";
  const moneyFormat = root.getAttribute("data-money-format") || "{{amount}}";

  box.innerHTML = `
    <div class="kb__items-box">
      <div class="kb__item" style="padding-top:0;">
        <div class="kb__item-left">
          <div class="kb__thumb">${img ? `<img src="${img}" alt="${escapeHtml(p.title)}">` : ""}</div>
          <div class="kb__meta">
            <div class="kb__pname">${escapeHtml(p.title)}</div>
            <div class="kb__variant-label" style="margin-top:6px;">${escapeHtml(optionLabel)}</div>
          </div>
        </div>
        <div class="kb__iprice">${formatMoney(p.price ?? 0, moneyFormat)}</div>
      </div>

      <div class="kb__unit-grid" data-kb-unit-grid>
        ${Array.from({ length: units }).map((_, i) => `
          <div class="kb__unit-row">
            <div class="kb__unit-tag"><strong>#${i + 1}</strong></div>
            <select class="kb__select" data-kb-unit-select data-unit="${i}">
              ${p.variants.map(v => `<option value="${v.id}">${escapeHtml(v.title)}</option>`).join("")}
            </select>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function buildItemsFromUnitSelectors(offerEl) {
  const box = offerEl.querySelector("[data-kb-unit-variants]");
  if (!box) return null;

  const selects = Array.from(box.querySelectorAll("select[data-kb-unit-select]"));
  if (!selects.length) throw new Error("Offer 2 变体选择器还没加载完成");

  const counts = new Map(); // variantId -> qty
  for (const sel of selects) {
    const vid = Number(sel.value || 0);
    if (!vid) throw new Error("Offer 2 有未选择的变体");
    counts.set(vid, (counts.get(vid) || 0) + 1);
  }

  return Array.from(counts.entries()).map(([id, quantity]) => ({ id, quantity }));
}

  async function addToCart(items) {
    const res = await fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ items })
    });

    if (!res.ok) {
      let msg = "Add to cart failed";
      try {
        const err = await res.json();
        msg = err?.description || err?.message || msg;
      } catch (_) {}
      throw new Error(msg);
    }
    return res.json();
  }

  async function init(root) {
    const offerEls = $$("[data-kb-offer]", root);
    const addBtn = $("[data-kb-add]", root);
    const note = $("[data-kb-note]", root);

    // 预渲染所有带 data-kb-items 的（通常只有 offer3）
    for (const offerEl of offerEls) {
      if ($("[data-kb-items]", offerEl)) {
        try { await renderExpandedItems(root, offerEl); } catch (e) { console.error(e); }
      }
    }

    // 预渲染 offer2 的每件变体选择器（如果存在）
    for (const offerEl of offerEls) {
      if (offerEl.querySelector("[data-kb-unit-variants]")) {
        try { await renderPerUnitVariants(root, offerEl); } catch (e) { console.error(e); }
      }
    }

    // 选中态
    offerEls.forEach(offerEl => {
      const radio = $("[data-kb-radio]", offerEl);
      radio?.addEventListener("change", () => setSelected(offerEls, offerEl));
    });

    addBtn.addEventListener("click", async () => {
      note.textContent = "";
      addBtn.disabled = true;
      addBtn.classList.add("is-loading");

      try {
        const selected = getSelectedOffer(offerEls);
        const cfg = getOfferConfig(selected);

        const items = [];

        const hasExpanded = !!$("[data-kb-items]", selected);

        if (!hasExpanded) {
            // Offer2 如果开启了 per-unit variants，就按每个下拉统计加购
            const unitItems = buildItemsFromUnitSelectors(selected);
            if (unitItems) {
                items.push(...unitItems);
            } else {
                // Offer1：还是走当前产品表单选中的 variant id × qty
                const mainVariantId = findMainProductVariantId(root);
                const qty = Math.max(1, Number(cfg.qty || 1));
                items.push({ id: mainVariantId, quantity: qty });
            }
        } else {
          // Offer3：item1 取下拉选择；item2 取固定 variant
          const item1Qty = Math.max(1, Number(cfg.qty || 1));

          const item1Select = $("[data-kb-item1-select]", selected);
          const item1VariantId = Number(item1Select?.value || 0);
          if (!item1VariantId) throw new Error("Item 1 variant 未选择");

          const item2VariantId =
            Number(cfg.item2FixedVariantId || 0) ||
            Number($("[data-kb-item2-fixed]", selected)?.value || 0);

          const item2Qty = Math.max(1, Number(cfg.item2Qty || 1));
          if (!item2VariantId) throw new Error("Item 2 variant 缺失");

          items.push({ id: item1VariantId, quantity: item1Qty });
          items.push({ id: item2VariantId, quantity: item2Qty });
        }

        // Gift：从 root data 读取；是否加 gift 由 cfg.addGift 控制
        const addGift = !!cfg.addGift;
        const giftId = Number(root.getAttribute("data-gift-variant-id") || 0);
        const giftQty = Math.max(1, Number(root.getAttribute("data-gift-qty") || 1));
        if (addGift && giftId) items.push({ id: giftId, quantity: giftQty });

        await addToCart(items);

        document.dispatchEvent(new CustomEvent("cart:refresh", { bubbles: true }));
        document.dispatchEvent(new CustomEvent("cart:open", { bubbles: true }));

        note.textContent = "已加入购物车";
      } catch (e) {
        note.textContent = `错误：${e.message}`;
      } finally {
        addBtn.disabled = false;
        addBtn.classList.remove("is-loading");
      }
    });
  }

  function boot() {
    $$("[data-kb-root]").forEach(init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
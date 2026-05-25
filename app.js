/**
 * ==========================================================================
 * NOOR E ARSH POS OPERATIONAL REVENUE ARCHITECTURE CLIENT DRIVER CORE SYSTEM
 * ==========================================================================
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // Structural Hardware Architecture Initialization Handlers
    SystemDatabaseEngine.initializeStorageMatrices();
    ApplicationNavigationController.bindSystemNavigationInterfaces();
    ProductCatalogSubsystem.renderProductCatalogTable();
    BillingTerminalLedgerSystem.synchronizeLedgerLedgibilityState();
    SystemDatabaseEngine.startClockDaemon();
    MicroInteractionsEngine.bindGlobalRippleTriggers();
});

/**
 * ==========================================================================
 * DATA PERSISTENCE DEFINITION LAYER ENGINE (LOCALSTORAGE SAAS-READY ARCH)
 * ==========================================================================
 */
const SystemDatabaseEngine = {
    KEYS: {
        PRODUCT_CATALOG: "NOOR_POS_CATALOG_DATA_V1",
        STORE_CONFIG: "NOOR_POS_STORE_CONFIG_V1",
        ACTIVE_INVOICE: "NOOR_POS_ACTIVE_INVOICE_V1",
        INVOICE_SEQUENCE: "NOOR_POS_INVOICE_SEQ_V1"
    },

    DEFAULT_STORE_SETTINGS: {
        shopName: "NOOR E ARSH POS",
        address: "Habshiguda, Hyderabad",
        phone: "9876543210",
        instagram: "@noorearsh.pos",
        footerMsg: "Thank You. Visit Again."
    },

    initializeStorageMatrices: function() {
        if (!localStorage.getItem(this.KEYS.PRODUCT_CATALOG)) {
            // Seed sample database structures instantly to improve native onboarding realism
            const baselineSeed = [
                { id: "101", name: "Premium Raw Silk Kurta", price: 2499.00 },
                { id: "102", name: "Classic Monochrome Sherwani", price: 8999.00 },
                { id: "103", name: "Asymmetric Luxury Tunic", price: 1850.00 },
                { id: "104", name: "Handcrafted Silver Brooch", price: 1200.00 }
            ];
            localStorage.setItem(this.KEYS.PRODUCT_CATALOG, JSON.stringify(baselineSeed));
        }
        if (!localStorage.getItem(this.KEYS.STORE_CONFIG)) {
            localStorage.setItem(this.KEYS.STORE_CONFIG, JSON.stringify(this.DEFAULT_STORE_SETTINGS));
        }
        if (!localStorage.getItem(this.KEYS.INVOICE_SEQUENCE)) {
            localStorage.setItem(this.KEYS.INVOICE_SEQUENCE, "1001");
        }
        this.hydrateShopSettingsForm();
    },

    getData: function(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            console.error("System Matrix Parse Violation for key: " + key, e);
            return null;
        }
    },

    setData: function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    hydrateShopSettingsForm: function() {
        const config = this.getData(this.KEYS.STORE_CONFIG) || this.DEFAULT_STORE_SETTINGS;
        
        // Form Binding Context Assignments
        document.getElementById("cfg-shop-name").value = config.shopName;
        document.getElementById("cfg-address").value = config.address;
        document.getElementById("cfg-phone").value = config.phone;
        document.getElementById("cfg-instagram").value = config.instagram;
        document.getElementById("cfg-footer-msg").value = config.footerMsg;

        this.applyDynamicBrandingLabels(config);
        
        // Attach Reactive Live-Save Operational Hooks to System Config Interface
        document.querySelectorAll("#settings-form input").forEach(input => {
            input.addEventListener("input", () => this.persistSettingsFormState());
        });
    },

    persistSettingsFormState: function() {
        const structuralDataCapture = {
            shopName: document.getElementById("cfg-shop-name").value || this.DEFAULT_STORE_SETTINGS.shopName,
            address: document.getElementById("cfg-address").value || this.DEFAULT_STORE_SETTINGS.address,
            phone: document.getElementById("cfg-phone").value || this.DEFAULT_STORE_SETTINGS.phone,
            instagram: document.getElementById("cfg-instagram").value || this.DEFAULT_STORE_SETTINGS.instagram,
            footerMsg: document.getElementById("cfg-footer-msg").value || this.DEFAULT_STORE_SETTINGS.footerMsg
        };
        this.setData(this.KEYS.STORE_CONFIG, structuralDataCapture);
        this.applyDynamicBrandingLabels(structuralDataCapture);
    },

    applyDynamicBrandingLabels: function(config) {
        document.querySelectorAll(".shop-name-display").forEach(el => el.textContent = config.shopName.toUpperCase());
    },

    incrementInvoiceSequenceId: function() {
        let currentSequence = parseInt(localStorage.getItem(this.KEYS.INVOICE_SEQUENCE)) || 1001;
        let nextSeq = currentSequence + 1;
        localStorage.setItem(this.KEYS.INVOICE_SEQUENCE, nextSeq.toString());
        return currentSequence;
    },

    startClockDaemon: function() {
        const runClock = () => {
            const timestamp = new Date();
            document.getElementById("live-clock-display").textContent = timestamp.toLocaleTimeString("en-US", { hour12: false });
        };
        runClock();
        setInterval(runClock, 1000);
    }
};

/**
 * ==========================================================================
 * APPLICATION NAVIGATION SWITCHBOARD CONTROLLER INTERFACES
 * ==========================================================================
 */
const ApplicationNavigationController = {
    bindSystemNavigationInterfaces: function() {
        const navDashboard = document.getElementById("nav-to-dashboard");
        const navBilling = document.getElementById("nav-to-billing");
        
        const pageDashboard = document.getElementById("page-dashboard");
        const pageBilling = document.getElementById("page-billing");

        navDashboard.addEventListener("click", () => {
            this.executePageSwitch(navDashboard, navBilling, pageDashboard, pageBilling);
        });

        navBilling.addEventListener("click", () => {
            this.executePageSwitch(navBilling, navDashboard, pageBilling, pageDashboard);
            BillingTerminalLedgerSystem.synchronizeLedgerLedgibilityState();
        });

        // Trigger QR Scanner System Modal Hardware Attachments
        document.getElementById("trigger-scan-modal").addEventListener("click", () => {
            HardwareOpticalScannerSystem.activateOpticalScanningPipeline();
        });

        document.getElementById("close-scanner-modal").addEventListener("click", () => {
            HardwareOpticalScannerSystem.deactivateOpticalScanningPipeline();
        });
    },

    executePageSwitch: function(activeNavBtn, inactiveNavBtn, activePageTarget, inactivePageTarget) {
        inactiveNavBtn.classList.remove("active");
        activeNavBtn.classList.add("active");
        
        inactivePageTarget.classList.remove("active");
        activePageTarget.classList.add("active");
    }
};

/**
 * ==========================================================================
 * PRODUCT CATALOG SUBSYSTEM CONTROLLER MANAGEMENT LAYER
 * ==========================================================================
 */
const ProductCatalogSubsystem = {
    renderProductCatalogTable: function() {
        const catalog = SystemDatabaseEngine.getData(SystemDatabaseEngine.KEYS.PRODUCT_CATALOG) || [];
        const tbody = document.getElementById("inventory-tbody");
        const emptyState = document.getElementById("inventory-empty");
        
        tbody.innerHTML = "";
        
        if (catalog.length === 0) {
            emptyState.classList.remove("hidden");
            return;
        } else {
            emptyState.classList.add("hidden");
        }

        catalog.forEach(product => {
            const tr = document.createElement("tr");
            tr.className = "animated-table-row";
            tr.innerHTML = `
                <td style="font-family: monospace; font-weight:600;">${product.id}</td>
                <td style="font-weight:500;">${product.name}</td>
                <td>₹${parseFloat(product.price).toFixed(2)}</td>
                <td style="text-align: right;">
                    <button class="row-delete-btn" data-id="${product.id}">&times;</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        this.bindCatalogEventTriggers();
    },

    bindCatalogEventTriggers: function() {
        // Intercept Submission Paths for Creation Matrix Forms
        const creationForm = document.getElementById("product-form");
        creationForm.onsubmit = (e) => {
            e.preventDefault();
            this.executeProductProvisioningPipeline();
        };

        // Intercept Deletion Operations Execution Pipeline Tasks
        document.querySelectorAll(".row-delete-btn").forEach(btn => {
            btn.onclick = (e) => {
                const targetSku = e.target.getAttribute("data-id");
                this.deprovisionProductSkuItem(targetSku);
            };
        });

        // Handle Live Predictive Inventory Filtration Tasks
        document.getElementById("search-inventory").oninput = (e) => {
            this.filterInventoryArchiveDisplay(e.target.value);
        };
    },

    executeProductProvisioningPipeline: function() {
        const skuId = document.getElementById("prod-id").value.trim();
        const nomenclature = document.getElementById("prod-name").value.trim();
        const priceValuation = parseFloat(document.getElementById("prod-price").value);

        let catalog = SystemDatabaseEngine.getData(SystemDatabaseEngine.KEYS.PRODUCT_CATALOG) || [];
        
        // Reject operational overlapping structural duplicate primary key definitions
        const overlapIndex = catalog.findIndex(item => item.id === skuId);
        if (overlapIndex > -1) {
            catalog[overlapIndex] = { id: skuId, name: nomenclature, price: priceValuation };
        } else {
            catalog.push({ id: skuId, name: nomenclature, price: priceValuation });
        }

        SystemDatabaseEngine.setData(SystemDatabaseEngine.KEYS.PRODUCT_CATALOG, catalog);
        this.renderProductCatalogTable();
        document.getElementById("product-form").reset();
    },

    deprovisionProductSkuItem: function(skuId) {
        let catalog = SystemDatabaseEngine.getData(SystemDatabaseEngine.KEYS.PRODUCT_CATALOG) || [];
        catalog = catalog.filter(item => item.id !== skuId);
        SystemDatabaseEngine.setData(SystemDatabaseEngine.KEYS.PRODUCT_CATALOG, catalog);
        this.renderProductCatalogTable();
    },

    filterInventoryArchiveDisplay: function(queryString) {
        const cleanedQuery = queryString.toLowerCase().trim();
        const rows = document.querySelectorAll("#inventory-tbody tr");
        
        rows.forEach(row => {
            const textSpace = row.textContent.toLowerCase();
            row.style.display = textSpace.includes(cleanedQuery) ? "" : "none";
        });
    }
};

/**
 * ==========================================================================
 * REAL-TIME TRANSACTION TERMINAL LEDGER & CALCULATION ENGINE
 * ==========================================================================
 */
const BillingTerminalLedgerSystem = {
    getLiveInvoiceState: function() {
        return SystemDatabaseEngine.getData(SystemDatabaseEngine.KEYS.ACTIVE_INVOICE) || [];
    },

    persistActiveInvoiceState: function(invoiceLedgerState) {
        SystemDatabaseEngine.setData(SystemDatabaseEngine.KEYS.ACTIVE_INVOICE, invoiceLedgerState);
        this.synchronizeLedgerLedgibilityState();
    },

    registerScannedSkuToLedger: function(skuId) {
        const catalog = SystemDatabaseEngine.getData(SystemDatabaseEngine.KEYS.PRODUCT_CATALOG) || [];
        const targetedProduct = catalog.find(item => item.id === skuId.toString().trim());

        if (!targetedProduct) {
            this.triggerScannerFeedbackNotification("SKU ARCHIVE REJECTED / INVALID", false);
            return false;
        }

        let activeInvoice = this.getLiveInvoiceState();
        const matchedLineIndex = activeInvoice.findIndex(line => line.product.id === skuId.toString().trim());

        if (matchedLineIndex > -1) {
            activeInvoice[matchedLineIndex].quantity += 1;
        } else {
            activeInvoice.push({ product: targetedProduct, quantity: 1 });
        }

        this.persistActiveInvoiceState(activeInvoice);
        this.triggerScannerFeedbackNotification(`ADDED: ${targetedProduct.name.toUpperCase()}`, true);
        return true;
    },

    adjustInvoiceLineQuantity: function(skuId, differentialDelta) {
        let activeInvoice = this.getLiveInvoiceState();
        const lineIndex = activeInvoice.findIndex(line => line.product.id === skuId.toString().trim());

        if (lineIndex > -1) {
            activeInvoice[lineIndex].quantity += differentialDelta;
            if (activeInvoice[lineIndex].quantity <= 0) {
                activeInvoice.splice(lineIndex, 1);
            }
            this.persistActiveInvoiceState(activeInvoice);
        }
    },

    synchronizeLedgerLedgibilityState: function() {
        const activeInvoice = this.getLiveInvoiceState();
        const tbody = document.getElementById("billing-tbody");
        const emptyStateBlock = document.getElementById("billing-empty");
        const currentSequence = localStorage.getItem(SystemDatabaseEngine.KEYS.INVOICE_SEQUENCE) || "1001";
        
        document.getElementById("bill-number-display").textContent = `INV-${currentSequence}`;
        tbody.innerHTML = "";

        if (activeInvoice.length === 0) {
            emptyStateBlock.classList.remove("hidden");
            this.recalculateFinancialAggregates(0);
            this.bindManualEntryOverrideControls();
            return;
        } else {
            emptyStateBlock.classList.add("hidden");
        }

        let structuralSubtotalAccumulator = 0;

        activeInvoice.forEach(line => {
            const operationalAggregateLinePrice = line.product.price * line.quantity;
            structuralSubtotalAccumulator += operationalAggregateLinePrice;

            const tr = document.createElement("tr");
            tr.className = "animated-table-row";
            tr.innerHTML = `
                <td>
                    <div style="font-weight:600; color:var(--color-pure-white);">${line.product.name}</div>
                    <div style="font-size:10px; color:var(--color-muted-gray); font-family:monospace; margin-top:2px;">SKU: ${line.product.id}</div>
                </td>
                <td style="text-align: center;">
                    <div class="quantity-control-cluster">
                        <button class="qty-adjust-btn decrement-trigger" data-id="${line.product.id}">-</button>
                        <span class="qty-display-value">${line.quantity}</span>
                        <button class="qty-adjust-btn increment-trigger" data-id="${line.product.id}">+</button>
                    </div>
                </td>
                <td style="text-align: right; color:var(--color-muted-gray);">₹${parseFloat(line.product.price).toFixed(2)}</td>
                <td style="text-align: right; font-weight:600;">₹${parseFloat(operationalAggregateLinePrice).toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });

        this.recalculateFinancialAggregates(structuralSubtotalAccumulator);
        this.bindLedgerAdjustmentTriggers();
    },

    bindLedgerAdjustmentTriggers: function() {
        document.querySelectorAll(".decrement-trigger").forEach(btn => {
            btn.onclick = () => this.adjustInvoiceLineQuantity(btn.getAttribute("data-id"), -1);
        });

        document.querySelectorAll(".increment-trigger").forEach(btn => {
            btn.onclick = () => this.adjustInvoiceLineQuantity(btn.getAttribute("data-id"), 1);
        });

        document.getElementById("btn-clear-bill").onclick = () => this.purgeActiveInvoiceDraft();
        document.getElementById("btn-print-bill").onclick = () => this.executeThermalInvoicePrintPipeline();
    },

    bindManualEntryOverrideControls: function() {
        document.getElementById("btn-manual-add").onclick = () => {
            const manualSkuInput = document.getElementById("manual-sku-input");
            const value = manualSkuInput.value.trim();
            if (value) {
                const resolutionSuccess = this.registerScannedSkuToLedger(value);
                if (resolutionSuccess) manualSkuInput.value = "";
            }
        };
    },

    recalculateFinancialAggregates: function(subtotalValue) {
        const computedTaxValue = subtotalValue * 0.18; // Integrated GST System Base Metric Standard Formulation
        const grandSettlementTotal = subtotalValue + computedTaxValue;

        document.getElementById("fin-subtotal").textContent = `₹${subtotalValue.toFixed(2)}`;
        document.getElementById("fin-tax").textContent = `₹${computedTaxValue.toFixed(2)}`;
        document.getElementById("fin-total").textContent = `₹${grandSettlementTotal.toFixed(2)}`;
    },

    purgeActiveInvoiceDraft: function() {
        this.persistActiveInvoiceState([]);
    },

    triggerScannerFeedbackNotification: function(msg, isSuccess) {
        const targetFeedbackTray = document.getElementById("scanner-feedback-msg");
        if (!targetFeedbackTray) return;

        targetFeedbackTray.textContent = msg;
        targetFeedbackTray.style.color = isSuccess ? "var(--color-success-green)" : "#ff453a";

        if (isSuccess) {
            const viewport = document.querySelector(".scanner-optical-viewport");
            viewport.classList.add("optical-capture-success-glow");
            setTimeout(() => viewport.classList.remove("optical-capture-success-glow"), 750);
            
            // Native UI Hardware API Emulation Handlers
            if (navigator.vibrate) navigator.vibrate(60);
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(880, audioCtx.currentTime); // Crisp High-Fidelity Tone Pitch
                gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
                osc.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.12);
            } catch (e) { console.log("Audio infrastructure sleep bypassed."); }
        }
    },

    executeThermalInvoicePrintPipeline: function() {
        const activeInvoice = this.getLiveInvoiceState();
        if (activeInvoice.length === 0) return;

        const storeConfig = SystemDatabaseEngine.getData(SystemDatabaseEngine.KEYS.STORE_CONFIG) || SystemDatabaseEngine.DEFAULT_STORE_SETTINGS;
        const targetReceiptDOM = document.getElementById("thermal-print-window-receipt");
        const targetSequenceId = SystemDatabaseEngine.incrementInvoiceSequenceId();

        let structuralSubtotalAccumulator = 0;
        let lineItemMarkupStrings = "";

        activeInvoice.forEach(line => {
            const linesAggregatePrice = line.product.price * line.quantity;
            structuralSubtotalAccumulator += linesAggregatePrice;
            lineItemMarkupStrings += `
                <div class="receipt-line-item-row">
                    <span>${line.product.name} x${line.quantity}</span>
                    <span>₹${linesAggregatePrice.toFixed(2)}</span>
                </div>
            `;
        });

        const computedGstTax = structuralSubtotalAccumulator * 0.18;
        const calculatedGrandTotal = structuralSubtotalAccumulator + computedGstTax;

        targetReceiptDOM.innerHTML = `
            <div class="receipt-center-wrapper">
                <div class="receipt-store-title">${storeConfig.shopName}</div>
                <div class="receipt-meta-text">${storeConfig.address}</div>
                <div class="receipt-meta-text">Phone: ${storeConfig.phone}</div>
                <div class="receipt-meta-text" style="font-family:monospace; margin-top:2mm;">INV-${targetSequenceId} | ${new Date().toLocaleDateString()}</div>
            </div>
            <div class="receipt-separator"></div>
            ${lineItemMarkupStrings}
            <div class="receipt-separator"></div>
            <div class="receipt-financials-aggregate-block">
                <div class="receipt-financials-row">
                    <span>SUBTOTAL</span>
                    <span>₹${structuralSubtotalAccumulator.toFixed(2)}</span>
                </div>
                <div class="receipt-financials-row">
                    <span>CGST+SGST (18%)</span>
                    <span>₹${computedGstTax.toFixed(2)}</span>
                </div>
                <div class="receipt-financials-row receipt-grand-settlement">
                    <span>TOTAL DUE</span>
                    <span>₹${calculatedGrandTotal.toFixed(2)}</span>
                </div>
            </div>
            <div class="receipt-separator"></div>
            <div class="receipt-center-wrapper" style="margin-top: 4mm;">
                <div class="receipt-meta-text">${storeConfig.footerMsg}</div>
                <div class="receipt-meta-text" style="font-weight:600;">Instagram: ${storeConfig.instagram}</div>
            </div>
        `;

        // Dispatch Native Execution Print Pipeline Request Interrupt Vectors
        window.print();
        
        // Wipe Transaction State Arrays upon completion of receipt emission
        this.purgeActiveInvoiceDraft();
    }
};

/**
 * ==========================================================================
 * HARDWARE LAYER CONTROLLER: OPTICAL SCANNING DRIVER MODULE
 * ==========================================================================
 */
const HardwareOpticalScannerSystem = {
    html5QrCodeInstance: null,

    activateOpticalScanningPipeline: function() {
        const modalOverlay = document.getElementById("scanner-modal");
        modalOverlay.classList.add("active");
        document.getElementById("scanner-feedback-msg").textContent = "ALIGN HARDWARE QR WITH RETICLE TARGET";
        document.getElementById("scanner-feedback-msg").style.color = "var(--color-muted-gray)";

        // Initialize Native Device Video Layer Captures
        this.html5QrCodeInstance = new Html5Qrcode("scanner-hardware-stream");
        const hardwareConfig = { fps: 24, qrbox: (width, height) => { return { width: width * 0.7, height: height * 0.7 }; } };

        this.html5QrCodeInstance.start(
            { facingMode: "environment" }, // Prioritize crisp wide focus rear main sensors
            hardwareConfig,
            (decodedText) => { this.processValidatedOpticalMatrixPayload(decodedText); },
            () => { /* Quietly swallow frame error exceptions to maintain processing frame stability */ }
        ).catch(() => {
            // Graceful platform fallbacks optimized for virtual terminal environments inside desktop development modes
            document.getElementById("scanner-feedback-msg").textContent = "ENVIRONMENT CAMERA NOT FOUND — EMULATING OVERRIDE";
            this.executeDevelopmentEnvironmentMockInterception();
        });
    },

    deactivateOpticalScanningPipeline: function() {
        const modalOverlay = document.getElementById("scanner-modal");
        modalOverlay.classList.remove("active");

        if (this.html5QrCodeInstance) {
            try {
                this.html5QrCodeInstance.stop().then(() => this.html5QrCodeInstance.clear());
            } catch(e) { /* Execution context safely terminated */ }
        }
    },

    processValidatedOpticalMatrixPayload: function(decodedContent) {
        if (decodedContent) {
            BillingTerminalLedgerSystem.registerScannedSkuToLedger(decodedContent);
        }
    },

    executeDevelopmentEnvironmentMockInterception: function() {
        // Automatically provision responsive mock buttons inside test setups if no physical camera array target registers
        const interactionTray = document.getElementById("scanner-feedback-msg");
        const catalog = SystemDatabaseEngine.getData(SystemDatabaseEngine.KEYS.PRODUCT_CATALOG) || [];
        
        let customMockMarkup = `<div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap; justify-content:center;">`;
        catalog.forEach(item => {
            customMockMarkup += `<button class="btn btn-secondary mock-scan-btn" data-sku="${item.id}" style="padding:6px 10px; font-size:10px;">Simulate SKU ${item.id}</button>`;
        });
        customMockMarkup += `</div>`;
        
        interactionTray.innerHTML = `<span>CAMERA ARRAYS UNREACHABLE — INJECTING EMULATION CODES</span>` + customMockMarkup;
        
        document.querySelectorAll(".mock-scan-btn").forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                this.processValidatedOpticalMatrixPayload(btn.getAttribute("data-sku"));
            };
        });
    }
};

/**
 * ==========================================================================
 * EXPERT DESIGN INTERACTION LAYER SYSTEM (RIPPLES & MICRO-INTERACTIONS)
 * ==========================================================================
 */
const MicroInteractionsEngine = {
    bindGlobalRippleTriggers: function() {
        document.body.addEventListener("click", (e) => {
            const targetRippleElement = e.target.closest(".ripple");
            if (targetRippleElement) {
                this.injectVisualFeedbackRipple(e, targetRippleElement);
            }
        });
    },

    injectVisualFeedbackRipple: function(eventInstance, targetElement) {
        const rippleCircle = document.createElement("span");
        rippleCircle.className = "ripple-effect";
        
        const positionalBoundingBox = targetElement.getBoundingClientRect();
        const absoluteCalculatedX = eventInstance.clientX - positionalBoundingBox.left;
        const absoluteCalculatedY = eventInstance.clientY - positionalBoundingBox.top;

        rippleCircle.style.left = `${absoluteCalculatedX}px`;
        rippleCircle.style.top = `${absoluteCalculatedY}px`;

        targetElement.appendChild(rippleCircle);
        rippleCircle.addEventListener("animationend", () => rippleCircle.remove());
    }
};
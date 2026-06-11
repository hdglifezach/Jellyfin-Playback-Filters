(function playbackFiltersPlugin() {
    'use strict';

    if (window.playbackFiltersPluginLoaded) {
        return;
    }
    window.playbackFiltersPluginLoaded = true;

    const storageKey = 'jellyfin-playback-filter';
    const customPresetsKey = 'jellyfin-playback-custom-filters';
    const builtInPresets = [
        { id: 'none', group: 'Off', name: 'Off', css: 'none' },

        { id: 'cinema', group: 'Movie', name: 'Cinema', css: 'contrast(1.1) saturate(0.92) brightness(0.96)' },
        { id: 'blockbuster', group: 'Movie', name: 'Blockbuster', css: 'contrast(1.16) saturate(1.22) brightness(0.96)' },
        { id: 'warm-film', group: 'Movie', name: 'Warm Film', css: 'sepia(0.16) saturate(1.08) contrast(1.08) brightness(0.98)' },
        { id: 'cool-thriller', group: 'Movie', name: 'Cool Thriller', css: 'sepia(0.08) hue-rotate(155deg) saturate(0.94) contrast(1.14)' },
        { id: 'horror', group: 'Movie', name: 'Horror', css: 'saturate(0.62) contrast(1.32) brightness(0.76)' },
        { id: 'dreamy', group: 'Movie', name: 'Dreamy', css: 'brightness(1.08) contrast(0.88) saturate(0.82) blur(0.45px)' },
        { id: 'vintage-film', group: 'Movie', name: 'Vintage Film', css: 'sepia(0.34) saturate(0.78) contrast(1.12) brightness(0.94)' },
        { id: 'silent-film', group: 'Movie', name: 'Silent Film', css: 'grayscale(1) contrast(1.34) brightness(1.04) sepia(0.08)' },
        { id: 'old-western', group: 'Movie', name: 'Old Western', css: 'sepia(0.72) saturate(0.72) contrast(1.22) brightness(0.92)' },

        { id: 'grayscale', group: 'Black & White', name: 'Classic B&W', css: 'grayscale(1)' },
        { id: 'noir', group: 'Black & White', name: 'Noir', css: 'grayscale(1) contrast(1.28) brightness(0.92)' },
        { id: 'hard-noir', group: 'Black & White', name: 'Hard Noir', css: 'grayscale(1) contrast(1.62) brightness(0.78)' },
        { id: 'silver-screen', group: 'Black & White', name: 'Silver Screen', css: 'grayscale(1) contrast(1.12) brightness(1.06)' },
        { id: 'newspaper', group: 'Black & White', name: 'Newspaper', css: 'grayscale(1) contrast(1.42) brightness(1.08)' },
        { id: 'faded-bw', group: 'Black & White', name: 'Faded B&W', css: 'grayscale(1) contrast(0.82) brightness(1.08)' },

        { id: 'vivid', group: 'Color', name: 'Vivid', css: 'saturate(1.45) contrast(1.1)' },
        { id: 'warm', group: 'Color', name: 'Warm', css: 'sepia(0.22) saturate(1.18) brightness(1.03)' },
        { id: 'cool', group: 'Color', name: 'Cool', css: 'sepia(0.12) hue-rotate(155deg) saturate(1.12)' },
        { id: 'sunset', group: 'Color', name: 'Sunset', css: 'sepia(0.32) saturate(1.42) hue-rotate(340deg) contrast(1.05)' },
        { id: 'underwater', group: 'Color', name: 'Underwater', css: 'sepia(0.18) hue-rotate(135deg) saturate(1.48) brightness(0.92)' },
        { id: 'pastel', group: 'Color', name: 'Pastel', css: 'saturate(0.72) contrast(0.84) brightness(1.12)' },
        { id: 'sepia', group: 'Color', name: 'Sepia', css: 'sepia(0.82) contrast(1.08)' },

        { id: 'dim', group: 'Comfort', name: 'Dim', css: 'brightness(0.68) contrast(1.06)' },
        { id: 'night', group: 'Comfort', name: 'Night', css: 'sepia(0.18) brightness(0.62) contrast(1.02)' },
        { id: 'low-contrast', group: 'Comfort', name: 'Soft Contrast', css: 'contrast(0.78) brightness(1.03) saturate(0.9)' },
        { id: 'high-contrast', group: 'Comfort', name: 'High Contrast', css: 'contrast(1.48) saturate(0.92)' },
        { id: 'desaturated', group: 'Comfort', name: 'Low Color', css: 'saturate(0.38) contrast(1.04)' },

        { id: 'comic', group: 'Fun', name: 'Comic Book', css: 'saturate(1.9) contrast(1.5) brightness(1.04)' },
        { id: 'candy', group: 'Fun', name: 'Candy', css: 'saturate(2.25) contrast(0.92) brightness(1.12)' },
        { id: 'alien', group: 'Fun', name: 'Alien Vision', css: 'hue-rotate(105deg) saturate(2) contrast(1.2)' },
        { id: 'mars', group: 'Fun', name: 'Life on Mars', css: 'sepia(0.55) hue-rotate(320deg) saturate(2.1) contrast(1.15)' },
        { id: 'radioactive', group: 'Fun', name: 'Radioactive', css: 'hue-rotate(70deg) saturate(3) contrast(1.35) brightness(1.05)' },
        { id: 'rainbow', group: 'Fun', name: 'Rainbow Shift', css: 'saturate(1.7)', animation: 'playbackFilterRainbow 7s linear infinite' },
        { id: 'negative', group: 'Fun', name: 'Negative', css: 'invert(1)' },
        { id: 'xray', group: 'Fun', name: 'X-Ray', css: 'invert(1) grayscale(1) contrast(1.45)' },
        { id: 'mystery', group: 'Fun', name: 'Mystery Colors', css: 'hue-rotate(220deg) saturate(1.8)' },
        { id: 'tiny-tv', group: 'Fun', name: 'Tiny TV', css: 'contrast(1.22) saturate(0.78) blur(0.75px)' }
        ,{ id: 'crt', group: 'Retro TV', name: 'CRT Television', css: 'contrast(1.22) saturate(0.82) brightness(0.9) blur(0.35px)' }
        ,{ id: 'vhs', group: 'Retro TV', name: 'VHS Tape', css: 'contrast(0.88) saturate(0.68) brightness(1.04) blur(0.65px)' }
        ,{ id: 'security', group: 'Retro TV', name: 'Security Camera', css: 'grayscale(1) contrast(1.45) brightness(0.88)' }
        ,{ id: 'broken-tv', group: 'Retro TV', name: 'Broken TV', css: 'hue-rotate(18deg) saturate(1.7) contrast(1.35) blur(0.5px)' }
    ];

    function loadCustomPresets() {
        try {
            return JSON.parse(localStorage.getItem(customPresetsKey) || '[]');
        } catch {
            return [];
        }
    }

    let presets = [...builtInPresets, ...loadCustomPresets()];
    let selectedId = localStorage.getItem(storageKey) || 'none';
    let panel;
    let studio;
    let scanScheduled = false;

    function selectedPreset() {
        return presets.find((preset) => preset.id === selectedId) || presets[0];
    }

    function applyFilter() {
        const preset = selectedPreset();
        document.querySelectorAll('.videoPlayerContainer video, video.htmlvideoplayer').forEach((video) => {
            if (video.style.filter !== preset.css) {
                video.style.filter = preset.css;
            }
            if (video.style.webkitFilter !== preset.css) {
                video.style.webkitFilter = preset.css;
            }
            const animation = preset.animation || '';
            if (video.style.animation !== animation) {
                video.style.animation = animation;
            }
        });

        document.querySelectorAll('.playbackFilterButton').forEach((button) => {
            const title = `Playback filter: ${preset.name}`;
            if (button.title !== title) {
                button.title = title;
            }
            const icon = button.querySelector('.material-icons');
            const iconName = preset.id === 'none' ? 'filter_b_and_w' : 'filter_vintage';
            if (icon && icon.textContent !== iconName) {
                icon.textContent = iconName;
            }
        });

        if (panel) {
            panel.querySelectorAll('button').forEach((button) => {
                button.classList.toggle('selected', button.dataset.filterId === preset.id);
            });
        }
    }

    function chooseFilter(id) {
        selectedId = presets.some((preset) => preset.id === id) ? id : 'none';
        localStorage.setItem(storageKey, selectedId);
        applyFilter();
    }

    function createPanel() {
        panel = document.createElement('div');
        panel.className = 'playbackFilterPanel';
        panel.setAttribute('role', 'menu');
        panel.addEventListener('wheel', (event) => {
            event.stopPropagation();
        }, { passive: true });

        const studioButton = document.createElement('button');
        studioButton.type = 'button';
        studioButton.className = 'playbackFilterStudioButton';
        studioButton.textContent = 'Custom Filter Studio';
        studioButton.addEventListener('click', (event) => {
            event.stopPropagation();
            panel.hidden = true;
            openStudio();
        });
        panel.appendChild(studioButton);

        let currentGroup;
        presets.forEach((preset) => {
            if (preset.group !== currentGroup) {
                currentGroup = preset.group;
                const heading = document.createElement('div');
                heading.className = 'playbackFilterGroup';
                heading.textContent = currentGroup;
                panel.appendChild(heading);
            }

            const option = document.createElement('button');
            option.type = 'button';
            option.dataset.filterId = preset.id;
            option.textContent = preset.name;
            option.addEventListener('click', (event) => {
                event.stopPropagation();
                chooseFilter(preset.id);
                panel.hidden = true;
            });
            panel.appendChild(option);
        });

        panel.hidden = true;
        return panel;
    }

    function filterCss(values) {
        return `brightness(${values.brightness}%) contrast(${values.contrast}%) saturate(${values.saturation}%) grayscale(${values.grayscale}%) sepia(${values.sepia}%) hue-rotate(${values.hue}deg) invert(${values.invert}%) blur(${values.blur}px)`;
    }

    function openStudio() {
        if (studio?.isConnected) {
            studio.hidden = false;
            return;
        }

        const defaults = { brightness: 100, contrast: 100, saturation: 100, grayscale: 0, sepia: 0, hue: 0, invert: 0, blur: 0 };
        const controls = [
            ['brightness', 'Brightness', 20, 180, 1],
            ['contrast', 'Contrast', 20, 220, 1],
            ['saturation', 'Saturation', 0, 300, 1],
            ['grayscale', 'Grayscale', 0, 100, 1],
            ['sepia', 'Sepia', 0, 100, 1],
            ['hue', 'Hue', 0, 360, 1],
            ['invert', 'Invert', 0, 100, 1],
            ['blur', 'Blur', 0, 4, 0.1]
        ];
        const values = { ...defaults };

        studio = document.createElement('div');
        studio.className = 'playbackFilterStudio';
        studio.innerHTML = '<div class="studioHeader"><strong>Custom Filter Studio</strong><button type="button" class="studioClose">×</button></div><div class="studioControls"></div><div class="studioFooter"><input class="studioName" maxlength="40" placeholder="Preset name"><button type="button" class="studioReset">Reset</button><button type="button" class="studioSave">Save preset</button></div><div class="studioSaved"></div>';
        studio.addEventListener('wheel', (event) => event.stopPropagation(), { passive: true });
        const controlsHost = studio.querySelector('.studioControls');

        function preview() {
            const css = filterCss(values);
            document.querySelectorAll('.videoPlayerContainer video, video.htmlvideoplayer').forEach((video) => {
                video.style.animation = '';
                video.style.filter = css;
                video.style.webkitFilter = css;
            });
        }

        function reset() {
            Object.assign(values, defaults);
            controlsHost.querySelectorAll('input').forEach((input) => {
                input.value = values[input.dataset.key];
                input.nextElementSibling.textContent = input.value;
            });
            preview();
        }

        function renderSaved() {
            const savedHost = studio.querySelector('.studioSaved');
            savedHost.innerHTML = '';
            loadCustomPresets().forEach((preset) => {
                const row = document.createElement('div');
                row.innerHTML = `<button type="button" class="studioUse">${preset.name}</button><button type="button" class="studioDelete" title="Delete">×</button>`;
                row.querySelector('.studioUse').addEventListener('click', () => {
                    presets = [...builtInPresets, ...loadCustomPresets()];
                    chooseFilter(preset.id);
                    studio.hidden = true;
                });
                row.querySelector('.studioDelete').addEventListener('click', () => {
                    localStorage.setItem(customPresetsKey, JSON.stringify(loadCustomPresets().filter((item) => item.id !== preset.id)));
                    presets = [...builtInPresets, ...loadCustomPresets()];
                    if (selectedId === preset.id) chooseFilter('none');
                    renderSaved();
                });
                savedHost.appendChild(row);
            });
        }

        controls.forEach(([key, label, min, max, step]) => {
            const row = document.createElement('label');
            row.innerHTML = `<span>${label}</span><input type="range" data-key="${key}" min="${min}" max="${max}" step="${step}" value="${values[key]}"><output>${values[key]}</output>`;
            const input = row.querySelector('input');
            input.addEventListener('input', () => {
                values[key] = Number(input.value);
                input.nextElementSibling.textContent = input.value;
                preview();
            });
            controlsHost.appendChild(row);
        });

        studio.querySelector('.studioClose').addEventListener('click', () => {
            studio.hidden = true;
            applyFilter();
        });
        studio.querySelector('.studioReset').addEventListener('click', reset);
        studio.querySelector('.studioSave').addEventListener('click', () => {
            const name = studio.querySelector('.studioName').value.trim();
            if (!name) return;
            const saved = loadCustomPresets();
            const preset = { id: `custom-${Date.now()}`, group: 'My Filters', name, css: filterCss(values) };
            saved.push(preset);
            localStorage.setItem(customPresetsKey, JSON.stringify(saved));
            presets = [...builtInPresets, ...saved];
            chooseFilter(preset.id);
            renderSaved();
        });
        renderSaved();
        document.body.appendChild(studio);
        preview();
    }

    function createFilterButton() {
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('is', 'paper-icon-button-light');
        button.className = 'playbackFilterButton autoSize paper-icon-button-light';
        button.setAttribute('aria-label', 'Playback filter');
        button.innerHTML = '<span class="xlargePaperIconButton material-icons" aria-hidden="true">filter_b_and_w</span>';
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            if (!panel || !panel.isConnected) {
                document.body.appendChild(createPanel());
            }
            const rect = button.getBoundingClientRect();
            panel.style.left = `${Math.max(10, Math.min(rect.left, window.innerWidth - 230))}px`;
            panel.style.bottom = `${Math.max(10, window.innerHeight - rect.top + 8)}px`;
            panel.hidden = !panel.hidden;
        });
        return button;
    }

    function addControls(container, anchor) {
        const existingButton = document.querySelector('.playbackFilterButton');
        if (existingButton) {
            if (anchor && anchor.nextElementSibling !== existingButton) {
                anchor.insertAdjacentElement('afterend', existingButton);
            }
            return;
        }

        const button = createFilterButton();
        if (anchor) {
            anchor.insertAdjacentElement('afterend', button);
        } else {
            container.appendChild(button);
        }
        applyFilter();
    }

    function scan() {
        scanScheduled = false;
        const volumeControl = document.querySelector('.videoOsdBottom .volumeButtons');
        const settingsButton = document.querySelector('.videoOsdBottom .btnVideoOsdSettings');
        const anchor = volumeControl || settingsButton?.previousElementSibling;
        const container = anchor?.parentElement
            || document.querySelector('.videoOsdBottom .buttons.focuscontainer-x')
            || document.querySelector('.videoOsdBottom .buttons')
            || document.querySelector('.videoOsdBottom .focuscontainer-x')
            || document.querySelector('.videoOsdBottom');
        if (container) {
            addControls(container, anchor);
        }
        applyFilter();
    }

    function scheduleScan() {
        if (scanScheduled) {
            return;
        }
        scanScheduled = true;
        window.requestAnimationFrame(scan);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes playbackFilterRainbow {
            from { filter: hue-rotate(0deg) saturate(1.7); }
            to { filter: hue-rotate(360deg) saturate(1.7); }
        }
        @media (prefers-reduced-motion: reduce) {
            .videoPlayerContainer video,
            video.htmlvideoplayer {
                animation-duration: 20s !important;
            }
        }
        .playbackFilterButton {
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            min-width: 3.2em;
            min-height: 3.2em;
            color: #fff;
            cursor: pointer;
        }
        .playbackFilterPanel {
            position: fixed;
            z-index: 10003;
            display: grid;
            min-width: 210px;
            max-height: min(70vh, 620px);
            overflow-y: auto;
            padding: 7px;
            gap: 3px;
            border-radius: 10px;
            background: rgba(18,18,18,.93);
            box-shadow: 0 8px 28px rgba(0,0,0,.5);
        }
        .playbackFilterPanel[hidden] { display: none; }
        .playbackFilterGroup {
            position: sticky;
            top: 0;
            padding: 9px 10px 5px;
            background: rgba(18,18,18,.98);
            color: #aaa;
            font-size: .78em;
            font-weight: 700;
            letter-spacing: .08em;
            text-transform: uppercase;
        }
        .playbackFilterPanel button {
            border: 0;
            border-radius: 7px;
            padding: 9px 12px;
            background: transparent;
            color: #fff;
            text-align: left;
            font: inherit;
            cursor: pointer;
        }
        .playbackFilterPanel button:hover,
        .playbackFilterPanel button.selected { background: #00a4dc; }
        .playbackFilterStudioButton { margin-bottom: 4px; background: rgba(155,92,255,.28) !important; font-weight: 700 !important; }
        .playbackFilterStudio {
            position: fixed; z-index: 10005; left: 50%; top: 50%; transform: translate(-50%,-50%);
            width: min(560px, calc(100vw - 30px)); max-height: 82vh; overflow-y: auto;
            border-radius: 14px; padding: 18px; background: rgba(18,18,24,.98); color: #fff;
            box-shadow: 0 20px 80px rgba(0,0,0,.7);
        }
        .playbackFilterStudio[hidden] { display: none; }
        .studioHeader, .studioFooter, .studioSaved > div { display: flex; align-items: center; gap: 8px; }
        .studioHeader { justify-content: space-between; margin-bottom: 14px; font-size: 1.2em; }
        .studioHeader button, .studioFooter button, .studioSaved button { border: 0; border-radius: 7px; padding: 8px 11px; background: #333; color: #fff; cursor: pointer; }
        .studioClose { font-size: 1.4em; }
        .studioControls { display: grid; gap: 8px; }
        .studioControls label { display: grid; grid-template-columns: 110px 1fr 42px; align-items: center; gap: 9px; }
        .studioControls output { text-align: right; color: #aaa; }
        .studioFooter { margin-top: 16px; }
        .studioName { flex: 1; min-width: 0; border: 1px solid #555; border-radius: 7px; padding: 9px; background: #111; color: #fff; }
        .studioSave { background: #00a4dc !important; color: #001018 !important; font-weight: 700; }
        .studioSaved { display: grid; gap: 5px; margin-top: 12px; }
        .studioSaved .studioUse { flex: 1; text-align: left; }
        .studioDelete { background: #612 !important; }
    `;
    document.head.appendChild(style);

    document.addEventListener('click', () => {
        if (panel) {
            panel.hidden = true;
        }
    });

    document.addEventListener('keydown', (event) => {
        if (!event.altKey || event.key.toLowerCase() !== 'f') {
            return;
        }

        event.preventDefault();
        const currentIndex = presets.findIndex((preset) => preset.id === selectedId);
        chooseFilter(presets[(currentIndex + 1) % presets.length].id);
    });

    new MutationObserver(scheduleScan).observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    scan();
})();

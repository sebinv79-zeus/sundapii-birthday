/* ==========================================
   SUNDAPII'S BIRTHDAY WEBSITE
   Complete interactive story
   Chapters 1–4 + photo gallery + Chapter 5
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    // --------------------------------------------------
    // Background birthday music — persistent across chapters
    // --------------------------------------------------
    const birthdayMusic = document.createElement("audio");
    birthdayMusic.id = "birthdayMusic";
    birthdayMusic.loop = true;
    birthdayMusic.preload = "none";
    birthdayMusic.src = "music.mp3";

    const musicControl = document.createElement("div");
    musicControl.className = "music-control";

    const musicButton = document.createElement("button");
    musicButton.id = "musicToggle";
    musicButton.type = "button";
    musicButton.textContent = "♫ Play music";
    musicButton.setAttribute("aria-pressed", "false");
    musicButton.setAttribute("aria-label", "Play birthday music");

    musicControl.appendChild(musicButton);
    document.body.appendChild(birthdayMusic);
    document.body.appendChild(musicControl);

    musicButton.addEventListener("click", async () => {
        if (birthdayMusic.paused) {
            try {
                await birthdayMusic.play();
                musicButton.textContent = "♫ Pause music";
                musicButton.setAttribute("aria-pressed", "true");
                musicButton.setAttribute("aria-label", "Pause birthday music");
            } catch (error) {
                musicButton.textContent = "Music unavailable — check file";
                console.error("Birthday music playback failed:", error);
            }
        } else {
            birthdayMusic.pause();
            musicButton.textContent = "♫ Play music";
            musicButton.setAttribute("aria-pressed", "false");
            musicButton.setAttribute("aria-label", "Play birthday music");
        }
    });

    const openButton = document.getElementById("openSurprise");
    const initialCard = document.querySelector(".welcome-card");
    const envelope = document.querySelector(".envelope");
    const floatingHearts = document.querySelector(".floating-hearts");

    if (!openButton || !initialCard || !envelope) {
        console.error(
            "Birthday elements not found. Check index.html."
        );
        return;
    }

    let surpriseOpened = false;
    let typingTimer = null;
    let activeViewer = null;
    let originalBodyOverflow = "";

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    // --------------------------------------------------
    // Shared helpers
    // --------------------------------------------------

    function createHeartBurst() {
        const symbols = ["♡", "♥", "💕", "✦"];

        for (let i = 0; i < 18; i++) {
            const heart = document.createElement("span");

            heart.className = "burst-heart";
            heart.textContent =
                symbols[Math.floor(Math.random() * symbols.length)];

            heart.style.left = `${window.innerWidth / 2}px`;
            heart.style.top = `${window.innerHeight / 2}px`;

            heart.style.setProperty(
                "--move-x",
                `${Math.random() * 300 - 150}px`
            );

            heart.style.setProperty(
                "--move-y",
                `${Math.random() * -260 - 30}px`
            );

            heart.style.setProperty(
                "--rotate",
                `${Math.random() * 90 - 45}deg`
            );

            heart.style.color = [
                "#e88db5",
                "#c5a6f5",
                "#efaccb",
                "#d99ad8"
            ][Math.floor(Math.random() * 4)];

            document.body.appendChild(heart);

            heart.addEventListener("animationend", () => {
                heart.remove();
            }, { once: true });

            if (reduceMotion.matches) {
                window.setTimeout(() => heart.remove(), 100);
            }
        }
    }

    function transitionTo(currentScreen, newScreen) {
        currentScreen.classList.add("screen-exit");

        const delay = reduceMotion.matches ? 0 : 500;

        window.setTimeout(() => {
            if (currentScreen.isConnected) {
                currentScreen.replaceWith(newScreen);
            }
        }, delay);
    }

    function createScreen(chapterLabel, titleHTML, contentHTML) {
        const screen = document.createElement("section");

        screen.className = "welcome-card story-screen";
        screen.innerHTML = `
            <p class="top-label">${chapterLabel}</p>
            ${titleHTML}
            ${contentHTML}
        `;

        return screen;
    }

    function stopTyping() {
        if (typingTimer !== null) {
            window.clearInterval(typingTimer);
            typingTimer = null;
        }
    }

    function closeActiveViewer() {
        if (activeViewer && activeViewer.isConnected) {
            activeViewer.remove();
        }

        activeViewer = null;
        document.body.style.overflow = originalBodyOverflow;
    }

    // --------------------------------------------------
    // Chapter 1: Photo and secret memory
    // --------------------------------------------------

    function showFirstStory() {
        const screen = createScreen(
            "CHAPTER ONE · A LITTLE STORY",
            `
                <div class="story-emoji" aria-hidden="true">💌</div>

                <h1>
                    Hey, Sundapii!<br>
                    <span class="name">This is for you ♡</span>
                </h1>
            `,
            `
                <p class="description">
                    Some people make ordinary days feel special.
                    You are one of those people, and today
                    is all about celebrating you.
                </p>

                <div class="story-photo-frame">
                    <img
                        class="story-photo"
                        src="images/sundapii.jpg"
                        alt="A special photo of Sundapii"
                    >

                    <p class="photo-caption">
                        A little moment to remember ♡
                    </p>
                </div>

                <button
                    class="memory-reveal"
                    id="revealMemory"
                    type="button"
                    aria-expanded="false"
                >
                    <span class="memory-prompt">
                        ♡ Tap here to reveal a little secret ♡
                    </span>

                    <span class="memory-hidden">
                        If I could give you one thing in life,
                        I'd give you the ability to see yourself
                        through my eyes. Then you'd know just how
                        wonderfully special you are. 💗
                    </span>
                </button>

                <p class="bottom-note">
                    A little memory, made with love ✿
                </p>

                <button
                    class="surprise-button"
                    id="continueStory"
                    type="button"
                >
                    Continue to my wishes ♡
                </button>
            `
        );

        const photo = screen.querySelector(".story-photo");

        photo.addEventListener("error", () => {
            photo.style.display = "none";

            screen.querySelector(".photo-caption").textContent =
                "Add images/sundapii.jpg to your images folder ♡";
        }, { once: true });

        const reveal = screen.querySelector("#revealMemory");

        reveal.addEventListener("click", () => {
            const opened = reveal.classList.toggle("is-revealed");

            reveal.setAttribute("aria-expanded", String(opened));

            reveal.querySelector(".memory-prompt").textContent =
                opened
                    ? "♡ A little message just for you ♡"
                    : "♡ Tap here to reveal a little secret ♡";

            if (opened) createHeartBurst();
        });

        screen.querySelector("#continueStory")
            .addEventListener("click", () => {
                showWishesPage(screen);
            });

        initialCard.replaceWith(screen);
    }

    // --------------------------------------------------
    // Chapter 2: Three wishes and typing animation
    // --------------------------------------------------

    function showWishesPage(previousScreen) {
        const screen = createScreen(
            "CHAPTER TWO · LITTLE WISHES",
            `
                <div class="story-emoji" aria-hidden="true">🎂</div>

                <h1>
                    Wishes for<br>
                    <span class="name">Sundapii ♡</span>
                </h1>
            `,
            `
                <p class="wish-intro">
                    I've hidden three little wishes for you.
                    Tap each card to discover what I wish
                    for your beautiful year ahead.
                </p>

                <div class="wish-list">

                    <button class="wish-card" type="button"
                            aria-expanded="false">
                        <span class="wish-icon">🌷</span>

                        <span class="wish-content">
                            <span class="wish-title">
                                A wish for happiness
                            </span>

                            <span class="wish-hint">
                                Tap to unwrap ♡
                            </span>

                            <span class="wish-message">
                                May your days be filled with laughter,
                                little joys, and reasons to smile
                                even when life gets busy.
                            </span>
                        </span>
                    </button>

                    <button class="wish-card" type="button"
                            aria-expanded="false">
                        <span class="wish-icon">✨</span>

                        <span class="wish-content">
                            <span class="wish-title">
                                A wish for your dreams
                            </span>

                            <span class="wish-hint">
                                A little surprise inside ♡
                            </span>

                            <span class="wish-message">
                                May you find the courage to chase
                                your dreams, the strength to keep
                                going, and beautiful surprises
                                along the way.
                            </span>
                        </span>
                    </button>

                    <button class="wish-card" type="button"
                            aria-expanded="false">
                        <span class="wish-icon">💗</span>

                        <span class="wish-content">
                            <span class="wish-title">
                                A wish just for you
                            </span>

                            <span class="wish-hint">
                                This one is special ♡
                            </span>

                            <span class="wish-message">
                                I hope you always feel appreciated,
                                loved, and reminded of how much
                                light you bring into the world.
                                Never forget how special you are.
                            </span>
                        </span>
                    </button>

                </div>

                <button class="surprise-button"
                        id="typeWishButton" type="button">
                    Read my birthday message ♡
                </button>

                <div class="typing-box"
                     id="typedBirthdayMessage"
                     aria-live="polite"></div>

                <button class="surprise-button"
                        id="nextChapterButton"
                        type="button" hidden>
                    Make a wish with me ✨
                </button>

                <p class="bottom-note">
                    Every wish comes with a little love ✿
                </p>
            `
        );

        screen.querySelectorAll(".wish-card").forEach(card => {
            card.addEventListener("click", () => {
                const opened = card.classList.toggle("is-open");

                card.setAttribute(
                    "aria-expanded",
                    String(opened)
                );

                if (opened) createHeartBurst();
            });
        });

        const typeButton =
            screen.querySelector("#typeWishButton");

        const typedMessage =
            screen.querySelector("#typedBirthdayMessage");

        const nextButton =
            screen.querySelector("#nextChapterButton");

        const message =
            "Happy Birthday, Sundapii! ♡ " +
            "I hope this new chapter of your life brings you " +
            "endless smiles, peaceful moments, beautiful memories, " +
            "and dreams that come true. Keep being your lovely self. " +
            "You deserve so much happiness. 💗";

        typeButton.addEventListener("click", () => {
            stopTyping();

            typedMessage.textContent = "";
            typedMessage.classList.add("typing-cursor");
            typeButton.disabled = true;
            nextButton.hidden = true;

            if (reduceMotion.matches) {
                typedMessage.textContent = message;
                typedMessage.classList.remove("typing-cursor");
                typeButton.disabled = false;
                typeButton.textContent = "Read my message again ♡";
                nextButton.hidden = false;
                return;
            }

            let index = 0;

            typingTimer = window.setInterval(() => {
                typedMessage.textContent += message[index];
                index++;

                if (index >= message.length) {
                    stopTyping();

                    typedMessage.classList.remove("typing-cursor");
                    typeButton.disabled = false;
                    typeButton.textContent = "Read my message again ♡";
                    nextButton.hidden = false;

                    createHeartBurst();
                }
            }, 38);
        });

        nextButton.addEventListener("click", () => {
            stopTyping();
            showCakePage(screen);
        });

        transitionTo(previousScreen, screen);
    }

    // --------------------------------------------------
    // Chapter 3: Birthday cake and candles
    // --------------------------------------------------

    function showCakePage(previousScreen) {
        const screen = createScreen(
            "CHAPTER THREE · MAKE A WISH",
            `
                <div class="story-emoji" aria-hidden="true">🎂</div>

                <h1>
                    Make a wish,<br>
                    <span class="name">Sundapii! ♡</span>
                </h1>
            `,
            `
                <p class="cake-instruction">
                    Three little candles, three little wishes.
                    Tap each flame to blow it out. ✨
                </p>

                <div class="cake-scene">
                    <div class="cake"
                         aria-label="Birthday cake with three candles">

                        <div class="candles">

                            <button class="candle" type="button"
                                    aria-label="Blow out candle one"
                                    aria-pressed="false">
                                <span class="flame"></span>
                                <span class="candle-wax"></span>
                            </button>

                            <button class="candle" type="button"
                                    aria-label="Blow out candle two"
                                    aria-pressed="false">
                                <span class="flame"></span>
                                <span class="candle-wax"></span>
                            </button>

                            <button class="candle" type="button"
                                    aria-label="Blow out candle three"
                                    aria-pressed="false">
                                <span class="flame"></span>
                                <span class="candle-wax"></span>
                            </button>

                        </div>

                        <div class="cake-top"></div>
                        <div class="cake-icing"></div>
                        <div class="cake-bottom"></div>
                        <div class="cake-plate"></div>
                    </div>
                </div>

                <p class="cake-instruction"
                   id="candleProgress" aria-live="polite">
                    3 candles are still glowing. Tap a flame!
                </p>

                <div class="cake-result"
                     id="cakeResult" aria-live="polite">
                    ✨ Every candle is out! ✨<br><br>
                    May this new year of your life bring you
                    unexpected happiness, peaceful days,
                    unforgettable memories, and all the love
                    your heart can hold. Happy Birthday, Sundapii! 💗
                </div>

                <button class="surprise-button"
                        id="cakeContinue" type="button" hidden>
                    Explore our memories ♡
                </button>

                <p class="bottom-note">
                    Close your eyes and make a beautiful wish ✿
                </p>
            `
        );

        const candles = [...screen.querySelectorAll(".candle")];
        const progress = screen.querySelector("#candleProgress");
        const result = screen.querySelector("#cakeResult");
        const continueButton = screen.querySelector("#cakeContinue");

        candles.forEach((candle, index) => {
            candle.addEventListener("click", () => {
                if (candle.classList.contains("is-out")) return;

                candle.classList.add("is-out");
                candle.setAttribute("aria-pressed", "true");
                candle.setAttribute(
                    "aria-label",
                    `Candle ${index + 1} blown out`
                );

                createHeartBurst();

                const remaining = candles.filter(
                    item => !item.classList.contains("is-out")
                ).length;

                if (remaining > 0) {
                    progress.textContent =
                        `${remaining} candle${remaining === 1 ? "" : "s"} ` +
                        "still glowing. Keep going, Sundapii! ♡";
                } else {
                    progress.textContent =
                        "You did it! Your birthday wish is ready. 💗";

                    result.classList.add("is-visible");
                    continueButton.hidden = false;

                    createHeartBurst();
                }
            });
        });

        continueButton.addEventListener("click", () => {
            showGalleryPage(screen);
        });

        transitionTo(previousScreen, screen);
    }

    // --------------------------------------------------
    // Chapter 4: Photo gallery and full-screen viewer
    // --------------------------------------------------

    function showGalleryPage(previousScreen) {
        const screen = createScreen(
            "CHAPTER FOUR · LITTLE MEMORIES",
            `
                <div class="story-emoji" aria-hidden="true">📸</div>

                <h1>
                    Little moments,<br>
                    <span class="name">big memories ♡</span>
                </h1>
            `,
            `
                <p class="gallery-intro">
                    Every picture holds a little story.
                    Tap a photo to open it, read its message,
                    and swipe to explore the next memory.
                </p>

                <div class="memory-gallery" id="memoryGallery"></div>

                <p class="bottom-note">
                    Keep these little moments close ✿
                </p>

                <button class="surprise-button"
                        id="galleryContinue" type="button">
                    Continue to the next surprise ♡
                </button>
            `
        );

        const memories = [
            {
                src: "images/memory1.jpg",
                title: "A favourite little moment ♡",
                caption:
                    "Some moments become special simply because " +
                    "they make us smile whenever we remember them."
            },
            {
                src: "images/memory2.jpg",
                title: "A memory to keep ✨",
                caption:
                    "Life feels brighter when we have beautiful " +
                    "memories to look back on."
            },
            {
                src: "images/memory3.jpg",
                title: "Just for you, Sundapii 💗",
                caption:
                    "No matter how ordinary a day may seem, " +
                    "there is always something worth remembering."
            }
        ];

        const gallery = screen.querySelector("#memoryGallery");

        memories.forEach((memory, index) => {
            const card = document.createElement("button");

            card.type = "button";
            card.className = "gallery-card";
            card.setAttribute(
                "aria-label",
                `Open memory ${index + 1}: ${memory.title}`
            );

            const image = document.createElement("img");
            image.className = "gallery-thumb";
            image.src = memory.src;
            image.alt = memory.title;
            image.loading = "lazy";

            const caption = document.createElement("span");
            caption.className = "gallery-caption";
            caption.textContent = memory.title;

            const hint = document.createElement("span");
            hint.className = "gallery-hint";
            hint.textContent = "Tap to open ♡";

            image.addEventListener("error", () => {
                image.style.display = "none";
                hint.textContent = `Photo missing: ${memory.src}`;
            }, { once: true });

            card.append(image, caption, hint);

            card.addEventListener("click", () => {
                openViewer(index);
            });

            gallery.appendChild(card);
        });

        function openViewer(startIndex) {
            closeActiveViewer();

            let currentIndex = startIndex;
            let touchStartX = null;
            let previousFocus = document.activeElement;

            originalBodyOverflow = document.body.style.overflow;

            const viewer = document.createElement("div");
            viewer.className = "photo-viewer";
            viewer.setAttribute("role", "dialog");
            viewer.setAttribute("aria-modal", "true");
            viewer.setAttribute("aria-label", "Photo memory viewer");

            viewer.innerHTML = `
                <div class="viewer-panel">
                    <button class="viewer-button"
                            id="closeViewer" type="button">
                        Close ✕
                    </button>

                    <p class="gallery-count" id="viewerCount"></p>

                    <img class="viewer-photo"
                         id="viewerPhoto" alt="">

                    <p class="viewer-caption"
                       id="viewerCaption"></p>

                    <div class="viewer-controls">
                        <button class="viewer-button"
                                id="previousMemory" type="button">
                            ← Previous
                        </button>

                        <button class="viewer-button"
                                id="nextMemory" type="button">
                            Next →
                        </button>
                    </div>

                    <button class="viewer-button"
                            id="revealCaption" type="button"
                            style="margin-top:12px">
                        Reveal a little message ♡
                    </button>

                    <p id="extraCaption"
                       class="viewer-caption" hidden></p>
                </div>
            `;

            document.body.appendChild(viewer);
            activeViewer = viewer;
            document.body.style.overflow = "hidden";

            const viewerPhoto = viewer.querySelector("#viewerPhoto");
            const viewerCaption = viewer.querySelector("#viewerCaption");
            const viewerCount = viewer.querySelector("#viewerCount");
            const extraCaption = viewer.querySelector("#extraCaption");
            const revealButton = viewer.querySelector("#revealCaption");
            const closeButton = viewer.querySelector("#closeViewer");

            function updateViewer() {
                const memory = memories[currentIndex];

                viewerPhoto.style.display = "block";
                viewerPhoto.src = memory.src;
                viewerPhoto.alt = memory.title;
                viewerCaption.textContent = memory.title;

                viewerCount.textContent =
                    `Memory ${currentIndex + 1} of ${memories.length}`;

                extraCaption.hidden = true;
                extraCaption.textContent = memory.caption;
                revealButton.textContent = "Reveal a little message ♡";
            }

            function moveViewer(direction) {
                currentIndex =
                    (currentIndex + direction + memories.length) %
                    memories.length;

                updateViewer();
            }

            function closeViewer() {
                if (activeViewer !== viewer) return;

                viewer.remove();
                activeViewer = null;
                document.body.style.overflow = originalBodyOverflow;

                if (previousFocus && previousFocus.isConnected) {
                    previousFocus.focus();
                }
            }

            viewer.querySelector("#previousMemory")
                .addEventListener("click", () => moveViewer(-1));

            viewer.querySelector("#nextMemory")
                .addEventListener("click", () => moveViewer(1));

            closeButton.addEventListener("click", closeViewer);

            viewer.addEventListener("click", event => {
                if (event.target === viewer) {
                    closeViewer();
                }
            });

            revealButton.addEventListener("click", () => {
                extraCaption.hidden = !extraCaption.hidden;

                revealButton.textContent = extraCaption.hidden
                    ? "Reveal a little message ♡"
                    : "Hide the message ♡";
            });

            viewerPhoto.addEventListener("error", () => {
                viewerPhoto.style.display = "none";
                viewerCaption.textContent =
                    `Photo missing: ${memories[currentIndex].src}`;
            });

            viewer.addEventListener("touchstart", event => {
                if (event.changedTouches.length !== 1) return;

                touchStartX = event.changedTouches[0].clientX;
            }, { passive: true });

            viewer.addEventListener("touchend", event => {
                if (touchStartX === null) return;

                const endX = event.changedTouches[0].clientX;
                const distance = endX - touchStartX;

                if (Math.abs(distance) > 55) {
                    moveViewer(distance < 0 ? 1 : -1);
                }

                touchStartX = null;
            }, { passive: true });

            viewer.addEventListener("keydown", event => {
                if (event.key === "Escape") {
                    closeViewer();
                } else if (event.key === "ArrowRight") {
                    moveViewer(1);
                } else if (event.key === "ArrowLeft") {
                    moveViewer(-1);
                }
            });

            updateViewer();
            closeButton.focus();
        }

        // Chapter 4 continues to Chapter 5.
        screen.querySelector("#galleryContinue")
            .addEventListener("click", () => {
                closeActiveViewer();
                showLetterPage(screen);
            });

        transitionTo(previousScreen, screen);
    }

    // --------------------------------------------------
    // Chapter 5: A little birthday letter
    // --------------------------------------------------

    function showLetterPage(previousScreen) {
        const screen = createScreen(
            "CHAPTER FIVE · JUST FOR YOU",
            `
                <div class="story-emoji" aria-hidden="true">💌</div>

                <h1>
                    A Little Letter<br>
                    <span class="name">for Sundapii ♡</span>
                </h1>
            `,
            `
                <div class="chapter-five-wrap">
                    <p class="chapter-five-intro">
                        Some feelings deserve their own little letter.
                        Tap the envelope to open yours. 💗
                    </p>

                    <button
                        class="chapter-five-envelope"
                        id="openBirthdayLetter"
                        type="button"
                        aria-expanded="false"
                        aria-controls="birthdayLetterPaper"
                    >
                        <span
                            class="chapter-five-envelope-icon"
                            aria-hidden="true"
                        >💌</span>

                        <span>
                            <strong>A letter just for you</strong>
                        </span>

                        <span class="chapter-five-envelope-hint">
                            Tap to open ♡
                        </span>
                    </button>

                    <article
                        class="chapter-five-paper"
                        id="birthdayLetterPaper"
                        hidden
                    >
                        <p class="chapter-five-greeting">
                            Dear Sundapii, 💕
                        </p>

                        <p>
                            Today is all about you — your smile, your happiness,
                            and all the little things that make you special.
                        </p>

                        <p>
                            I hope this new year of your life brings you beautiful
                            memories, peaceful days, exciting adventures, and
                            countless reasons to smile.
                        </p>

                        <p>
                            No matter how ordinary a day may seem, I hope you
                            always remember that you deserve kindness, happiness,
                            and all the lovely things life has to offer.
                        </p>

                        <p class="chapter-five-ending">
                            Happy Birthday, Sundapii! 🎂💖
                        </p>

                        <p class="chapter-five-signature">
                            Made with love ♡
                        </p>
                    </article>

                    <button
                        class="surprise-button"
                        id="letterContinue"
                        type="button"
                        hidden
                    >
                        One more surprise ✨
                    </button>

                    <p class="bottom-note">
                        A little letter, written with love ✿
                    </p>
                </div>
            `
        );

        const openLetterButton =
            screen.querySelector("#openBirthdayLetter");

        const letterPaper =
            screen.querySelector("#birthdayLetterPaper");

        const continueButton =
            screen.querySelector("#letterContinue");

        openLetterButton.addEventListener("click", () => {
            if (!letterPaper.hidden) return;

            letterPaper.hidden = false;
            letterPaper.classList.add("is-revealing");

            openLetterButton.disabled = true;

            openLetterButton.setAttribute(
                "aria-expanded",
                "true"
            );

            openLetterButton.querySelector(
                ".chapter-five-envelope-hint"
            ).textContent = "Your letter is open ♡";

            continueButton.hidden = false;

            createHeartBurst();
        });

        continueButton.addEventListener("click", () => {
            const finalScreen = createScreen(
                "A LITTLE MORE MAGIC · JUST FOR YOU",
                `
                    <div class="story-emoji" aria-hidden="true">💗</div>

                    <h1>
                        The best is<br>
                        <span class="name">yet to come!</span>
                    </h1>
                `,
                `
                    <p class="description">
                        You've reached the end of this little birthday letter,
                        but the memories and lovely moments are only beginning.
                        Happy Birthday, Sundapii! ♡
                    </p>

                    <p class="bottom-note">
                        Keep smiling, always ✿
                    </p>
                `
            );

            transitionTo(screen, finalScreen);
        });

        transitionTo(previousScreen, screen);
    }

    // --------------------------------------------------
    // Opening page: envelope and heart celebration
    // Original opening animation retained
    // --------------------------------------------------

    openButton.addEventListener("click", () => {
        if (surpriseOpened) return;

        surpriseOpened = true;
        openButton.disabled = true;

        envelope.classList.add("is-opening");
        createHeartBurst();

        if (floatingHearts) {
            floatingHearts.setAttribute("aria-hidden", "true");
        }

        const exitDelay = reduceMotion.matches ? 0 : 650;
        const nextDelay = reduceMotion.matches ? 50 : 1250;

        window.setTimeout(() => {
            initialCard.classList.add("screen-exit");
        }, exitDelay);

        window.setTimeout(() => {
            showFirstStory();
        }, nextDelay);
    });
});
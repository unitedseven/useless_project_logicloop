(function () {

    /* =========================
       STAGE CONTROL
    ========================= */

    const heroSection =
        document.querySelector(".hero");

    const stages = [
        document.getElementById("stage1"),
        document.getElementById("stage2"),
        document.getElementById("stage3"),
        document.getElementById("stage4")
    ];

    const beginBtn =
        document.getElementById("beginBtn");


    function showStage(number) {

        stages.forEach((stage, index) => {

            stage.classList.toggle(
                "active",
                index === number - 1
            );

        });

        window.scrollTo({
            top: heroSection.offsetHeight - 40,
            behavior: "smooth"
        });

    }


    beginBtn.addEventListener(
        "click",
        function () {

            showStage(1);

        }
    );


    /* =========================
       STAGE 1 — QUIZ
    ========================= */

    let quizScore = 0;

    const quizNext =
        document.getElementById("quizNext");

    const questions =
        document.querySelectorAll(".question");


    document
        .querySelectorAll(".option")
        .forEach(option => {

            option.addEventListener(
                "click",
                function () {

                    const question =
                        option.closest(".question");

                    question
                        .querySelectorAll(".option")
                        .forEach(item => {

                            item.classList.remove(
                                "selected"
                            );

                        });

                    option.classList.add(
                        "selected"
                    );

                    option.querySelector(
                        "input"
                    ).checked = true;

                    checkQuizComplete();

                }
            );

        });


    function checkQuizComplete() {

        let answered = 0;
        let score = 0;

        questions.forEach(question => {

            const checked =
                question.querySelector(
                    "input:checked"
                );

            if (checked) {

                answered++;

                score += parseInt(
                    checked.value,
                    10
                );

            }

        });

        quizScore = score;

        quizNext.disabled =
            answered < questions.length;

    }


    quizNext.addEventListener(
        "click",
        function () {

            showStage(2);

        }
    );


    /* =========================
       CAMERA FUNCTION
    ========================= */

    function setupCamera(
        videoId,
        startId,
        captureId,
        retakeId,
        statusId,
        canvasId,
        onCaptured
    ) {

        const video =
            document.getElementById(videoId);

        const startBtn =
            document.getElementById(startId);

        const captureBtn =
            document.getElementById(captureId);

        const retakeBtn =
            document.getElementById(retakeId);

        const status =
            document.getElementById(statusId);

        const canvas =
            document.getElementById(canvasId);

        let stream = null;


        /* ENABLE CAMERA */

        startBtn.addEventListener(
            "click",
            async function () {

                status.textContent =
                    "Requesting camera access…";

                try {

                    stream =
                        await navigator
                            .mediaDevices
                            .getUserMedia({

                                video: {
                                    facingMode: "user"
                                },

                                audio: false

                            });


                    video.srcObject =
                        stream;

                    status.textContent =
                        "Camera live. Frame yourself and capture when ready.";

                    startBtn.disabled =
                        true;

                    captureBtn.disabled =
                        false;

                }

                catch (error) {

                    status.textContent =
                        "Camera access was denied or unavailable.";

                    console.error(error);

                }

            }
        );


        /* CAPTURE */

        captureBtn.addEventListener(
            "click",
            function () {

                const context =
                    canvas.getContext("2d");

                canvas.width =
                    video.videoWidth || 640;

                canvas.height =
                    video.videoHeight || 480;


                /* Mirror camera image */

                context.translate(
                    canvas.width,
                    0
                );

                context.scale(-1, 1);

                context.drawImage(
                    video,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );


                video.style.display =
                    "none";

                canvas.style.display =
                    "block";

                captureBtn.disabled =
                    true;

                retakeBtn.disabled =
                    false;


                if (stream) {

                    stream
                        .getTracks()
                        .forEach(track =>
                            track.stop()
                        );

                }


                onCaptured();

            }
        );


        /* RETAKE */

        retakeBtn.addEventListener(
            "click",
            function () {

                video.style.display =
                    "block";

                canvas.style.display =
                    "none";

                retakeBtn.disabled =
                    true;

                startBtn.disabled =
                    false;

                status.textContent =
                    "Camera is off. Enable it to try again.";

            }
        );

    }


    /* =========================
       STAGE 2 — CANINE
    ========================= */

    const canineNext =
        document.getElementById(
            "canineNext"
        );


    setupCamera(
        "video1",
        "startCam1",
        "capture1",
        "retake1",
        "status1",
        "canvas1",

        function () {

            const reticle =
                document.getElementById(
                    "reticle1"
                );

            const tag =
                document.getElementById(
                    "reticleTag1"
                );

            const status =
                document.getElementById(
                    "status1"
                );

            const reading =
                document.getElementById(
                    "reading1"
                );

            const readingValue =
                document.getElementById(
                    "readingValue1"
                );


            /* Fake scan box */

            reticle.style.left =
                (32 + Math.random() * 8) + "%";

            reticle.style.top =
                (55 + Math.random() * 8) + "%";

            reticle.style.width =
                "22%";

            reticle.style.height =
                "18%";

            reticle.style.display =
                "block";


            status.textContent =
                "Measuring canine length…";

            tag.textContent =
                "SCANNING…";


            setTimeout(
                function () {

                    const length =
                        (
                            6.5 +
                            Math.random() * 8
                        ).toFixed(1);

                    const isLong =
                        length > 11;


                    tag.textContent =
                        length + "mm";

                    status.textContent =
                        "Measurement complete.";


                    readingValue.textContent =
                        length +
                        "mm — " +
                        (
                            isLong
                                ? "well beyond the human average. Notable elongation."
                                : "within the ordinary human range."
                        );


                    reading.classList.add(
                        "show"
                    );


                    window.canineLong =
                        isLong;

                    window.canineMm =
                        length;


                    canineNext.disabled =
                        false;

                },
                1400
            );

        }
    );


    canineNext.addEventListener(
        "click",
        function () {

            showStage(3);

        }
    );


    /* =========================
       STAGE 3 — BREATH
    ========================= */

    const finalNext =
        document.getElementById(
            "finalNext"
        );


    setupCamera(
        "video2",
        "startCam2",
        "capture2",
        "retake2",
        "status2",
        "canvas2",

        function () {

            const cloud =
                document.getElementById(
                    "cloud2"
                );

            const status =
                document.getElementById(
                    "status2"
                );

            const reading =
                document.getElementById(
                    "reading2"
                );

            const readingValue =
                document.getElementById(
                    "readingValue2"
                );


            cloud.style.left =
                (36 + Math.random() * 10) + "%";

            cloud.style.top =
                (58 + Math.random() * 10) + "%";

            const size =
                90 + Math.random() * 50;

            cloud.style.width =
                size + "px";

            cloud.style.height =
                size + "px";

            cloud.style.display =
                "block";


            status.textContent =
                "Reading sulfur compounds…";


            setTimeout(
                function () {

                    const level =
                        Math.round(
                            Math.random() * 100
                        );

                    const suspicious =
                        level < 35;


                    status.textContent =
                        "Reading complete.";


                    readingValue.textContent =
                        "Allicin trace: " +
                        level +
                        "% of expected baseline — " +
                        (
                            suspicious
                                ? "far below normal. No recent garlic exposure detected."
                                : "consistent with a garlic-eating household."
                        );


                    reading.classList.add(
                        "show"
                    );


                    window.breathLow =
                        suspicious;


                    finalNext.disabled =
                        false;

                },
                1400
            );

        }
    );


    /* =========================
       FINAL VERDICT
    ========================= */

    finalNext.addEventListener(
        "click",
        function () {

            let total =
                quizScore;


            if (window.canineLong) {

                total += 3;

            }


            if (window.breathLow) {

                total += 3;

            }


            let title;
            let description;


            if (total <= 5) {

                title =
                    "CERTIFIED HUMAN";

                description =
                    "Ordinary dentition, ordinary breath, ordinary habits. The night has no claim on you.";

            }

            else if (total <= 10) {

                title =
                    "SUSPICIOUS CASE";

                description =
                    "Several readings sit outside the expected range. Not conclusive — but worth watching around dusk.";

            }

            else {

                title =
                    "CONFIRMED CREATURE OF THE NIGHT";

                description =
                    "Habit, dentition, and breath all point the same direction. The ledger considers this case closed.";

            }


            document.getElementById(
                "verdictTitle"
            ).textContent = title;


            document.getElementById(
                "verdictDesc"
            ).textContent = description;


            document.getElementById(
                "breakdown"
            ).innerHTML = `

                <div>
                    <span>Habit score</span>
                    <span>${quizScore} / 10</span>
                </div>

                <div>
                    <span>Canine reading</span>
                    <span>${window.canineMm || "—"}mm</span>
                </div>

                <div>
                    <span>Breath reading</span>
                    <span>
                        ${
                            window.breathLow
                                ? "Low sulfur"
                                : "Normal sulfur"
                        }
                    </span>
                </div>

                <div>
                    <span>Total</span>
                    <span>${total} / 16</span>
                </div>

            `;


            showStage(4);

        }
    );


    /* =========================
       RESTART
    ========================= */

    document
        .getElementById("restartBtn")
        .addEventListener(
            "click",
            function () {

                location.reload();

            }
        );


})();
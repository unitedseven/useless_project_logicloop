(function () {


    /* =========================================================
       VARIABLES
    ========================================================= */

    let quizScore = 0;

    window.canineLong = false;
    window.canineMm = 0;

    window.breathLow = false;


    /* =========================================================
       STAGES
    ========================================================= */

    const hero =
        document.querySelector('.hero');

    const stage1 =
        document.getElementById('stage1');

    const stage2 =
        document.getElementById('stage2');

    const stage3 =
        document.getElementById('stage3');

    const stage4 =
        document.getElementById('stage4');


    /* =========================================================
       BEGIN
    ========================================================= */

    const beginBtn =
        document.getElementById('beginBtn');


    beginBtn.addEventListener(
        'click',
        function () {

            hero.style.display = 'none';

            stage1.classList.add('active');

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        }
    );


    /* =========================================================
       QUESTIONNAIRE
    ========================================================= */

    const quizNext =
        document.getElementById('quizNext');


    const quizOptions =
        document.querySelectorAll(
            '#stage1 input[type="radio"]'
        );


    quizOptions.forEach(
        function (radio) {

            radio.addEventListener(
                'change',
                function () {

                    const question =
                        radio.closest('.question');


                    if (question) {

                        question
                            .querySelectorAll('.option')
                            .forEach(
                                function (option) {

                                    option.classList.remove(
                                        'selected'
                                    );

                                }
                            );


                        radio
                            .closest('.option')
                            .classList.add(
                                'selected'
                            );

                    }


                    const totalQuestions =
                        document.querySelectorAll(
                            '#stage1 .question'
                        ).length;


                    const answeredQuestions =
                        document.querySelectorAll(
                            '#stage1 input[type="radio"]:checked'
                        ).length;


                    quizNext.disabled =
                        answeredQuestions !==
                        totalQuestions;

                }
            );

        }
    );


    quizNext.addEventListener(
        'click',
        function () {

            quizScore = 0;


            document
                .querySelectorAll(
                    '#stage1 input[type="radio"]:checked'
                )
                .forEach(
                    function (radio) {

                        quizScore +=
                            Number(radio.value) || 0;

                    }
                );


            stage1.classList.remove('active');

            stage2.classList.add('active');


            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        }
    );


    /* =========================================================
       CAMERA SETUP
    ========================================================= */

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


        captureBtn.disabled = true;

        retakeBtn.disabled = true;


        /* =====================================================
           START CAMERA
        ====================================================== */

        async function startCamera() {

            status.textContent =
                "Requesting camera access...";


            try {

                if (
                    !navigator.mediaDevices ||
                    !navigator.mediaDevices.getUserMedia
                ) {

                    throw new Error(
                        "Camera API unavailable."
                    );

                }


                stream =
                    await navigator.mediaDevices.getUserMedia({

                        video: {
                            facingMode: "user"
                        },

                        audio: false

                    });


                video.srcObject =
                    stream;


                await video.play();


                startBtn.disabled =
                    true;

                captureBtn.disabled =
                    false;

                retakeBtn.disabled =
                    true;


                status.textContent =
                    "Camera live.";

            }


            catch (error) {

                console.error(
                    "Camera error:",
                    error
                );


                status.textContent =
                    "Camera access was denied or unavailable.";

            }

        }


        /* =====================================================
           CAPTURE
        ====================================================== */

        function capture() {

            if (!stream) {
                return;
            }


            const context =
                canvas.getContext('2d');


            canvas.width =
                video.videoWidth;

            canvas.height =
                video.videoHeight;


            context.save();


            context.translate(
                canvas.width,
                0
            );


            context.scale(
                -1,
                1
            );


            context.drawImage(
                video,
                0,
                0,
                canvas.width,
                canvas.height
            );


            context.restore();


            video.style.display =
                'none';

            canvas.style.display =
                'block';


            stopCamera();


            captureBtn.disabled =
                true;

            retakeBtn.disabled =
                false;


            status.textContent =
                "Image captured — analysing specimen...";


            if (
                typeof onCaptured ===
                'function'
            ) {

                onCaptured(
                    video,
                    canvas
                );

            }

        }


        /* =====================================================
           RETAKE
        ====================================================== */

        async function retake() {

            /*
             * IMPORTANT:
             * If this is the odour camera, completely
             * hide the previous green odour effect.
             */

            if (canvasId === 'canvas2') {

                const cloud =
                    document.getElementById('cloud2');


                if (cloud) {

                    cloud.style.display =
                        'none';

                    cloud.style.opacity =
                        '0';

                }


                const reading =
                    document.getElementById('reading2');


                if (reading) {

                    reading.classList.remove(
                        'show'
                    );

                }

            }


            canvas.style.display =
                'none';

            video.style.display =
                'block';


            retakeBtn.disabled =
                true;

            captureBtn.disabled =
                true;


            try {

                stream =
                    await navigator.mediaDevices.getUserMedia({

                        video: {
                            facingMode: "user"
                        },

                        audio: false

                    });


                video.srcObject =
                    stream;


                await video.play();


                captureBtn.disabled =
                    false;


                status.textContent =
                    "Camera live.";

            }


            catch (error) {

                console.error(
                    "Camera error:",
                    error
                );


                status.textContent =
                    "Camera access was denied or unavailable.";

            }

        }


        /* =====================================================
           STOP CAMERA
        ====================================================== */

        function stopCamera() {

            if (stream) {

                stream
                    .getTracks()
                    .forEach(
                        function (track) {

                            track.stop();

                        }
                    );

                stream = null;

            }

        }


        /* =====================================================
           BUTTONS
        ====================================================== */

        startBtn.addEventListener(
            'click',
            startCamera
        );


        captureBtn.addEventListener(
            'click',
            capture
        );


        retakeBtn.addEventListener(
            'click',
            retake
        );

    }


    /* =========================================================
       STAGE 2 — MOUTH / CANINE
    ========================================================= */

    const mouthGuide1 =
        document.getElementById(
            'mouthGuide1'
        );


    const faceStatus1 =
        document.getElementById(
            'faceStatus1'
        );


    const measurementInstructions =
        document.getElementById(
            'measurementInstructions'
        );


    const capture1 =
        document.getElementById(
            'capture1'
        );


    const startCam1 =
        document.getElementById(
            'startCam1'
        );


    startCam1.addEventListener(
        'click',
        function () {

            mouthGuide1.classList.remove(
                'warning'
            );

            mouthGuide1.classList.add(
                'accepted'
            );


            faceStatus1.textContent =
                "MOUTH POSITION ACCEPTED — keep your mouth inside the guide.";


            measurementInstructions.textContent =
                "Keep your mouth centred and clearly visible before capturing.";


            capture1.disabled =
                false;

        }
    );


    /* =========================================================
       CANINE CAPTURE
    ========================================================= */

    setupCamera(

        'video1',

        'startCam1',

        'capture1',

        'retake1',

        'status1',

        'canvas1',

        function () {

            const reading =
                document.getElementById(
                    'reading1'
                );


            const readingValue =
                document.getElementById(
                    'readingValue1'
                );


            const canineNext =
                document.getElementById(
                    'canineNext'
                );


            const canineMm =
                6.5 +
                Math.random() * 8;


            const roundedMm =
                canineMm.toFixed(1);


            const isLong =
                canineMm > 11;


            window.canineLong =
                isLong;


            window.canineMm =
                Number(roundedMm);


            if (isLong) {

                readingValue.textContent =
                    roundedMm +
                    " mm — elongated canine measurement detected.";

            }

            else {

                readingValue.textContent =
                    roundedMm +
                    " mm — canine measurement within normal range.";

            }


            reading.classList.add(
                'show'
            );


            canineNext.disabled =
                false;


            document.getElementById(
                'status1'
            ).textContent =
                "CANINE ANALYSIS COMPLETE.";

        }

    );


    /* =========================================================
       CANINE → ODOUR
    ========================================================= */

    const canineNext =
        document.getElementById(
            'canineNext'
        );


    canineNext.addEventListener(
        'click',
        function () {

            stage2.classList.remove(
                'active'
            );


            stage3.classList.add(
                'active'
            );


            /*
             * Make absolutely sure that an old
             * odour effect is not visible when
             * entering Stage 3.
             */

            const cloud =
                document.getElementById('cloud2');


            if (cloud) {

                cloud.style.display =
                    'none';

                cloud.style.opacity =
                    '0';

            }


            const reading =
                document.getElementById('reading2');


            if (reading) {

                reading.classList.remove(
                    'show'
                );

            }


            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        }
    );


    /* =========================================================
       STAGE 3 — ODOUR
    ========================================================= */

    setupCamera(

        'video2',

        'startCam2',

        'capture2',

        'retake2',

        'status2',

        'canvas2',

        function () {

            const cloud =
                document.getElementById(
                    'cloud2'
                );


            const reading =
                document.getElementById(
                    'reading2'
                );


            const readingValue =
                document.getElementById(
                    'readingValue2'
                );


            /*
             * IMPORTANT:
             *
             * The green effect is HIDDEN while
             * the camera is live.
             *
             * It can only appear here because
             * this function runs AFTER capture.
             */

            if (cloud) {

                cloud.style.display =
                    'block';

                cloud.style.opacity =
                    '0';

                cloud.style.width =
                    '120px';

                cloud.style.height =
                    '90px';

                cloud.style.left =
                    '45%';

                cloud.style.top =
                    '45%';


                /*
                 * Green pulse AFTER capture.
                 */

                setTimeout(
                    function () {

                        cloud.style.opacity =
                            '0.7';

                    },
                    100
                );


                setTimeout(
                    function () {

                        cloud.style.opacity =
                            '0';

                    },
                    800
                );


                setTimeout(
                    function () {

                        cloud.style.opacity =
                            '0.55';

                    },
                    1200
                );


                setTimeout(
                    function () {

                        cloud.style.opacity =
                            '0';

                    },
                    1900
                );


                /*
                 * Completely remove it after
                 * the analysis animation.
                 */

                setTimeout(
                    function () {

                        cloud.style.display =
                            'none';

                        cloud.style.opacity =
                            '0';

                    },
                    2400
                );

            }


            /*
             * TWO POSSIBLE RESULTS
             *
             * ODOUR DETECTED
             * NO ODOUR DETECTED
             *
             * A new random result is generated
             * EVERY TIME a new photograph is captured.
             */

            const odourDetected =
                Math.random() < 0.5;


            if (odourDetected) {

                window.breathLow =
                    true;


                readingValue.textContent =
                    "ODOUR DETECTED — suspicious odour signature identified.";


                reading.classList.add(
                    'show'
                );


                document.getElementById(
                    'status2'
                ).textContent =
                    "SCREENING RESULT: ODOUR DETECTED.";

            }


            else {

                window.breathLow =
                    false;


                readingValue.textContent =
                    "NO ODOUR DETECTED — no suspicious odour signature identified.";


                reading.classList.add(
                    'show'
                );


                document.getElementById(
                    'status2'
                ).textContent =
                    "SCREENING RESULT: NO ODOUR DETECTED.";

            }

        }

    );


    /* =========================================================
       FINAL VERDICT
    ========================================================= */

    const finalNext =
        document.getElementById(
            'finalNext'
        );


    finalNext.addEventListener(
        'click',
        function () {

            stage3.classList.remove(
                'active'
            );


            stage4.classList.add(
                'active'
            );


            const total =
                quizScore +

                (
                    window.canineLong
                        ? 3
                        : 0
                ) +

                (
                    window.breathLow
                        ? 3
                        : 0
                );


            const verdictTitle =
                document.querySelector(
                    '.verdict-title'
                );


            const verdictDesc =
                document.querySelector(
                    '.verdict-desc'
                );


            /* =================================================
               VERDICT
            ================================================= */

            if (total <= 5) {

                verdictTitle.textContent =
                    "CERTIFIED HUMAN";


                verdictDesc.textContent =
                    "The examination shows no significant signs of vampiric characteristics.";

            }


            else if (total <= 10) {

                verdictTitle.textContent =
                    "SUSPICIOUS CASE";


                verdictDesc.textContent =
                    "Several unusual characteristics were identified during the examination.";

            }


            else {

                verdictTitle.textContent =
                    "CONFIRMED CREATURE OF THE NIGHT";


                verdictDesc.textContent =
                    "The collected evidence strongly suggests an unusually nocturnal specimen.";

            }


            /* =================================================
               BREAKDOWN
            ================================================= */

            const breakdown =
                document.querySelector(
                    '.breakdown'
                );


            breakdown.innerHTML = `

                <div>

                    <span>
                        Questionnaire
                    </span>

                    <span>
                        ${quizScore}
                    </span>

                </div>


                <div>

                    <span>
                        Canine morphology
                    </span>

                    <span>
                        ${window.canineLong ? 3 : 0}
                    </span>

                </div>


                <div>

                    <span>
                        Odour analysis
                    </span>

                    <span>
                        ${window.breathLow ? 3 : 0}
                    </span>

                </div>


                <div>

                    <strong>
                        Total Suspicion
                    </strong>

                    <strong>
                        ${total}
                    </strong>

                </div>

            `;


            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        }
    );


    /* =========================================================
       RESTART
    ========================================================= */

    const restartBtn =
        document.getElementById(
            'restartBtn'
        );


    restartBtn.addEventListener(
        'click',
        function () {

            window.location.reload();

        }
    );


})();

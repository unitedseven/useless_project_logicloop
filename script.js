/* =========================================================
   NOCTURNE EXAMINATIONS
   VAMPIRISM ASSESSMENT
========================================================= */

let currentStage = 1;

window.questionnaireScore = 0;
window.canineLong = false;
window.canineMm = 0;
window.breathLow = false;

let cameraStreams = {};

let cameraAvailable1 = false;
let cameraAvailable2 = false;


/* =========================================================
   HELPER
========================================================= */

function $(id) {
    return document.getElementById(id);
}


/* =========================================================
   STAGE NAVIGATION
========================================================= */

function showStage(stageNumber) {

    document.querySelectorAll(".stage").forEach(stage => {
        stage.classList.remove("active");
    });

    const stage = $("stage" + stageNumber);

    if (stage) {
        stage.classList.add("active");
    }

    currentStage = stageNumber;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   BEGIN
========================================================= */

$("beginBtn").addEventListener("click", () => {

    showStage(1);

});


/* =========================================================
   QUESTIONNAIRE
========================================================= */

const quizNext = $("quizNext");

document
    .querySelectorAll('input[type="radio"]')
    .forEach(input => {

        input.addEventListener("change", () => {

            const question =
                input.closest(".question");

            if (question) {

                question
                    .querySelectorAll(".option")
                    .forEach(option => {
                        option.classList.remove("selected");
                    });

                const selectedOption =
                    input.closest(".option");

                if (selectedOption) {
                    selectedOption.classList.add("selected");
                }
            }


            const questions = [
                "q1",
                "q2",
                "q3",
                "q4",
                "q5"
            ];


            const allAnswered =
                questions.every(name => {

                    return document.querySelector(
                        `input[name="${name}"]:checked`
                    );

                });


            quizNext.disabled = !allAnswered;

        });

    });


quizNext.addEventListener("click", () => {

    let score = 0;


    for (let i = 1; i <= 5; i++) {

        const selected =
            document.querySelector(
                `input[name="q${i}"]:checked`
            );

        if (selected) {
            score += Number(selected.value);
        }

    }


    window.questionnaireScore = score;

    showStage(2);

});


/* =========================================================
   CAMERA
   IMPORTANT:
   CAMERA FAILURE DOES NOT STOP THE EXAMINATION.
========================================================= */

async function startCamera(
    videoId,
    startButtonId,
    captureButtonId,
    statusId,
    cameraNumber
) {

    const video = $(videoId);
    const startButton = $(startButtonId);
    const captureButton = $(captureButtonId);
    const status = $(statusId);


    if (!video || !startButton || !captureButton) {
        return;
    }


    /*
     * Prevent multiple camera streams.
     */
    stopCamera(videoId);


    status.textContent =
        "Requesting camera access...";


    /*
     * Check browser support.
     */
    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        enableSimulation(
            cameraNumber,
            startButton,
            captureButton,
            status
        );

        return;
    }


    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user"
                },
                audio: false
            });


        /*
         * Save stream.
         */
        cameraStreams[videoId] = stream;


        video.srcObject = stream;


        await video.play();


        /*
         * Camera successfully opened.
         */
        if (cameraNumber === 1) {
            cameraAvailable1 = true;
        } else {
            cameraAvailable2 = true;
        }


        startButton.disabled = true;

        captureButton.disabled = false;


        status.textContent =
            "Camera active. Position yourself and capture.";


    } catch (error) {

        console.warn(
            "Camera access unavailable:",
            error
        );


        /*
         * THIS IS THE IMPORTANT FIX.
         *
         * If permission is denied, the app does NOT stop.
         */
        enableSimulation(
            cameraNumber,
            startButton,
            captureButton,
            status
        );

    }

}


/* =========================================================
   ENABLE SIMULATED CAMERA MODE
========================================================= */

function enableSimulation(
    cameraNumber,
    startButton,
    captureButton,
    status
) {

    if (cameraNumber === 1) {
        cameraAvailable1 = false;
    } else {
        cameraAvailable2 = false;
    }


    startButton.disabled = true;

    captureButton.disabled = false;


    status.textContent =
        "Camera unavailable — simulated examination enabled.";

}


/* =========================================================
   STOP CAMERA
========================================================= */

function stopCamera(videoId) {

    const stream =
        cameraStreams[videoId];


    if (stream) {

        stream
            .getTracks()
            .forEach(track => {
                track.stop();
            });


        delete cameraStreams[videoId];

    }


    const video = $(videoId);


    if (video) {
        video.srcObject = null;
    }

}


/* =========================================================
   STAGE 2 CAMERA
========================================================= */

$("startCam1").addEventListener("click", () => {

    startCamera(
        "video1",
        "startCam1",
        "capture1",
        "status1",
        1
    );

});


/* =========================================================
   STAGE 2 — CAPTURE
========================================================= */

$("capture1").addEventListener("click", () => {

    const video = $("video1");
    const canvas = $("canvas1");

    const reading = $("reading1");
    const readingValue = $("readingValue1");

    const mouthGuide =
        $("mouthGuide1");

    const status = $("status1");


    /*
     * Capture actual camera image if camera works.
     */
    if (
        cameraAvailable1 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0
    ) {

        canvas.width =
            video.videoWidth;

        canvas.height =
            video.videoHeight;


        const ctx =
            canvas.getContext("2d");


        ctx.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );


        canvas.style.display = "block";

        video.style.display = "none";

    }


    /*
     * Simulated fang measurement.
     */
    const mm =
        Math.round(
            (6.5 + Math.random() * 8) * 10
        ) / 10;


    window.canineMm = mm;


    /*
     * Fang longer than 11 mm
     * = suspicious characteristic.
     */
    window.canineLong =
        mm > 11;


    if (window.canineLong) {

        readingValue.textContent =
            `${mm} mm — ELONGATED FANGS`;


        mouthGuide.classList.add(
            "warning"
        );


        status.textContent =
            "Unusual fang morphology detected.";

    } else {

        readingValue.textContent =
            `${mm} mm — NORMAL FANG LENGTH`;


        mouthGuide.classList.add(
            "accepted"
        );


        status.textContent =
            "Fang morphology appears ordinary.";

    }


    reading.classList.add("show");


    $("capture1").disabled = true;

    $("retake1").disabled = false;

    $("canineNext").disabled = false;

});


/* =========================================================
   STAGE 2 — RETAKE
========================================================= */

$("retake1").addEventListener("click", () => {

    const video = $("video1");
    const canvas = $("canvas1");

    const reading = $("reading1");

    const mouthGuide =
        $("mouthGuide1");

    const status = $("status1");


    canvas.style.display = "none";

    video.style.display = "block";


    reading.classList.remove("show");


    mouthGuide.classList.remove(
        "accepted",
        "warning"
    );


    status.textContent =
        "Ready for another examination.";


    $("capture1").disabled = false;

    $("retake1").disabled = true;

    $("canineNext").disabled = true;


    window.canineLong = false;

    window.canineMm = 0;

});


/* =========================================================
   GO TO STAGE 3
========================================================= */

$("canineNext").addEventListener("click", () => {

    stopCamera("video1");


    /*
     * Clear old odour data.
     */
    window.breathLow = false;


    const cloud = $("cloud2");

    const reading = $("reading2");


    if (cloud) {

        cloud.style.display = "none";

        cloud.style.opacity = "0";

    }


    if (reading) {
        reading.classList.remove("show");
    }


    /*
     * Reset Stage 3 camera.
     */
    $("startCam2").disabled = false;

    $("capture2").disabled = true;

    $("retake2").disabled = true;


    showStage(3);

});


/* =========================================================
   STAGE 3 CAMERA
========================================================= */

$("startCam2").addEventListener("click", () => {

    startCamera(
        "video2",
        "startCam2",
        "capture2",
        "status2",
        2
    );

});


/* =========================================================
   STAGE 3 — ODOUR CAPTURE
========================================================= */

$("capture2").addEventListener("click", () => {

    const video = $("video2");
    const canvas = $("canvas2");

    const cloud = $("cloud2");

    const reading = $("reading2");

    const readingValue =
        $("readingValue2");

    const status = $("status2");


    /*
     * VERY IMPORTANT:
     *
     * Remove the previous odour result
     * before every new capture.
     */
    if (cloud) {

        cloud.style.display = "none";

        cloud.style.opacity = "0";

    }


    reading.classList.remove("show");


    window.breathLow = false;


    /*
     * Capture actual camera image
     * if camera is available.
     */
    if (
        cameraAvailable2 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0
    ) {

        canvas.width =
            video.videoWidth;

        canvas.height =
            video.videoHeight;


        const ctx =
            canvas.getContext("2d");


        ctx.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );


        canvas.style.display = "block";

        video.style.display = "none";

    }


    /*
     * NEW RANDOM RESULT
     *
     * Every CAPTURE gets a fresh result.
     */
    const odourDetected =
        Math.random() < 0.5;


    window.breathLow =
        odourDetected;


    if (odourDetected) {

        readingValue.textContent =
            "ODOUR DETECTED";


        status.textContent =
            "Unusual odour signature detected.";


        /*
         * GREEN ODOUR EFFECT
         *
         * It appears ONLY after CAPTURE.
         */
        if (cloud) {

            cloud.style.display =
                "block";

            cloud.style.opacity =
                "0";


            /*
             * Size and position.
             */
            cloud.style.width =
                "75%";

            cloud.style.height =
                "75%";

            cloud.style.left =
                "12.5%";

            cloud.style.top =
                "12.5%";


            /*
             * Fade in.
             */
            setTimeout(() => {

                cloud.style.transition =
                    "opacity 0.5s ease";

                cloud.style.opacity =
                    "1";

            }, 50);


            /*
             * Fade out.
             */
            setTimeout(() => {

                cloud.style.opacity =
                    "0";

            }, 1500);


            /*
             * Completely hide it.
             */
            setTimeout(() => {

                cloud.style.display =
                    "none";

            }, 2100);

        }

    } else {

        readingValue.textContent =
            "NO ODOUR DETECTED";


        status.textContent =
            "No unusual odour signature detected.";


        /*
         * Make absolutely sure
         * there is NO green effect.
         */
        if (cloud) {

            cloud.style.display =
                "none";

            cloud.style.opacity =
                "0";

        }

    }


    reading.classList.add("show");


    $("capture2").disabled = true;

    $("retake2").disabled = false;

});


/* =========================================================
   STAGE 3 — RETAKE
========================================================= */

$("retake2").addEventListener("click", () => {

    const video = $("video2");

    const canvas = $("canvas2");

    const cloud = $("cloud2");

    const reading = $("reading2");

    const status = $("status2");


    /*
     * REMOVE OLD GREEN EFFECT.
     */
    if (cloud) {

        cloud.style.display =
            "none";

        cloud.style.opacity =
            "0";

    }


    /*
     * REMOVE OLD RESULT.
     */
    reading.classList.remove("show");


    canvas.style.display =
        "none";

    video.style.display =
        "block";


    status.textContent =
        "Ready for another odour examination.";


    /*
     * Reset odour state.
     */
    window.breathLow = false;


    $("capture2").disabled = false;

    $("retake2").disabled = true;

});


/* =========================================================
   FINAL VERDICT BUTTON
========================================================= */

$("finalNext").addEventListener("click", () => {

    stopCamera("video2");

    calculateVerdict();

    showStage(4);

});


/* =========================================================
   VERDICT
========================================================= */

function calculateVerdict() {

    const questionnaire =
        window.questionnaireScore || 0;


    const fangScore =
        window.canineLong
            ? 3
            : 0;


    const odourScore =
        window.breathLow
            ? 3
            : 0;


    const total =
        questionnaire +
        fangScore +
        odourScore;


    const title =
        document.querySelector(
            ".verdict-title"
        );


    const description =
        document.querySelector(
            ".verdict-desc"
        );


    const seal =
        document.querySelector(
            ".seal"
        );


    const breakdown =
        document.querySelectorAll(
            ".breakdown div span:last-child"
        );


    /*
     * HUMAN
     */
    if (total <= 5) {

        title.textContent =
            "CERTIFIED HUMAN";


        description.textContent =
            "The evidence suggests a remarkably ordinary human specimen.";


        seal.textContent =
            "N";

    }


    /*
     * SUSPICIOUS
     */
    else if (total <= 10) {

        title.textContent =
            "SUSPICIOUS SPECIMEN";


        description.textContent =
            "Several characteristics require further investigation.";


        seal.textContent =
            "?";

    }


    /*
     * VAMPIRE
     */
    else {

        title.textContent =
            "CREATURE OF THE NIGHT";


        description.textContent =
            "The examination strongly suggests vampiric characteristics.";


        seal.textContent =
            "V";

    }


    /*
     * Update score breakdown.
     */
    if (breakdown.length >= 4) {

        breakdown[0].textContent =
            questionnaire;


        breakdown[1].textContent =
            fangScore;


        breakdown[2].textContent =
            odourScore;


        breakdown[3].textContent =
            total;

    }

}


/* =========================================================
   RESTART
========================================================= */

$("restartBtn").addEventListener("click", () => {

    /*
     * Stop both cameras.
     */
    stopCamera("video1");

    stopCamera("video2");


    /*
     * Reset scores.
     */
    window.questionnaireScore = 0;

    window.canineLong = false;

    window.canineMm = 0;

    window.breathLow = false;


    /*
     * Reset questionnaire.
     */
    document
        .querySelectorAll(
            'input[type="radio"]'
        )
        .forEach(input => {

            input.checked = false;

        });


    document
        .querySelectorAll(".option")
        .forEach(option => {

            option.classList.remove(
                "selected"
            );

        });


    quizNext.disabled = true;


    /*
     * Reset Stage 2.
     */
    $("startCam1").disabled = false;

    $("capture1").disabled = true;

    $("retake1").disabled = true;

    $("canineNext").disabled = true;


    $("reading1")
        .classList
        .remove("show");


    $("canvas1").style.display =
        "none";


    $("video1").style.display =
        "block";


    $("mouthGuide1")
        .classList
        .remove(
            "accepted",
            "warning"
        );


    $("status1").textContent = "";


    /*
     * Reset Stage 3.
     */
    $("startCam2").disabled = false;

    $("capture2").disabled = true;

    $("retake2").disabled = true;


    $("reading2")
        .classList
        .remove("show");


    $("canvas2").style.display =
        "none";


    $("video2").style.display =
        "block";


    $("status2").textContent = "";


    /*
     * Remove green odour cloud.
     */
    $("cloud2").style.display =
        "none";

    $("cloud2").style.opacity =
        "0";


    /*
     * Reset camera states.
     */
    cameraAvailable1 = false;

    cameraAvailable2 = false;


    /*
     * Return to beginning.
     */
    showStage(1);

});


/* =========================================================
   INITIAL STATE
========================================================= */

showStage(1);


console.log(
    "Nocturne Examinations — Vampirism Assessment loaded successfully."
);

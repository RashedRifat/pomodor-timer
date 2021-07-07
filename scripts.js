document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.querySelector("#pomodoro-start");
    const stopButton = document.querySelector("#pomodoro-stop");

    let isClockRunning = false;
    let workSessionDuration = 1500;
    let currentTimeLeftInSession = 1500;
    let breakSessionDuration = 300;
    let timeSpentInCurrentSession = 0;

    let type = 'Work';
    let isClockStopped = true;
    let currrentTaskLabel = document.querySelector("#pomodoro-clock-task");

    let updatedWorkSessionDuration;
    let updatedBreakSessionDuration;
    let workDurationInput = document.querySelector('#input-work-duration');
    let breakDurationInput = document.querySelector('#input-break-duration');
    workDurationInput.value = '25';
    breakDurationInput.value = '5';


    // Create the progress bar
    const progressBar = new ProgressBar.Circle('#pomodoro-timer', {
        strokeWidth: 2,
        text: {
        value: '25:00',
        },
        trailColor: '#f4f4f4',
    });

    // Add event listners for the project
    startButton.addEventListener("click", () => {
        toggleClock();
    });

      stopButton.addEventListener("click", () => {
        toggleClock(true);
    });  

    workDurationInput.addEventListener("input", () => {
        updatedBreakSessionDuration = minuteToSeconds(workDurationInput.value)
    });

    breakDurationInput.addEventListener("input", () => {
        updatedBreakSessionDuration = minuteToSeconds(breakDurationInput.value)
    });


    // Convert minutes to seconds 
    const minuteToSeconds = mins => {
        return mins * 60
    };

    // Toggle the clock to either rest, start or stop 
    const toggleClock = reset => {
        togglePlayPauseIcon(reset);

        if (reset) {
            stopClock()

        } else {

            // Update the timers appropriately
            if (isClockStopped) {
                setUpdatedTimers();
                isClockStopped = false;
            }

            if (isClockRunning === true) {
                // pause the timer
                clearInterval(clockTimer);
                isClockRunning = false;
            } else {
                // start the timer
                clockTimer = setInterval(() => {
                    stepDown()
                    displayCurrentTimeLeftInSession()
                    progressBar.set(calculateSessionProgress())
                }, 1000)

                isClockRunning = true;
            }

            showStopIcon();
        }
    };

    // Create a Step Down function 
    const stepDown = () => {

        // If the current session still has time remaining
        if (currentTimeLeftInSession > 0) {
            currentTimeLeftInSession--
            timeSpentInCurrentSession++

        // If not, toggle the type of the timer
        } else if (currentTimeLeftInSession === 0) {
            timeSpentInCurrentSession = 0 

            if (type === 'Work') {
                currentTimeLeftInSession = breakSessionDuration;
                displaySessionLog('Work');
                type = 'Break'
                setUpdatedTimers();
        
                currentTaskLabel.value = 'Break';
                currentTaskLabel.disabled = true;

            } else {
                currentTimeLeftInSession = workSessionDuration;
                type = 'Work';
                setUpdatedTimers();

                if (currrentTaskLabel.value === "Break") {
                    currentTaskLabel.value = workSessionLabel;
                }
                currentTaskLabel.disabled = false;
                displaySessionLog('Break');
            }
        }
        displayCurrentTimeLeftInSession();
    };

    // Stop the clock 
    const stopClock = () => {
        setUpdatedTimers();
        displaySessionLog(type);
        clearInterval(clockTimer);
        isClockStopped = true;
        isClockRunning = false;
        currentTimeLeftInSession = workSessionDuration;
        displayCurrentTimeLeftInSession();
        type = 'Work';
        timeSpentInCurrentSession = 0;
    };


    // Display the current time left in the working session
    const displayCurrentTimeLeftInSession = () => {
        const secondsLeft = currentTimeLeftInSession;
        let result = "";
        const seconds = secondsLeft % 60;
        const minutes = parseInt(secondsLeft / 60) % 60;
        let hours = parseInt(secondsLeft / 3600);

        // Create a function to add leading zeroes if the parameter is less than 10
        function addLeadingZeroes(time) {
            return time < 10 ? `0${time}` : time;
        }

        // Parse out the correct format of the time left and change the Pomodoro Timer to be so 
        if (hours > 0) result += `${hours}:`
        result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`;
        progressBar.innerText = result.toString();
    };


    // Display the log
    const displaySessionLog = (type) => {
        const sessionsList = document.querySelector("#pomodoro-sessions")
        const li = document.createElement("li")
        
        if (type === 'Work') {
            sessionLabel = currentTaskLabel.value ? currentTaskLabel.value : 'Work';
            workSessionLabel = sessionLabel;
        } else {
            sessionLabel = 'Break';
        }

        let elapsedTime = parseInt(timeSpentInCurrentSession / 60);
        elapsedTime = elapsedTime > 0 ? elapsedTime : "< 1"

        const text = document.createTextNode(`${sessionLabel} : ${elapsedTime} min`);
        li.appendChild(text);
        sessionsList.appendChild(li);
    }

    // Update timers based on user input 
    const setUpdatedTimers = () => {
        if (type === 'Work') {
            currentTimeLeftInSession = updatedBreakSessionDuration ? updatedBreakSessionDuration : workSessionDuration;
            workSessionDuration = currentTimeLeftInSession
        } else {
            currentTimeLeftInSession = updatedBreakSessionDuration ? updatedBreakSessionDuration : breakSessionDuration;
            breakSessionDuration = currentTimeLeftInSession;
        }
    };

    // Hide the pause icon when playing
    const togglePlayPauseIcon = reset => {
        const playIcon = document.querySelector('#play-icon')
        const pauseIcon = document.querySelector('#pause-icon')
        if (reset) {
            if (playIcon.classList.contains('hidden')) {
                playIcon.classList.remove('hidden');
            }
            if (!pauseIcon.classList.contains('hidden')) {
                pauseIcon.classList.add('hidden');
            }
        } else {
        playIcon.classList.toggle('hidden');
        pauseIcon.classList.toggle('hidden');
        }
    };

    // Show the stop icon when necessary
    const showStopIcon = () => {
        const stopButton = document.querySelector('#pomodoro-stop')
        stopButton.classList.remove('hidden')
    }


    const calculateSessionProgress = () => {
        // calculate the completion rate of this session
        const sessionDuration = type === 'Work' ? workSessionDuration : breakSessionDuration;
        return (timeSpentInCurrentSession / sessionDuration) * 10;
    };
    
});
const pomodoroTimer = document.querySelector("#timer")
const startButton = document.querySelector("#start")
const pauseButton = document.querySelector("#pause")
const stopButton = document.querySelector("#stop")

let isClockRunning = false
let workSessionDuration = 1500
let currentTimeLeftInSession = 1500
let breakSessionDuration = 300


// Add event listners for the project
startButton.addEventListener("click", () => {
    toggleClock()
})

pauseButton.addEventListener("click", () => {
    toggleClock()
})

stopButton.addEventListener("click", () => {
    toggleClock(True)
})


// Toggle the clock to either rest, start or stop 
const toggleClock = (reset) => {
    if (reset) {
        stopClock()

    } else {
        if (isClockRunning === true) {
            // pause the timer
            clearInterval(clockTimer)
            isClockRunning = false
        } else {
            // start the timer
            isClockRunning = true
            clockTimer = setInterval(() => {
                currentTimeLeftInSession--
                displayCurrentTimeLeftInSession()
            }, 1000)
        }
    }
};

// Stop the clock 
const stopClock = () => {
    clearInterval(clockTimer)
    isClockRunning = false
    currentTimeLeftInSession = workSessionDuration
    displayCurrentTimeLeftInSession()
};


// Display the current time left in the working session
const displayCurrentTimeLeftInSession = () => {
    const secondsLeft = currentTimeLeftInSession
    let result = ""
    const secondss = secondsLeft % 60
    const minutes = parseInt(secondsLeft / 60) % 60
    let hours = parseInt(seconds / 3600)

    // Create a function to add leading zeroes if the parameter is less than 10
    function addLeadingZeroes(time) {
        return time < 10 ? `0${time}` : time
    }

    // Parse out the correct format of the time left and change the Pomodoro Timer to be so 
    if (hours > 0) result += `${hours}:`
    result += `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`
    pomodoroTimer.innerText = result.toString()
};

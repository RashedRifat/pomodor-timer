const pomodoroTimer = document.querySelector("#timer")
const startButton = document.querySelector("#start")
const pauseButton = document.querySelector("#pause")
const stopButton = document.querySelector("#stop")

let isClockRunning = false
let workSessionDuration = 1500
let currentTimeLeftInSession = 1500
let breakSessionDuration = 300
let timeSpentInCurrentSession = 0

let type = 'Work'
let isClockStopped = true
let currrentTaskLabel = document.querySelector("#clock-task")

let updatedWorkSessionDuration
let updatedBreakSessionDuration
let workDurationInput = document.querySelector('#input-work-duration')
let breakDurationInput = document.querySelector('#input-break-duration')
workDurationInput.value = '25'
breakDurationInput.value = '5'


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

workDurationInput.addEventListener("input", () => {
    updatedBreakSessionDuration = minuteToSeconds(workDurationInput.value)
})

breakDurationInput.addEventListener("input", () => {
    updatedBreakSessionDuration = minuteToSeconds(breakDurationInput.value)
})


// Convert minutes to seconds 
const minuteToSeconds = (mins) => {
    return mins * 60
}

// Toggle the clock to either rest, start or stop 
const toggleClock = (reset) => {
    if (reset) {
        stopClock()

    } else {

        // Update the timers appropriately
        if (isClockStopped) {
            setUpdatedTimers()
            isClockStopped = false
        }

        if (isClockRunning === true) {
            // pause the timer
            clearInterval(clockTimer)
            isClockRunning = false
        } else {
            // start the timer
            isClockRunning = true
            clockTimer = setInterval(() => {
                stepDown()
                displayCurrentTimeLeftInSession()
            }, 1000)

            isClockRunning = true
        }
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
            currentTimeLeftInSession = breakSessionDuration
            type = 'Break'
            setUpdatedTimers()
    
            currentTaskLabel.value = 'Break'
            currentTaskLabel.disabled = true
            displaySessionLog('Work')

        } else {
            currentTimeLeftInSession = workSessionDuration
            type = 'Work'
            setUpdatedTimers()

            if (currrentTaskLabel.value === "Break") {
                currentTaskLabel.value = workSessionLabel
            }
            currentTaskLabel.disabled = false
            displaySessionLog('Break')
        }
    }
    displayCurrentTimeLeftInSession()
}

// Stop the clock 
const stopClock = () => {
    setUpdatedTimers()
    displaySessionLog(type)
    clearInterval(clockTimer)
    isClockStopped = true
    isClockRunning = false
    currentTimeLeftInSession = workSessionDuration
    displayCurrentTimeLeftInSession()
    type = 'Work'
    timeSpentInCurrentSession = 0
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


// Display the log
const displaySessionLog = (type) => {
    const sessionsList = document.querySelector("#sessions")
    const li = document.createElement("li")
    
    if (type === 'Work') {
        sessionLabel = currentTaskLabel.value ? currentTaskLabel.value : 'Work'
        workSessionLabel = sessionLabel
      } else {
        sessionLabel = 'Break'
      }


    let elapsedTime = parseInt(timeSpentInCurrentSession / 60)
    elapsedTime = elapsedTime > 0 ? elapsedTime : "< 1"

    const text = document.createTextNode(`${sessionLabel} : ${elapsedTime} min`)
    li.appendChild(text)
    sessionsList.appendChild(li)
}

// Update timers based on user input 
const setUpdatedTimers = () => {
    if (type === 'Work') {
        currentTimeLeftInSession = updatedBreakSessionDuration ? updatedBreakSessionDuration : workSessionDuration
        workSessionDuration = currentTimeLeftInSession
    } else {
        currentTimeLeftInSession = updatedBreakSessionDuration ? updatedBreakSessionDuration : breakSessionDuration
        breakSessionDuration = currentTimeLeftInSession
    }
}
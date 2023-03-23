const inputs = document.querySelectorAll("input");
const warningMsg = document.querySelector("#warning-msg");

const hours = document.querySelector("#hours");
let startHours = hours.innerHTML;
const minutes = document.querySelector("#minutes");
let startMinutes = minutes.innerHTML;
const seconds = document.querySelector("#seconds");
let startSeconds = seconds.innerHTML;

const playBtn = document.querySelector("#play-btn");
const pauseBtn = document.querySelector("#pause-btn");
const resetBtn = document.querySelector("#reset-btn");

let intervalId;

let isTimerActive = false;

// Приводим к корректному отображению
const handleNumFormat = (num) => {
	return Number(num).toLocaleString(undefined, {
		minimumIntegerDigits: 2,
		useGrouping: false,
	});
};

// Убрать сообщение об ошибке
const removeError = () => {
	if (
		![...inputs].some((input) => !Number(input.value) && input.value !== "")
	) {
		warningMsg.classList.add("is--hidden");
	}
};

// Установка таймера
const handleInput = (e) => {
	const targetId = e.target.id.split("-")[0];
	let newValue = handleNumFormat(e.target.value);

	let isError = false;

	if (!Number(newValue) && Number(newValue) !== 0) {
		isError = true;
	} else {
		// Если значение инпута корректно, передаем его в таймер
		switch (targetId) {
			case "hours":
				newValue > 24 ? (isError = true) : (startHours = newValue);
				break;
			case "minutes":
				newValue > 59 ? (isError = true) : (startMinutes = newValue);
				break;
			case "seconds":
				newValue > 59 ? (isError = true) : (startSeconds = newValue);
				break;
		}
	}

	if (isError) {
		warningMsg.classList.remove("is--hidden");
	} else {
		removeError();
		document.querySelector(`#${targetId}`).innerHTML = newValue;
	}
};

inputs.forEach((input) => {
	input.addEventListener("change", (e) => {
		handleInput(e);
	});
	input.addEventListener("click", (e) => {
		e.target.value = "";
		removeError();
	});
});

// Play/pause
const handlePause = () => {
	playBtn.parentNode.classList.remove("is--hidden");
	pauseBtn.parentNode.classList.add("is--hidden");

	// Останавливаем интервал
	clearInterval(intervalId);
};

const handlePlay = () => {
	// Проверяем кол-во секунд
	if (Number(seconds.innerHTML) <= 0) {
		// Проверяем кол-во минут
		if (Number(minutes.innerHTML) <= 0) {
			// Проверяем кол-во часов
			if (Number(hours.innerHTML) <= 0) {
				clearInterval(intervalId);
			} else {
				hours.innerHTML = handleNumFormat(hours.innerHTML - 1);
				minutes.innerHTML = 59;
			}
		} else {
			minutes.innerHTML = handleNumFormat(minutes.innerHTML - 1);
		}
		seconds.innerHTML = 59;
	} else {
		seconds.innerHTML = handleNumFormat(seconds.innerHTML - 1);
	}
};

const playToggle = () => {
	isTimerActive = !isTimerActive;

	// Если отсчет идет
	if (isTimerActive) {
		playBtn.parentNode.classList.add("is--hidden");
		pauseBtn.parentNode.classList.remove("is--hidden");

		handlePlay();
		intervalId = setInterval(() => {
			handlePlay();
		}, 1000);
	} else {
		handlePause();
	}
};

[playBtn, pauseBtn].forEach((btn) => btn.addEventListener("click", playToggle));

// Reset
const handleReset = () => {
	handlePause();
	isTimerActive = false;

	hours.innerHTML = startHours;
	minutes.innerHTML = startMinutes;
	seconds.innerHTML = startSeconds;
};

resetBtn.addEventListener("click", handleReset);

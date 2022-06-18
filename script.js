class Player {
    constructor(selector) {
        /* Получаем весь плеер (div с классом .player) */
        this.player = document.querySelector(selector);
        /* Получаем видео внутри плеера */
        this.video = this.player.querySelector('.player__video');
        /* запускаем метод со всеми используемыми элементами HTML */
        this.elements();
        /* Запускаем метод со всеми используемыми событиями */
        this.listeners();
        /* Устанавливаем максимальное значение (value) инпута прокрутки видео по ширине полоски прогресс бара, setTimeout нужен, чтобы это выполнилось после полной отрисовки плеера на странице, если делать без таймера, ширина может вернуться неправильно */
        setTimeout(() => {
            this.player.querySelector('.player__line-range').max = this.player.querySelector('.player__line').clientWidth;
        }, 100);
        /* свойство (переменная) для таймера скрытия панели управления */
        this.timer;
        /* свойство (флаг) для таймера скрытия панели управления */
        this.hide = true;
    }
    /* все элементы плеера с которыми будем взаимодействовать */
    elements() {
        /* Кнопка play/pause */
        this.playBtn = this.player.querySelector('.player__play')
        /* Кнопка включить/отключить полноэкранный режим */
        this.fullscreenBtn = this.player.querySelector('.player__fullscreen')
        /* Кнопка отключить/включить звук */
        this.muteBtn = this.player.querySelector('.player__volume-mute')
        /* Инпут для управления уровнем звука */
        this.volumeToggler = this.player.querySelector('.player__volume-toggler')
        /* селект для выбора скорости воспроизведения видео */
        this.speedToggler = this.player.querySelector('.player__speed')
        /* инпут для прокрутки видео */
        this.videoToggler = this.player.querySelector('.player__line-range')
        /* основная полоса прогресс бара */
        this.timeLine = this.player.querySelector('.player__line')
        /* панель управления плеером (controls) */
        this.controlPanel = this.player.querySelector('.player__panel')
        /* иконка кнопки play/pause */
        this.playBtnIcon = this.player.querySelector('.player__play .fas')
        /* иконка кнопки  включения/отключения полноэкранного режима */
        this.fullscreenBtnIcon = this.player.querySelector('.player__fullscreen .fas')
        /* иконка кнопки отключения/включения звука */
        this.muteBtnIcon = this.player.querySelector('.player__volume-mute .fas')
        /* элемент для вывода общей продолжительности видео */
        this.timeDurationElement = this.player.querySelector('.player__time-duration')
        /* элемент для вывода текущего времени воспроизведения видео */
        this.timeCurrentElement = this.player.querySelector('.player__time-current')
        /* полоска текущего прогресса воспроизведения видео */
        this.timeLineCurrent = this.player.querySelector('.player__line-current')
        /* превью */
        this.playerPreview = this.player.querySelector('.player__preview')
        /* видео превью */
        this.playerPreviewVideo = this.player.querySelector('.player__preview-video')
        /* время превью */
        this.playerPreviewTime = this.player.querySelector('.player__preview-time')
    }


    listeners() {
        /* получаем нужные элементы при помощи деструктуризации */
        const {
            video,
            player,
            playBtn,
            fullscreenBtn,
            muteBtn,
            volumeToggler,
            speedToggler,
            videoToggler,
            timeLine
        } = this;
        /* play/pause при клике на видео */
        video.addEventListener('click', () => this.playPauseVideo());
        /* play/pause при клике на кнопку */
        playBtn.addEventListener('click', () => this.playPauseVideo());
        /* Открыть/закрыть полноэкранный режим при двойном клике на видео */
        video.addEventListener('dblclick', () => this.changeFullscreen());
        /* Открыть/закрыть полноэкранный режим при клике на кнопку */
        fullscreenBtn.addEventListener('click', () => this.changeFullscreen());
        /* отключить/включить звук при клике на кнопку */
        muteBtn.addEventListener('click', () => this.muteVolume());
        /* управление уровнем звука при передвижении инпута */
        volumeToggler.addEventListener('input', () => this.changeVolume());
        /* управление скоростью воспроизведения при выборе определенного значения в селекте */
        speedToggler.addEventListener('input', () => this.speed());
        /* вывод общей длительности видео при загрузке мета-данных видео*/
        video.addEventListener('loadedmetadata', () => this.setTime());
        /* вывод текущего времени воспроизведения видео каждый раз пока воспроизводится видео */
        video.addEventListener('timeupdate', () => this.timeUpdate());
        /* прокрутка видео при передвижении инпута в прогресс баре */
        videoToggler.addEventListener('input', () => this.setRange());
        /* показывать превью при движении курсора на прогресс баре */
        timeLine.addEventListener('mousemove', e => this.showPreview(e));
        /* скрывать превью когда курсор покинул прогресс бар */
        timeLine.addEventListener('mouseout', () => this.hidePreview());
        /* показывать панель управления при движении курсора на плеере */
        player.addEventListener('mousemove', () => this.showPanel())
    }
    /* метод для play/pause видео */
    playPauseVideo() {
        /* получаем нужные элементы при помощи деструктуризации */
        const {
            video,
            playBtnIcon
        } = this;
        /* создаём переключатель, при каждом запуске метода возвращает true/false. В первый раз true, во второй false, третий true и т.д */
        this.switch = !this.switch;
        /* если переключатель равен true - воспроизводить видео, иначе ставим на паузу */
        this.switch ? video.play() : video.pause();
        /* если переключатель равен true - устанавливаем иконку паузы, иначе иконку плей */
        playBtnIcon.className = this.switch ? 'fas fa-pause' : 'fas fa-play';
    }
    /* метод для переключения полноэкранного режима */
    changeFullscreen() {
        /* получаем нужные элементы при помощи деструктуризации */
        const {
            player,
            fullscreenBtnIcon
        } = this;
        /* 
        Создаём переключатель true/false
        document.fullscreenElement - возвращает элемент запущенный в полноэкранном режиме, если нет ни одного элемента в полноэкранном режиме возвращает null
        Так как изначально плеер не запущен в полноэкранном режиме, нам вернется null, выражение !document.fullscreenElement вернет нам противоположное булевое значение - true
        */
        this.isFull = !document.fullscreenElement;
        /* Если true - открыть плеер в полноэкранном режиме, иначе закрыть полноэкранный режим */
        this.isFull ? player.requestFullscreen() : document.exitFullscreen();
        /* Изменяем иконку открытия/закрытия полноэкранного режима */
        fullscreenBtnIcon.className = this.isFull ? 'fas fa-compress' : 'fas fa-expand';
        /* Так как в полноэкранном режиме полоса прогресс бара увеличивается, а при закрытии полноэкранного режима уменьшается, необходимо перезаписывать максимальное значение (value) инпута прокрутки видео по ширине полоски прогресс бара, setTimeout нужен, чтобы это выполнилось после полной отрисовки плеера на странице, если делать без таймера, ширина может вернуться неправильно */
        setTimeout(() => {
            player.querySelector('.player__line-range').max = player.querySelector('.player__line').clientWidth;
        }, 100);
    }
    /* метод для отключения/включения звука видео */
    muteVolume() {
        /* получаем нужные элементы при помощи деструктуризации */
        const {
            video,
            volumeToggler,
            muteBtnIcon
        } = this;
        /* создаём переключатель, при каждом запуске метода возвращает true/false. В первый раз true, во второй false, третий true и т.д */
        this.isMuted = !video.muted;
        /* если переключатель равен true - отключить звук, иначе включить */
        video.muted = this.isMuted;
        /* если переключатель равен true - устанавливаем иконку mute, иначе иконку volume */
        muteBtnIcon.className = this.isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        /* если переключатель равен true - устанавливаем в инпут управления звуком новый атрибут со значением взятым из value инпута, когда равен false возвращаем значение установленного атрибута в value инпута
        Делаем это для того, чтобы возвращать значение инпута (value) в положение, которое было установлено до отключения звука
        */
        this.isMuted ? (volumeToggler.setAttribute('volume', volumeToggler.value), volumeToggler.value = 0) : volumeToggler.value = volumeToggler.getAttribute('volume');
    }
    /* метод для изменения уровня звука (громкости) */
    changeVolume() {
        /* получаем нужные элементы при помощи деструктуризации */
        const {
            video,
            volumeToggler,
            muteBtnIcon
        } = this;
        /* устанавливаем уровень звука
            звук в видео принимает значение от 0 до 1, а значение инпута по умолчанию возращает от 0 до 100
            поделив на 100 (например 50 / 100) получаем 0.5
        */
        /* включаем звук */
        video.muted = false;
        video.volume = volumeToggler.value / 100;
        /* если значение инпута меньше или равно нулю, устанавливаем иконку отключенного звука, если больше 0 возвращаем иконку включенного звука */
        muteBtnIcon.className = volumeToggler.value <= 0 ? 'fas fa-volume-off' : 'fas fa-volume-up';
    }
    /* метод для управления скоростью воспроизведения звука */
    speed() {
        /* получаем нужные элементы при помощи деструктуризации */
        const {
            video,
            speedToggler
        } = this;
        /* устанавливаем скорость воспроизведения видео получив значение с селекта */
        video.playbackRate = speedToggler.value;
    }
    /* метод для вывода общей продолжительности видео */
    setTime() {
        /* получаем нужные элементы при помощи деструктуризации */
        const {
            video,
            timeDurationElement
        } = this;
        /* получаем общую продолжительность видео в секундах и сразу округляем */
        const duration = Math.floor(video.duration);
        /* получаем общую продолжительность видео в минутах, если получается меньше 10, добавляем спереди 0, чтобы получить красивое отображаение на странице. например: 05 вместо 5 */
        const minutes = Math.floor(duration / 60) < 10 ? `0${Math.floor(duration / 60)}` : Math.floor(duration / 60);
        /* получаем остаток секунд, если получается меньше 10, добавляем спереди 0, чтобы получить красивое отображаение на странице. например: 05 вместо 5 */
        const seconds = Math.floor(duration % 60) < 10 ? `0${Math.floor(duration % 60)}` : Math.floor(duration % 60);
        /* выводим минуты и секунды в плеере */
        timeDurationElement.innerHTML = `${minutes}:${seconds}`;
    }
    /* метод для вывода текущего времени воспроизведения видео */
    timeUpdate() {
        /* получаем нужные элементы при помощи деструктуризации */
        const {
            video,
            timeLine,
            timeCurrentElement,
            timeLineCurrent,
            videoToggler
        } = this;
        /* получаем текущее время воспроизведения видео в секундах и сразу округляем */
        const currentTime = Math.floor(video.currentTime);
        /* получаем общую продолжительность видео в секундах и сразу округляем */
        const duration = Math.floor(video.duration);
        /* получаем длинну полосы прогресс бара */
        const lineWidth = timeLine.offsetWidth;
        /* получаем общую продолжительность видео в минутах, если получается меньше 10, добавляем спереди 0, чтобы получить красивое отображаение на странице. например: 05 вместо 5 */
        const minutes = Math.floor(currentTime / 60) < 10 ? `0${Math.floor(currentTime / 60)}` : Math.floor(currentTime / 60);
        /* получаем остаток секунд, если получается меньше 10, добавляем спереди 0, чтобы получить красивое отображаение на странице. например: 05 вместо 5 */
        const seconds = Math.floor(currentTime % 60) < 10 ? `0${Math.floor(currentTime % 60)}` : Math.floor(currentTime % 60);
        /* выводим текущее время воспроизведения видео */
        timeCurrentElement.innerHTML = `${minutes}:${seconds}`;
        /* каждую секунду увеличиваем ширину полоски (красная полоска) текущего воспроизведения видео в прогресс баре */
        timeLineCurrent.style.width = `${(currentTime / duration) * 100}%`;
        /* каждую секунду увеличиваем значение инпута прокрутки видео в прогресс баре */
        videoToggler.value = (currentTime / duration * 100) * (lineWidth / 100);
        /* если переключатель (flag) равен true и если плеер запущен в полноэкранном режиме - скрыть панель при простое курсора на одном месте 3 секунды */
        if (this.hide && document.fullscreenElement) this.hidePanel();
    }
    /* метод для скрытия панели управления */
    hidePanel() {
        /* получаем нужные элементы при помощи деструктуризации */
        const {
            player,
            controlPanel
        } = this;
        /* присваиваем переключателю (flag) значение false, чтобы setTimeout не запускался многократно  */
        this.hide = false;
        /* прячем панель и курсор при простое курсора на одном месте неподвижно 3 секунды */
        this.timer = setTimeout(() => {
            controlPanel.classList.add('player__panel-hide');
            player.classList.add('nocursor')
        }, 3000)
    }
    /* метод для отображения панели управления */
    showPanel() {
        /* получаем нужные элементы при помощи деструктуризации */
        const {
            player,
            controlPanel
        } = this;
        /* при движении курсора запускается данный метод (showPanel()) 
        останавливаем таймер скрывающий панель */
        clearTimeout(this.timer);
        /* удаляем класс скрывающий панель */
        controlPanel.classList.remove('player__panel-hide');
        /* удаляем класс скрывающий курсор */
        player.classList.remove('nocursor')
        /* присваеваем true в переключатель (flag), чтобы при простое курсора 3 секунды таймер скрывающий панель смог заново запуститься */
        this.hide = true;
    }
    /* метод для прокрутки видео */
    setRange() {
        /* получаем нужные элементы при помощи деструктуризации */
        const {video, videoToggler, timeLine, timeLineCurrent} = this;
        /* получаем значение (value) с инпута прокручивания видео */
        const position = videoToggler.value
        /* получаем ширину полоски прогресс бара */
        const lineWidth = timeLine.clientWidth;
        /* устанавливаем ширину текущего времени воспроизведения видео (красная полоска) равной значению (value) инпута */
        timeLineCurrent.style.width = position + 'px';
        /* устанавливаем текущее время воспроизведения по значению (value) инпута */
        video.currentTime = (position / lineWidth * 100) * (video.duration / 100);
    }
    /* метод для отображения превью */
    showPreview(event) {
        /* получаем нужные элементы при помощи деструктуризации */
        const {timeLine, playerPreview, playerPreviewVideo, playerPreviewTime} = this;
        /* получаем позицию курсора на прогресс баре (количество пикселей от левой стороны прогресс бара до курсора) */
        let position = event.offsetX + 1;
        /* получаем ширину прогресс бара */
        const lineWidth = timeLine.offsetWidth;
        /* отображаем превью */
        playerPreview.style.display = 'block';
        /* если позиция курсора меньше 100px устанавливаем постоянно значение 100, чтобы превью не выходил за пределы плеера с левой стороны */
        if (position <= 100) {
            position = 100;
        }
        /* отнимаем от ширины прогресс бара позицию курсора, и если получается меньше 100px устанавливаем постоянно значение (ширина прогресс бара минус 100), чтобы превью не выходил за пределы плеера с правой стороны */
        if (lineWidth - position <= 100) {
            position = lineWidth - 100;
        }
        /* устанавливаем свойство left со значением взятым с позиции курсора у превью, чтобы оно двигалось за курсором */
        playerPreview.style.left = `${position}px`;
        /* изменяем текущее время воспроизведения видео, чтобы менялся кадр внутри превью */
        playerPreviewVideo.currentTime = event.offsetX / lineWidth * this.video.duration;
        /* получем текущее время воспроизведения видео в секундах */
        const currentTime = Math.floor(playerPreviewVideo.currentTime);
        /* получаем общую продолжительность видео в минутах, если получается меньше 10, добавляем спереди 0, чтобы получить красивое отображаение на странице. например: 05 вместо 5 */
        const minutes = Math.floor(currentTime / 60) < 10 ? `0${Math.floor(currentTime / 60)}` : Math.floor(currentTime / 60);
        /* получаем остаток секунд, если получается меньше 10, добавляем спереди 0, чтобы получить красивое отображаение на странице. например: 05 вместо 5 */
        const seconds = Math.floor(currentTime % 60) < 10 ? `0${Math.floor(currentTime % 60)}` : Math.floor(currentTime % 60);
        /* выводим текущее время воспроизведения видео в превью */
        playerPreviewTime.innerHTML = `${minutes}:${seconds}`;
    }
    /* метод для скрытия превью */
    hidePreview() {
        /* получаем нужные элементы при помощи деструктуризации */
        const {playerPreview} = this;
        /* скрываем превью, когда курсор покинул прогресс бар */
        playerPreview.style.display = 'none';
    }
}
const player = new Player('.player');

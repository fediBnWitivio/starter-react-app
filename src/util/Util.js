import moment from 'moment'

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function getDate(time) {
    return moment.utc(time).local().startOf('seconds').fromNow()
}

function getDateFormat(time) {
    return moment.utc(time).local().calendar();
}

function setBodyScroll() {
    document.body.style.overflowY = 'scroll';
}

function setWindowBaseUrl(url) {

    localStorage.setItem("BASE_URL", url)
}

function getWindowBaseUrl() {
    return localStorage.getItem("BASE_URL");
}

// from stackOverflow
function cloneObject(obj) {
    var clone = {};
    for (var i in obj) {
        if (obj[i] !== null && typeof (obj[i]) === "object")
            clone[i] = cloneObject(obj[i]);
        else
            clone[i] = obj[i];
    }
    return clone;
}

export {debounce, setBodyScroll, cloneObject, setWindowBaseUrl, getWindowBaseUrl, getDate,getDateFormat}

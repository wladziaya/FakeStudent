let valid  = function (elem) {
    elem.value = elem.value.replace(/[а-яА-ЯёЁ\~`!#$@%\^&*+=\-\[\]\\';,\/{}()|\\":<>\?_]/g, '');
};

let validname  = function (elem) {
    elem.value = elem.value.replace(/[\~`!#$@%\^&*+=\\[\]\\';,\/{}()|\\":<>\?]/g, '');
};
/**
 * Created by fred on 10.01.17.
 */

$(function () {

    // Вывод изображений
    function handleFileSelect(ev) {
        var files = ev.target.files;

        for (var i = 0, f; f = files[i]; i++) {

            if (!f.type.match('image.*')) {
                continue;
            }

            var rd = new FileReader();

            rd.onload = (function (file) {
                console.log(file);
                return function (e) {
                    var li = document.createElement('li');
                    li.innerHTML = ['<img class="thumb" src="', e.target.result,
                        '" title="', file.name, '"/>'].join('');
                    document.getElementById('jsImages').insertBefore(li, null);
                };
            })(f);

            rd.readAsDataURL(f);
        }
    }

    $.getJSON('/data/presentation.json', function (data) {
        console.log(data[0]);
    });

    // Отслеживаем изменение upImages
    document.getElementById('upImages').addEventListener('change', handleFileSelect, false);

});
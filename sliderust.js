window.addEventListener('load', function () {
    // Put each <h1> and subsequent content into its own <section>.
    function makeSections(node) {
        var nextSection = null;
        var sections = [];
        while (true) {
            sections.push(nextSection ? nextSection : document.createElement('section'));
            nextSection = null;
            var section = sections[sections.length - 1];
            var sib;
            while (true) {
                sib = node.nextSibling;
                if (sib === null) {
                    section.appendChild(node);
                    return sections;
                }
                if (sib.nodeName === 'H1') {
                    break;
                }
                if (sib.nodeName === 'HR' && sib.classList.contains('pause')) {
                    nextSection = section.cloneNode(true);
                    sib = sib.nextSibling;
                    break;
                }
                section.appendChild(node);
                node = sib;
            }
            node = sib;
        }
    }

    var title = document.getElementsByClassName('title')[0];
    [].forEach.call(makeSections(title), function (x) {
        document.body.appendChild(x);
    });

    // add a pair of arrows to the bottom right corner of the slides,
    // ensuring they're outside the slides.
    var nav = document.createElement('nav');
    nav.id = 'nav-symbols';
    var back = document.createElement('span');
    back.id = 'nav-back';
    back.classList.add('nav-symbol');
    back.textContent = '◀';
    var forward = document.createElement('span');
    forward.id = 'nav-forward';
    forward.classList.add('nav-symbol');
    forward.textContent = '▶';

    nav.appendChild(back);
    nav.appendChild(forward);
    // document.body.appendChild(nav);

    var sections = document.getElementsByTagName('section');

    var hash = window.location.hash;
    var current = /^#[0-9]+$/.test(hash) ? parseInt(hash.substr(1), 10) : 0;

    function adjustClass(elem, should_add, klass) {
        if (should_add)
            elem.classList.add(klass);
        else
            elem.classList.remove(klass);
    }
    function update() {
        [].forEach.call(sections, function (x, i) {
            x.className = (i === 0) ? 'title-slide' : '';
        });

        var can_go_forward = true, can_go_back = true;

        if (current <= 0) {
            current = 0;
            can_go_back = false;
        }
        else if (current >= sections.length - 1) {
            current = sections.length - 1;
            can_go_forward = false;
        }
        adjustClass(forward, !can_go_forward, 'disabled');
        adjustClass(back,    !can_go_back,    'disabled');
        sections[current].className += ' current';
        // servo doesn't support this
        if (window.location.replace) {
            window.location.replace('#' + current);
        }
    }

    update();

    document.body.addEventListener('keydown', function (ev) {
        switch (ev.keyCode) {
            case 39: current++; break;
            case 37: current--; break;
        }
        update();
    });
    forward.addEventListener('click', function(ev) {
        current++;
        update();
    });
    back.addEventListener('click', function(ev) {
        current--;
        update();
    });

    // Touch listeners, to change page if a user with a touch devices
    // swipes left or right.
    var start_x, start_y;
    document.body.addEventListener('touchstart', function(ev) {
        ev.preventDefault();
        if (ev.touches.length > 1) return;
        start_x = ev.touches[0].clientX;
        start_y = ev.touches[0].clientY;
    });
    document.body.addEventListener('touchmove', function(ev) { ev.preventDefault(); });
    document.body.addEventListener('touchend', function(ev) {
        if (ev.touches.length > 0) return;

        var dx = ev.changedTouches[0].clientX - start_x;
        var dy = ev.changedTouches[0].clientY - start_y;

        // if the touch is at least 40% of the page wide, and doesn't
        // move vertically too much, it counts as a swipe.
        if (Math.abs(dx) > 0.4 * window.innerWidth && Math.abs(dy) < 0.2 * window.innerHeight) {
            current += -Math.sign(dx);
            update();
        }
    });

    function height() {
        document.body.style.height = window.innerHeight + 'px';
    }
    //window.addEventListener('resize', function(ev) { height(); });
    //height();
});

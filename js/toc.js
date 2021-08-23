// https://github.com/ghiculescu/jekyll-table-of-contents
(function($){
  $.fn.toc = function(options) {
    var defaults = {
      noBackToTopLinks: false,
      title: '<i>Jump to...</i>',
      minimumHeaders: 3,
      headers: 'h1, h2, h3, h4, h5, h6',
      listType: 'ol', // values: [ol|ul]
      showEffect: 'show', // values: [show|slideDown|fadeIn|none]
      showSpeed: 'slow', // set to 0 to deactivate effect
      classes: { list: 'collapse',
                 item: ''
               }
    },
    settings = $.extend(defaults, options);

    function fixedEncodeURIComponent (str) {
      return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
      });
    }

    function createLink (header) {
      var innerText = (header.textContent === undefined) ? header.innerText : header.textContent;
      return "<a href='#" + fixedEncodeURIComponent(header.id) + "'>" + innerText + "</a>";
    }

    var headers = $(settings.headers).filter(function() {
      // get all headers with an ID
      var previousSiblingName = $(this).prev().attr( "name" );
      if (!this.id && previousSiblingName) {
        this.id = $(this).attr( "id", previousSiblingName.replace(/\./g, "-") );
      }
      return this.id;
    }), output = $(this);
    if (!headers.length || headers.length < settings.minimumHeaders || !output.length) {
      $(this).hide();
      return;
    }

    if (0 === settings.showSpeed) {
      settings.showEffect = 'none';
    }
    let target_id = 1;

    // 添加 css class 
    let style = `.rotate90 {
      display: inline-block;
      -webkit-transform: rotate(90deg);
      -moz-transform: rotate(90deg);
      -o-transform: rotate(90deg);
      -ms-transform: rotate(90deg);
      transform: rotate(90deg);
    }`
    var styleTag = $(`<style>${style}</style>`)
    $('html > head').append(styleTag);

    show_next_level = function show_next_level(that, target_id) {
      //console.log(target_id);
      let ul_tag = $('#li'+target_id);
      ul_tag.toggle();
      let btn_tag = $(that);
      //console.log(btn_tag.hasClass('rotate90'));
      if (btn_tag.hasClass('rotate90')) {
        //console.log("has class");
        btn_tag.removeClass('rotate90') 
      } else {
        btn_tag.addClass('rotate90') 
      }
    };

    var render = {
      show: function() { output.hide().html(html).show(settings.showSpeed); },
      slideDown: function() { output.hide().html(html).slideDown(settings.showSpeed); },
      fadeIn: function() { output.hide().html(html).fadeIn(settings.showSpeed); },
      none: function() { output.html(html); }
    };

    var get_level = function(ele) { return parseInt(ele.nodeName.replace("H", ""), 10); };
    var highest_level = headers.map(function(_, ele) { return get_level(ele); }).get().sort()[0];
    var return_to_top = '<i class="icon-arrow-up back-to-top"> </i>';

    var level = get_level(headers[0]),
      this_level,
      html = settings.title + " <" +settings.listType + " class=\"" + settings.classes.list +"\">";
    headers.on('click', function() {
      if (!settings.noBackToTopLinks) {
        window.location.hash = this.id;
      }
    })
    .addClass('clickable-header')
    .each(function(index, header) {
      
      this_level = get_level(header);
      let next = index + 1;
      let next_level = -1;          
      if ((next < headers.length)) {
        next_level = get_level(headers[next]);
      }
      //console.log(this_level);
      if (!settings.noBackToTopLinks && this_level === highest_level) {
        $(header).addClass('top-level-header').after(return_to_top);
      }
      btn_style = `style="font-size:small;"`;
      btn_class = `class="rotate90"`;
      btn = `<a onclick="show_next_level(this, ${target_id})" ${btn_class} >&#9658;</a>`
      if (this_level === level) { // same level as before; same indenting
        //console.log(index, header);
        if (next_level > this_level) {
          console.log(index, header, this_level, next_level, headers[next]);
          html += "<li class=\"" + settings.classes.item + "\""+ ">" + btn + createLink(header);
        } else {
          html += "<li class=\"" + settings.classes.item + "\">" + createLink(header);
        } 
        //
      }
      else if (this_level <= level){ // higher level than before; end parent ol
        for(var i = this_level; i < level; i++) {
          html += "</li></"+settings.listType + ">";
        }
        if (next_level > this_level) {
          console.log(index, header, this_level, next_level, headers[next]);
          html += "<li class=\"" + settings.classes.item + "\""+ ">" + btn + createLink(header);
        }else {
          html += "<li class=\"" + settings.classes.item + "\">"+ createLink(header);
        }
      }
      else if (this_level > level) { // lower level than before; expand the previous to contain a ol
        for(i = this_level; i > level; i--) {
          style = "style=\"height:0px\"";
          html += "<" + settings.listType + " class=\"" + settings.classes.list +"\"" + "id=\"li"+ target_id  + "\"" +  ">" +
                  "<li class=\"" + settings.classes.item + "\">"
        }
        html += createLink(header);
        target_id += 1;
      }
      level = this_level; // update for the next one
    });
    html += "</"+settings.listType+">";
    if (!settings.noBackToTopLinks) {
      $(document).on('click', '.back-to-top', function() {
        $(window).scrollTop(0);
        window.location.hash = '';
      });
    }

    render[settings.showEffect]();
  };
})(jQuery);

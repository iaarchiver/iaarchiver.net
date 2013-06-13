/* =============================================================
 * bootstrap-scrollspy.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */

!function ($) {

  "use strict"; // jshint ;_;


  /* SCROLLSPY CLASS DEFINITION
   * ========================== */

  function ScrollSpy( element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href

    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' ul li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])
        this.boundary = $('#foot').offset().top-$(window).height()
        this.trigger = false

        this.upAnchor = this.$body.find('#up')
        this.dwAnchor = this.$body.find('#down')


        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && href.length
              && [[ $href.offset().top, href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , trigger = this.trigger
          , boundary = this.boundary

        if (activeTarget != undefined){
          // deactive while scrolling before targets
          scrollTop < offsets[0]
          && this.setAnchors('#head',targets[0])
          && this.deactivate()

          // deactive while scrolling beyond targets
          scrollTop > boundary
          && this.setAnchors(activeTarget,'#foot')
          && this.deactivate()
        }

        for (var i = offsets.length; i--;) {

          (activeTarget != targets[i] || trigger)
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && scrollTop <= boundary
            && this.setAnchors(targets[i],targets[i+1])
            && this.activate(targets[i])

          scrollTop == (~~offsets[i]+this.options.offset)
            && this.setAnchors(targets[i-1],targets[i+1])
            && (trigger=true)
        }
    }
    , setAnchors: function(prev, next){
        this.upAnchor.attr('href',(prev==undefined)?'#head':prev);
        this.dwAnchor.attr('href',(next==undefined)?'#foot':next);
        return true;
    }
    , deactivate: function (){
        this.activeTarget = undefined
      
        this.$body
        .find(this.selector)
        .parent('.active')
        .removeClass('active')
    }
    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target
        this.trigger = false

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        active.trigger('activate')
      }
  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  $.fn.scrollspy = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY DATA-API
  * ================== */
  
  $(function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })
}( window.jQuery );


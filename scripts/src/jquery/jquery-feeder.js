
;(function($){
    $.Feeder = function( elem , option, callb){
        google.load("feeds", "1");
        google.setOnLoadCallback(callb);
    }
    $.extend( $.Feeder.prototype,{
        feeds: function(option, callb){
            var feedurl = option.url,
                max_num = option.num;

            var feed = new google.feeds.Feed(feedurl);
            feed.setNumEntries(max_num);
            feed.load(callb);
        },
        getfeeds: function(selector, option){
            var self = this,
                target = $(selector);

            this.feeds(option, function(result){
                if (result.error || result.feed.entries.length==0){
                    console.log('unavailable feed'); return false;}

                var feedUL = $('<ul class="menu generated_from_feeds">');       

                feedUL.append('<li><span>'+option.title+'</span></li>');
                for (var i=0; i<result.feed.entries.length; i++){
                    var entry = result.feed.entries[i];
                    feedUL.append('<li class="item"><a href="'+entry.link+'">'+ entry.title+'<span>'+ self.getDate(entry.publishedDate)+'</span>'+'</a><li>');
                }
                target.replaceWith(feedUL);
            });
        },
        findfeeds: function(option, callb){
            var feed = new feedsgoogle.feeds.findFeeds(option.query, callb);
        },
        get1feed: function(selector, option){
            var self = this;
            var target = $(selector),
                title = option.title,
                key = option.key,
                reg = new RegExp(key,'i');
                //href = 'http://iaarchiver.net/mylifelog?'+key;
            var dfd = $.Deferred();
                option.num = 100; // seach keyword in recent 100 feeds

            this.feeds(option, function(result){
                if (result.error || result.feed.entries.length==0){
                    console.log('unavailable feed'); return;}
                
                for (var i = 0; i < result.feed.entries.length; i++) {
                    if(!reg.test(result.feed.entries[i].content)) continue; // test msg has key

                    var entry = result.feed.entries[i],
                        date  = self.getDate(entry.publishedDate),
                        href = entry.link,
                        msg  = entry.content
                                .replace(/(<[^>]*>)|(<\/[^>]*>)/gm, '')         // delete <a>tag
                                .replace(/#\w*/g,'<span>$&</span>')             // warp hashtag with <span>
                                .replace(/posted at \d\d:\d\d:\d\d/g,'');       // delete date line

                    msg = msg.substring(0,140)+((msg.substring(140))?'...':'')  // excerpt with 100 letters
                    msg += '<span class="date">'+date+'</span>';                // and append date
                    msg  = '<a href="'+href+'">'+title+msg+'</a>';              // wrap with anchor

                    var msgContainer = $('<li>');

                    msgContainer
                        .append(msg)
                        .glurl2img(function(){dfd.resolve();}); // 
                    msgContainer.replaceAll(target);
                    break;
                }
            });
            return dfd.promise();
        },
        getRelatedPosts: function(selector, option){
            var target = $(selector),
                title = option.title,
                url = option.url,
                tags = option.tags,
                maxNum = 5; // display less than 5 items

            var query = 'site:'+url+' '+tags;

            google.feeds.findFeeds(query, function(result){
                if (result.error){
                    console.log('unavailable feed'); return;}

                for (var i = 0; i < result.entries.length; i++) {
                    var entry = result.entries[i],
                        isSamePost = entry.link.split('/').pop() == location.pathname.split('/').pop();

                    if (isSamePost) continue;
                    target.append(function(){
                        var item = $('<a>')
                            .attr('href',entry.link)
                            .append(entry.title)
                            .hide();
                        return $('<li>').append(item.fadeIn('slow'));
                    });
                    if (!--maxNum) break;
                }

                if ($('li',target).length)
                    target.prepend("<li><span>"+ title +"</span></li>"); // add title if not empty
            });
        },
        getLinkbackPosts: function(selector, option){
            var target = $(selector),
                url = option.url,
                num = option.num;

            option.url = "http://www.google.co.jp?q=link%3A"+encodeURIComponent(url)+"&output=rss&num="+num+"&ie=utf-8";
            this.getfeeds(selector, option);
        },
        getDate: function(publishedDate){
            var pdate = new Date(publishedDate),
                pday = pdate.getDate(),
                pmonth = pdate.getMonth() + 1,
                pyear = pdate.getFullYear(),
                strdate = pyear + "-" + pmonth + "-" + pday;
            return strdate;
        }
    });

    $.fn.glurl2img = function(callb){
        var target= $(this), 
            glurl = $(this).html().match(/goo.gl\/\w*/);
        if (glurl){
             expandGoogleUrl('http://'+glurl.toString(),
                             function(url){
                                var ctitle = target.find('a .column-title'),
                                    asin = url.match(/ASIN=\S*/).toString().replace(/ASIN=/,''),
                                    imgObj = $('<img>').attr({
                                                            'class': 'byAmazon',
                                                            'src': asin2imgsrc(asin,'large'),
                                                            'style': 'display:none'
                                                            }).fadeIn('slow',function(){callb();});

                                  if (ctitle){
                                    ctitle.after(imgObj);
                                  } else{
                                    target.prepend(imgObj);
                                  }
                             });
        }else {callb();}
    };

    function asin2imgsrc(asin,size){
        var imgsrc = 'http://images-jp.amazon.com/images/P/'+asin;
        if (size == 'large'){
            imgsrc += '.09.LZZZZZZZ.jpg';
        }else if (size == 'small'){
            imgsrc += '.09.SZZZZZZZ.jpg';
        }else if (size == 'thumb'){
            imgsrc += '.09.THUMBZZZ.jpg';
        }else {
            imgsrc += '.09.MZZZZZZZ.jpg';
        }
        return imgsrc;
    }

    function expandGoogleUrl( url, callback ){
        $.ajax({
            url : "https://www.googleapis.com/urlshortener/v1/url",
            dataType : "jsonp",
            data : { shortUrl : url, key : 'AIzaSyDI8zjJhoJJguQRAUMxlZuTlOwXsb58lqw' },
            success : function( data ){
                callback( data.error  ? false : data.longUrl );
            }
        });
    };
    /*
    $.fn.Feeder = function( option, callb) {
        return this.each(function() {
            new $.Feeder( this , option, callb);
        });
    };
    */

})(jQuery);

$.feeder = new $.Feeder(window, {}, function(){
    $.when(
        $.feeder.getfeeds('#recentPosts',{
                url: 'http://iaarchiver.net/feed',
                num: 10,
                title: 'RECENT POSTS'
            }),
        $.feeder.get1feed('#recently1',{
            url: 'http://twilog.org/rss-feed/ia_archiver',
            title: '<span class="column-title websymbols pane twitter">Recently Watched</span>',
            key: '#watched'
        }),
        $.feeder.get1feed('#recently2',{
            url: 'http://b.hatena.ne.jp/ia_archiver/rss',
            title: '<span class="column-title websymbols pane hatebu">Recent Bookmark</span>',
            key: ''
        }),
        $.feeder.get1feed('#recently3',{
            url: 'http://twilog.org/rss-feed/ia_archiver',
            title: '<span class="column-title websymbols pane twitter">Recently Read</span>',
            key: '#read'
        }),
        $.feeder.get1feed('#recently4',{
            url: 'http://iaarchiver.tumblr.com/rss',
            title: '<span class="column-title websymbols pane tumblr">Recent Quotes</span>',
            key: ''
        })
    )
    .done(function() {
        refresh();
    })
    .fail(function() {
        console.log('fail');
    });
});

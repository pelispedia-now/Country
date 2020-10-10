String.prototype.replaceAll = function (find, replace) {
     var str = this;
     return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
 };

function QualityType(itag){
    var quality = null;
    if(itag == "5"){
        quality = "240p";
    }else if(itag == "34"){
        quality = "360p";
    }else if(itag == "35"){
        quality = "480p";
    }else if(itag == "18"){
        quality = "360p";
    }else if(itag == "59"){
        quality = "480p";
    }else if(itag == "22"){
        quality = "720p";
    }else if(itag == "37"){
        quality = "1080p";
    }else if(itag == "38"){
        quality = "1080p";
    }else if(itag == "43"){
        quality = "360p";
    }else if(itag == "44"){
        quality = "480p";
    }else if(itag == "45"){
        quality = "720p";
    }else if(itag == "46"){
         quality = "1080p";
    }
    return quality;    
}

function Curl(url){
	var datos_server;
    $.ajax({
      type: "GET",
      url: url,
      dataType: "text",
      async:false,
      cache: false,
      success: function (data) {    
        var Result1 = data.split('url: "');
        var Result2 = Result1[1];
        var Result  = Result2.split('"');
        datos_server = Result[0];
      }
    }).fail(function () {
        datos_server = false;
    });
 return datos_server;
}

function Curl2(url){
	var original;
    $.ajax({
      type: "GET",
      url: url,
      dataType: "json",
      async:false,
      cache: false,
      success: function (data) {
        original = data;
      }
    }).fail(function () {
        original = false;
    });
 return original;
}

function OkServer(url){
	var datos_server;
    $.ajax({
      type: "GET",
      url: url,
      dataType: "text",
      async:false,
      cache: false,
      success: function (html) {    
        var list = { 'PelisPedia' :[], 'Quality' :"-2" };
       	$("div[data-module='OKVideo']", html).each(function(){
        var data_video = $(this).attr("data-options")        
		var final = "{" + data_video.substring(data_video.lastIndexOf("\\\"videos"), data_video.lastIndexOf(",\\\"metadataEmbedded")).replaceAll("\\&quot;", "\"").replaceAll("\\u0026", "&").replaceAll("\\", "").replaceAll("%3B", ";") + "}";
        var jsonData = JSON.parse(final);
        if (jsonData.videos.length > 0) {
        for (var i = 0; i < jsonData.videos.length; i++) {
            var file = jsonData.videos[i].url.replaceAll("ct=0", "ct=4");
            var label = jsonData.videos[i].name;
            var type = "mp4";
            list.PelisPedia.push({
              "file": file,
              "label": label,
              "type": type
            });
          }
         } else {
             datos_server = false;
         }
        });
        datos_server = JSON.stringify(list);
      }
    }).fail(function () {
        datos_server = false;
    });
 return datos_server;
}

function FembedServer(url){
	var datos_server;
    $.ajax({
      type: "POST",
      url: url.replaceAll('fembed.com', 'uptobox.video').replaceAll('/v/', '/api/source/'),
      dataType: "json",
      async:false,
      cache: false,
      success: function (data) {    
        var list = { 'PelisPedia' :[], 'Quality' :"-3" };
        if (data.data.length >= 1) {
        for (var i = 0; i < data.data.length; i++) {
            var file = data.data[i].file;
            var label = data.data[i].label;
            var type = data.data[i].type;
            list.PelisPedia.push({
              "file": file,
              "label": label,
              "type": type
            });
        }
        var verificar = JSON.stringify(list)
        if(verificar.indexOf( '360p' )!= -1){
          list.Quality = "-2";
        }
        datos_server = JSON.stringify(list);
        }else{
           datos_server = false;
        }
      }
    }).fail(function () {
        datos_server = false;
    });
 return datos_server;
}

function YandexServer(url){
	var datos_server;
    $.ajax({
      type: "GET",
      url: url,
      dataType: "text",
      async:false,
      cache: false,
      success: function (data) {    
        var list = { 'PelisPedia' :[], 'Quality' :"-2" };
        var Yandex1 = data.split('"videoStreams":');
        var Yandex2 = Yandex1[1];
        var Yandex = Yandex2.split(',"loading"');
        var jsonData = JSON.parse(Yandex[0]);
        for (var i = 0; i < jsonData.videos.length; i++) {
            var file = jsonData.videos[i].url;
            var label = jsonData.videos[i].dimension.replaceAll('adaptive', 'auto');
            var type = 'mp4';
            list.PelisPedia.push({
              "file": file,
              "label": label,
              "type": type
            });
        }
        datos_server = JSON.stringify(list);
      }
    }).fail(function () {
        datos_server = false;
    });
 return datos_server;
}

function SendVidServer(url){
	var datos_server;
    $.ajax({
      type: "GET",
      url: url,
      dataType: "text",
      async:false,
      cache: false,
      success: function (html) {    
        var list = { 'PelisPedia' :[], 'Quality' :"-3"  };
       	$("source", html).each(function(){
        var data_video = $(this).attr("src")            
            list.PelisPedia.push({
              "file": data_video,
              "label": '480p',
              "type": 'mp4'
            });
        });
        datos_server = JSON.stringify(list);
      }
    }).fail(function () {
        datos_server = false;
    });
 return datos_server;
}

function BloggerServer(url){
	var datos_server;
    $.ajax({
      type: "GET",
      url: url,
      dataType: "text",
      async:false,
      cache: false,
      success: function (data) {    
        var list = { 'PelisPedia' :[], 'Quality' :"-2" };
        var Blogger1 = data.split('VIDEO_CONFIG = {');
        var Blogger2 = Blogger1[1];
        var Blogger  = Blogger2.split(']}');
        var final   = '{' + Blogger[0] + ']}';
        var jsonData = JSON.parse(final);
        for (var i = 0; i < jsonData.streams.length; i++) {
            var file = jsonData.streams[i].play_url;
            var label = QualityType(jsonData.streams[i].format_id);
            var type = 'mp4';
            list.PelisPedia.push({
              "file": file,
              "label": label,
              "type": type
            });
        }
        datos_server = JSON.stringify(list);
      }
    }).fail(function () {
        datos_server = false;
    });
 return datos_server;
}

function PlaymemoriesServer(url){
	var datos_server;
    $.ajax({
      type: "GET",
      url: url.replaceAll('pmo://', 'https://ws.playmemoriesonline.com/api/3.0/items/'),
      dataType: "text",
      async:false,
      cache: false,
      success: function (data) {    
        var list = { 'PelisPedia' :[], 'Quality' :"-3" };
        var jsonData = JSON.parse(data);
        try {
            list.PelisPedia.push({
              "file": jsonData.url_3gp_video,
              "label": '240p',
              "type": 'mp4'
            });
        }
        catch(err) {}
        try {
            list.PelisPedia.push({
              "file": jsonData.url_mp4_video,
              "label": '360p',
              "type": 'mp4'
            });
        }
        catch(err) {}
        try {
            var CurlDatos = Curl(jsonData.item_web_url);
            if(CurlDatos){
            list.PelisPedia.push({
              "file": CurlDatos,
              "label": '480p',
              "type": 'mp4'
            });
            }
        }
        catch(err) {}
        datos_server = JSON.stringify(list);
      }
    }).fail(function () {
        datos_server = false;
    });
 return datos_server;
}

function AmazonServer(url){
	var datos_server;
    $.ajax({
      type: "GET",
      url: "https://www.amazon.com/drive/v1/shares/"+ url +"?resourceVersion=V2&ContentType=JSON",
      dataType: "json",
      async:false,
      cache: false,
      success: function (data) {
      var datas = Curl2("https://www.amazon.com/drive/v1/nodes/"+ data.nodeInfo.id +"/children?resourceVersion=V2&tempLink=true&shareId=" + url);
        var list = { 'PelisPedia' :[], 'Quality' :"-5"  };
        for (var i = 0; i < datas.data.length; i++) {
            var file = datas.data[i].tempLink;
            var label = "1080p";
            var type = "mp4";
            list.PelisPedia.push({
              "file": file,
              "label": label,
              "type": type
            });
        }
        datos_server = JSON.stringify(list);
      }
    }).fail(function () {
        datos_server = false;
    });
 return datos_server;
}

function MailRuServer(url){
	var datos_server;
    $.ajax({
      type: "GET",
      url: url,
      dataType: "text",
      async:false,
      cache: false,
      success: function (data) {   
        var list = { 'PelisPedia' :[], 'Quality' :"-5" };
        //var Result10 = data.split('"weblink_video": [');
        //var finals   = Result10[1];
        var regex = '/cloclo[^&].+/';
          
        var file = 'https:/' + data.match(regex)[0] + '0p/' + btoa(url.split('/public/')[1]) + '.m3u8?double_encode=1&x-email=google.com@mail.ru';
        var label = '1080p';
        var type = 'mp4';
        list.PelisPedia.push({
          "file": file,
          "label": label,
          "type": type
        });
        datos_server = JSON.stringify(list);
      }
    }).fail(function () {
        datos_server = false;
    });
 return datos_server;
}

function YandexServerFile(url){
	var datos_server;
    $.ajax({
      type: "GET",
      url: url,
      dataType: "text",
      async:false,
      cache: false,
      success: function (data) {    
        var list = { 'PelisPedia' :[], 'Quality' :"-2" };
        var MailRu1 = data.split('"weblink_get": [');
        var MailRu2 = MailRu1[1];
          
        var enlace = MailRu2.substring(MailRu2.lastIndexOf('"url": "'), MailRu2.lastIndexOf('"'));
          
            var file = enlace.replaceAll('\"url\": \"', '') + '0p/' + btoa(url.split('/public/')[1]) + '.m3u8?double_encode=1&x-email=google.com@mail.ru';;
            var label = '1080p';
            var type = 'mp4';
            list.PelisPedia.push({
              "file": file,
              "label": label,
              "type": type
            });
        datos_server = JSON.stringify(list);
      }
    }).fail(function () {
        datos_server = false;
    });
 return datos_server;
}

function Servidores(url){
    
    if (url.match(/cloud.mail.ru/)) {
        return YandexServerFile(url);
    } else 
    if (url.match(/mail.com/)) {
        return MailRuServer(url);
    } else 
    if (url.match(/amazon.com/)) {
        return AmazonServer(url.split('/clouddrive/share/')[1]);
    } else 
    if (url.match(/blogger.com/)) {
        return BloggerServer(url);
    } else 
    if (url.match(/sendvid.com/)) {
        return SendVidServer(url);
    } else 
    if (url.match(/yadi.sk/)) {
        return YandexServer(url);
    } else 
    if (url.match(/pmo:/)) {
        return PlaymemoriesServer(url);
    } else 
    if (url.match(/ok.ru/)) {
        return OkServer(url);
    } else 
    if (url.match(/uptobox.video/)) {
        return FembedServer(url);
    } else
    if (url.match(/fembed.com/)) {
        return FembedServer(url);
    } else {
        return false;
    }
}
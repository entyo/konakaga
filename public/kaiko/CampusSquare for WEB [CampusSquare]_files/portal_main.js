/* util */
function cutUrl(url, base){
  if (url == null || typeof url == 'undefined'){
    return "";
  }
  if (url.indexOf(base, 0) == 0){
    return url.substring(base.length);
  }
  return url;
}

function reloadPortal(tabId, page, locale, switchDevice, mainFrameWfId, action, target, customQuery){
  if (tabId == null || typeof tabId == 'undefined'){
    tabId = currentTabId;
  }
  if (page == null || typeof page == 'undefined'){
    page = portalConf.page;
  }
  var query = "";
  var mainWfSetFlg = true;
  
  if (customQuery != null && typeof customQuery != 'undefined' && customQuery != ''){
    query = customQuery;
    var idx = query.indexOf('?', 0);
    if (idx > -1){
      query = "&" + query.substring(idx+1);
    }
    if (action == 'rfw' && (mainFrameWfId == null || typeof mainFrameWfId == 'undefined' || mainFrameWfId == '')){
      idx = query.indexOf('_flowId=', 0);
      if (idx > -1){
        mainWfSetFlg = false;
        var last = query.indexOf('&', idx+1);
        if (last > -1){
          mainFrameWfId = query.substring(idx + 8, last);
        } else {
          mainFrameWfId = query.substring(idx + 8);
        }
      }
    }
  }
  if (action != null && typeof action != 'undefined' && action != ''){
    query += "&action=" + action;
    if (mainWfSetFlg && action == 'rfw' && mainFrameWfId != null && typeof mainFrameWfId != 'undefined' && mainFrameWfId != ''){
      query += "&_flowId=" + mainFrameWfId;
    }
  }
  if (page != null && typeof page != 'undefined' && page != ''){
    query += "&page=" + page;
  }
  if (tabId != null && typeof tabId != 'undefined' && tabId != '' && tabId != 'TABMENU'){
    query += "&tabId=" + tabId;
  }
  if (locale != null && typeof locale != 'undefined' && locale != ''){
    query += "&locale=" + locale;
  }
  if (mainFrameWfId != null && typeof mainFrameWfId != 'undefined' && mainFrameWfId != ''){
    query += "&wfId=" + mainFrameWfId;
  }
  if (query != ""){
    query = "?" + query.substring(1);
  }
  
  var url = "";
  if (switchDevice != null && typeof switchDevice != 'undefined' && switchDevice){
    url = portalConf.switchDeviceUrl + query;
  } else {
    url = portalConf.portalUrl + query;
  }
  
  if (target != null && typeof target != 'undefined'){
    window.open(url, target);
  } else {
    location.href = url;
  }
  
}

/* ajax */
function appendLoading(target, wfId, width, height){
  var id = wfId + "-loading";
  if (width == null || typeof width == 'undefined'){
    width = $('#' + wfId).width();
    if (width == null || typeof width == 'undefined'){
      width = 100;
    }
  }
  if (height == null || typeof height == 'undefined'){
    height = 100;
  }
  var loading = $('#' + id);
  if (loading.size() == 0){
    target.append("<div class='loading' id='" + id + "'></div>");
    loading = $('#' + id, target);
    loading.width(width);
    loading.height(height);
    loading.css("z-index", "9999");
    loading.css("opacity", "1");
  }
  return loading;
}

function getAjaxGetUrl(wfId, param){
  var url = portalConf.portalUrl + "?page=" + portalConf.page + "&action=rwf&tabId=" + currentTabId + "&wfId=" + wfId + "&rwfHash=" + portalConf.rwfHash;
  if (param != null && typeof param != 'undefined' && param != ''){
    url += "&" + param;
  }
  return url;
}

function loadWebMain(flowId, opt){
  if (opt == null || typeof opt == 'undefined'){
    opt = {};
  }
  var url = opt.url;
  if (opt.url == null || typeof opt.url == 'undefined'){
    url = portalConf.webUrl + "?_flowId=" + flowId;
  }
  
  return loadPortletMenu("main", url, opt);
}

function loadPortletMain(menuId, opt){
  if (opt == null || typeof opt == 'undefined'){
    opt = {};
  }
  var url = opt.url;
  if (opt.url == null || typeof opt.url == 'undefined'){
    url = getAjaxGetUrl('main_' + menuId + '_menu');
  }
  
  opt.portletFlg = '1';
  opt.mainWfId = 'main_' + menuId + '_menu';
  
  return loadPortletMenu("main", url, opt);
}

function loadPortletMenu(target, url, opt){
  if (opt == null || typeof opt == 'undefined'){
    opt = {};
  }
  if (target == "main"){
    if (portalConf.runMode == 'design' && opt.disableCheckDesign != true){
      alert("設定中はメニュー機能を表示できません。");
      return false;
    }
    
    opt.url = url;
    if (opt.portletFlg == '1'){
      loadPortletImpl("main-frame-div", "GET", null, opt);
    } else {
        if (portalConf.isDeviceLocaleSmartphone){
            reloadPortal(null, null, null, false, null, 'rfw', null, url);
        } else {
            loadPortletImpl("main-frame-if", "GET", null, opt);
        }
    }
  } else {
    window.open(url, null);
  }
  return false;
}
function loadPortletGet(wfId, opt){
  loadPortletImpl(wfId, "GET", null, opt); 
  return false;
}
function loadPortletPost(wfId, formId, opt){
  loadPortletImpl(wfId, "POST", formId, opt); 
  return false;
}
function loadPortletImpl(wfId, method, formId, opt){
  if (opt == null || typeof opt == 'undefined'){
    opt = {};
  }
  if (opt.outEffect == null || typeof opt.outEffect == 'undefined'){
    opt.outEffect = "fade";
  }
  if (opt.outOptions == null || typeof opt.outOptions == 'undefined'){
    opt.outOptions = {};
  }
  if (opt.outSpeed == null || typeof opt.outSpeed == 'undefined'){
    opt.outSpeed = "slow";
  }
  if (opt.inEffect == null || typeof opt.inEffect == 'undefined'){
    opt.inEffect = "fade";
  }
  if (opt.inOptions == null || typeof opt.inOptions == 'undefined'){
    opt.inOptions = {};
  }
  if (opt.inSpeed == null || typeof opt.inSpeed == 'undefined'){
    opt.inSpeed = "slow";
  }
  
  var portlet = $('#'+wfId, document);
  if (portlet.size() <= 0){
    return false;
  }
  var box = portlet.parent();
  
  var scrollTop = $('html,body').scrollTop();
  if (scrollTop <= 0){
    scrollTop = $(window).scrollTop();
  }
  
  portlet.css("z-index", "0");
  
  if (wfId == "main-frame-if"){
    $("#main-frame-div-loading", document).hide();
    $("#main-frame-div", document).fadeOut('slow').unbind().empty();
    //portlet.hide();
    portlet.unbind();
    portlet.empty();
    portlet.attr("src", "about:blank");
    
    if (box.hasClass("portlet-m")){
      var msize = $("#dummy-portlet-m").width();
      box.width(msize);
      portlet.width(msize);
    } else {
      var lsize = $("#dummy-portlet-l").width();
      box.width(lsize);
      portlet.width(lsize);
    }
    
  } else if (wfId == "main-frame-div"){
    $("#main-frame-if-loading", document).hide();
    $("#main-frame-if", document).fadeOut('slow').unbind().empty();
    
  } else {
    //portlet.hide();
    //portlet.unbind();
    
    var title = $('#'+wfId+"-title", document);
    if (title.is(':visible') && typeof title.attr("ptEffectFlg") != 'undefined'){
      title.attr("ptEffectLock", "lock").hide();
      $('#'+wfId+" .portlet-title-linker").attr("ptEffectLock", "lock").hide();
    }
  }
  
  // loading
  var loading = $('#'+wfId + "-loading", document);
  if (loading.size() > 0){
    //loading.width(pw);
    loading.height(100);
    loading.css("z-index", "9999");
    loading.css("opacity", "1");
    var ptop = loading.parent().offset().top;
    if (ptop > 0){
      //loading.css("top", loading.parent().position().top);
    }
    loading.show();
  }
  
  if (wfId == "main-frame-if"){
    //var pw = box.outerWidth();
    //if (pw < 100){ pw = 100; }
    //portlet.animate({width: (pw+'px'), height: '130px'}, 'fast');

    portlet.attr("src", opt.url);

    // IE
    //if (jQuery.browser.msie){
    //  clearBehaviors();
    //}
    
    portlet.fadeIn('slow');
    
  } else {
    var postData = {};
    if (method == 'GET'){
      if (opt.url == null || typeof opt.url == 'undefined'){
        opt.url = getAjaxGetUrl(wfId, null);
      }
    } else {
      if (opt.url == null || typeof opt.url == 'undefined'){
        opt.url = $('#'+formId).attr("action");
        if (opt.url == null || typeof opt.url == 'undefined'){
          opt.url = portalConf.portalUrl;
        }
      }
      
      if (opt.customHidden != null && typeof opt.customHidden != 'undefined'){
        postData = opt.customHidden;
      }
      
      $('#'+formId).find(':input').each(function(){
        if (!$(this).is(':disabled')) {
          var name = $(this).attr('name');
          if ($(this).attr('type') == "checkbox") {
            if ($(this).is(':checked')) {
              //if (typeof name != 'undefined' && name != '' && name.match(/\[\]$/)){
                var arr = [];
                $('#'+formId).find("'input[name='"+name+"']:checked").each(function(){
                  arr.push($(this).val());
                });
                if (arr.length > 1){
                  postData[name] = arr;
                } else {
                  postData[name] = arr[0];
                }
              //} else {
              //  postData[name] = $(this).val();
              //}
            }
          } else if ($(this).attr('type') == "radio") {
            if ($(this).is(':checked')) {
              postData[name] = $(this).val();
            }
          } else if ($(this).get(0).tagName == "SELECT") {
            postData[name] = $(this).val();
          } else {
            postData[name] = $(this).val();
          }
        }
      });
      if (postData.action == null && typeof postData.action == 'undefined'){
        postData.action = "rwf";
      }
      if (postData.tabId == null && typeof postData.tabId == 'undefined'){
        postData.tabId = currentTabId;
      }
      if (postData.page == null && typeof postData.page == 'undefined'){
        postData.page = portalConf.page;
      }
      postData.rwfHash = portalConf.rwfHash;
    }
    $.ajax({
      type: (method),
      url: (opt.url),
      cache: false,
      data: (postData),
      traditional: true,  // $.param option for jQuery 1.3 mode
      timeout: 300000,  // 300sec
      complete: function(xhr, status){
        var result = xhr.responseText;
        
        if (wfId == "main-frame-div"){
          $("#main-frame-if", document).hide();
          result = '<div class="loading" id="' + opt.mainWfId + '-loading"></div>'
                 + '<div id="' + opt.mainWfId + '">' + result + '</div>';
        }
        
        if (xhr.status != 200 &&
            (result == null || typeof result == '' || result.length <= 0)){
          //TODO: エラー表示
          portlet.html(xhr.statusText);
          portlet.show();
          if (loading.size() > 0){
            loading.hide();
          }
          
        } else {
          //200:OK
          portlet.hide(opt.outEffect, opt.outOptions, opt.outSpeed, function() {
            if (opt.outCallback != null && typeof opt.outCallback != 'undefined'){
              opt.outCallback();
            }
            portlet.empty();
            portlet.html(result);
            portlet.show(opt.inEffect, opt.inOptions, opt.inSpeed, function() {
              if (opt.inCallback != null && typeof opt.inCallback != 'undefined'){
                opt.inCallback();
              }
              try{
                if (portlet.find("#system-err-flg").size() == 0){
                  initTimeout();
                }
              } catch (e) {
              }
              if (loading.size() > 0){
                loading.fadeOut('fast', function() {
                  loading.hide();
                  portlet.show();
                  portlet.fadeTo("fast", 1.0);
                });
                loading.hide();
              } else {
                portlet.show();
                portlet.fadeTo("fast", 1.0);
              }
              portlet.show();
              if (portlet.find(".no-title").size() > 0){
                setTimeout(function(){
                  var title = getPortletTitle(wfId, portalConf.lang);
                  $('#'+wfId).attr("title", title);
                }, 1000);
              }
              if (opt.complete != null && typeof opt.complete != 'undefined'){
                opt.complete();
              }
              
              if (loading.size() > 0){
                loading.hide().css("display", "none");
              }
            });
          });
        }
      }
    });
  }
  
  if (wfId == "main-frame-if"){
    //$('html,body').scrollTop(0);
    campusVScrollId('html,body', '#main-frame', {isHtmlBody: true});
  } else {
    $('html,body').scrollTop(scrollTop);
  }
  
  return false;
}

function showLoading(wfId){
  var portlet = $('#'+wfId, document);
  if (portlet.size() <= 0){
    return false;
  }
  var box = portlet.parent();
  
  var pw = box.width();
  if (pw < 100){ pw = 100; }
  
  // loading
  var loading = $('#'+wfId + "-loading", document);
  loading.width(pw);
  loading.height(100);
  loading.css("z-index", "9999");
  loading.css("opacity", "1");
  var ptop = loading.parent().offset().top;
  if (ptop > 0){
    loading.css("top", loading.parent().position().top + 30);
  }
  loading.show();
  return false;
}

/* resize */
function resizePortalNow(marginResizeFlg){
  var bak = resizeLock;
  resizeLock = false;
  resizePortal(marginResizeFlg);
  resizeLock = resizeLock;
  return false;
}

function resizePortal(marginResizeFlg){
  return resizePortalImpl(marginResizeFlg, 0);
}
// mainWidth for main_portlet.js
function resizePortalImpl(marginResizeFlg, mainWidth){
  windowResizeTimer = null;
  if (resizeLock) return false;
  if (portalConf.isDeviceLocaleSmartphone == true || portalConf.templateSwitchKeySmart == true) return false;
  
  tabAreaWidth = portalConf.tabWidth * tabCountV;
/*
  if (marginResizeFlg || portalConf.runMode == 'design'){
    var clientW = $("#logo-area").width();
    var margin = (($(window).width() - clientW) / 2) - defLeftMargin;
    if (margin < defLeftMargin){
      margin = defLeftMargin;
    }
    if (Math.abs(portalLeftMargin - margin) > 30){
      //前回計算値との差が30px越えなら変更。30px以内なら、誤差としてそのまま維持。（細かい移動を防ぐ）
      portalLeftMargin = margin;
    }
  }
*/
  resizePortalArea(marginResizeFlg, mainWidth);

  $("#logo-area").css({'margin-right': ('inherit')});
  $("#tab-area").css({'margin-right': ('inherit')});
  $("#body-area").css({'margin-right': ('inherit')});
  $("#footer-area").css({'margin-right': ('inherit')});
/*
  if (tabSetting.bodyCenter == 'checked'){
    $("#logo-area").animate({'margin-left': (portalLeftMargin + 'px')}, 'fast');
  } else {
    $("#logo-area").animate({'margin-left': (defLeftMargin + 'px')}, 'fast');
  }
*/
  
  return false;
}

function resizePortalArea(marginResizeFlg, mainWidth){
//  if (portalConf.runMode == 'design'){
    $("#body-area").css("width", (tableWidth + 1000) + "px");
//  }
//  if (mainWidth <= 0){
    var w = $("#portaltable").width() + portalAreaCount * 2;
    tableWidth = w;// - 1;
    if (portalConf.runMode == 'design'){
      //tableWidth -= 1;
    }
//    oldMainWidth= $("#main-frame-if").width();
    
//  } else {
//    tableWidth = tableWidth + (mainWidth - oldMainWidth);
//    oldMainWidth = mainWidth;
//  }
  if (tableWidth < tabAreaWidth){
    tableWidth = tabAreaWidth;
  }
  
  if (tableWidth > 0){
    if (marginResizeFlg || portalConf.runMode == 'design'){
      var margin = (($(window).width() - tableWidth) / 2) - defLeftMargin;
      //var margin = (($(window).width() - tableWidth) / 2);
      if (margin < defLeftMargin){
        margin = defLeftMargin;
      }
      if (Math.abs(bodyLeftMargin - margin) > 30){
        //前回計算値との差が30px越えなら変更。30px以内なら、誤差としてそのまま維持。（細かい移動を防ぐ）
        bodyLeftMargin = margin;
      }
      
      if (tabSetting.bodyCenter != 'checked'){
        bodyLeftMargin = defLeftMargin;
      }
    }
    
    var rightMargin = defRightMargin;
    if (portalConf.runMode == 'design'){
      rightMargin += 10;
    }
    var ww = $(window).width();
    
    if (tableWidth + bodyLeftMargin + rightMargin < ww){
      //var vScrollBar = windowWidth - $(window).width();
      portalWidth = ww;
    } else {
      portalWidth = tableWidth + bodyLeftMargin + rightMargin;
    }
    
    var sp = 5;
    var border = 2;
    var wOffset = (sp + border) * 2;
    if (jQuery.browser.msie && jQuery.browser.version < 9){
      sp = 0;
      border = 0;
      wOffset = 0;
    } else if (jQuery.browser.webkit){
      wOffset = 0;
    }
    
    $("#header-span").width(portalWidth);
    $("#body-span").width(portalWidth);
    $("#footer-span").width(portalWidth);
    
    $("#logo-area").width(tableWidth - wOffset);
    $("#tabtable").width(tableWidth);
    $("#body-area").width(tableWidth);
    $("#footer-area").width(tableWidth);
    
    $("#logo-area").animate({'margin-left': ((bodyLeftMargin + sp) + 'px')}, 'fast');
    $("#tab-area").animate({'margin-left': (bodyLeftMargin + 'px')}, 'fast');
    $("#body-area").animate({'margin-left': (bodyLeftMargin + 'px')}, 'fast');
    $("#footer-area").animate({'margin-left': (bodyLeftMargin + 'px')}, 'fast');
    
    $("#portal-setting-area").width(portalWidth);
    $("#portal-setting-area-bg").width(portalWidth);
    
  } else {
    // Arienai case
    Alert("Portal Width ERROR");
  }
  
  resizePortalMenus();
  
  return false;
}

function resizePortalMenus(){
  return resizePortalMenusImpl(tableWidth, portalWidth);
}
function resizePortalMenusImpl(pTableWidth, pPortalWidth){
  var menuWidth = pTableWidth;
  
  if (tabSetting.menuVisible == 'checked'){
    $("#tabmenu-area").show();
    $("#tabmenu-span").css("margin-top", "-1px");  // to Firefox
  } else {
    $("#tabmenu-span").css("margin-top", "0px");  // to Firefox
    $("#tabmenu-area").hide();
  }
  
  if (tabSetting.tabAllWidth == "checked"){
    tabMenuAreaWidth = pPortalWidth;
    if (tabSetting.tabBorderDisp == 'checked'){
      tabMenuAreaWidth = tabMenuAreaWidth - 2;  // -2: border
    }
    
    $("#tabmenu-area").css({'margin-left': '0px', 'margin-right': '0px', 'width': ''});
    
    if (tabSetting.bodyCenter == 'checked'){
      $("#tabmenutable").animate({'margin-left': (bodyLeftMargin + 'px')}, 'fast');
    } else {
      $("#tabmenutable").animate({'margin-left': (defLeftMargin + 'px')}, 'fast');
    }
  } else {
    tabMenuAreaWidth = menuWidth;
    //if (tabSetting.tabBorderDisp == 'checked'){
      tabMenuAreaWidth = tabMenuAreaWidth - 2;  // -2: border
    //}
    
    $("#tabmenu-area").css({'margin-right': ('inherit')});
    
    if (tabSetting.bodyCenter == 'checked'){
      $("#tabmenu-area").animate({'margin-left': ((bodyLeftMargin) + 'px')}, 'fast');
    } else {
      $("#tabmenu-area").animate({'margin-left': ((defLeftMargin) + 'px')}, 'fast');
    }
    $("#tabmenutable").animate({'margin-left': ('0px')}, 'fast');
    $("#tabmenu-area").width(tabMenuAreaWidth);
  }
  $("#tabmenutable").width(menuWidth);
  
  return false;
}

function resizePortalTabs(){
  if (portalConf.isDeviceLocaleSmartphone == true || portalConf.templateSwitchKeySmart == true) return false;

  var tab = $("#tabtable .tabcell");
  
  var size = 48;
  var margin = 21;
  if (tabSetting.tabSize == 'M'){
    size = 32;
    margin = 18;
    //textHeight = textHeight * 2;
    
  } else if (tabSetting.tabSize == 'S'){
    size = 24;
    margin = 15;
    //textHeight = textHeight * 2;
    
  }
  
  if (tabSetting.tabTextVisible == 'checked'){
    tab.find("p").show();
  } else {
    tab.find("p").hide();
  }
  
  portalConf.tabWidth = size + margin * 2 + 1;  // *2: Left&Right, +1:offset
  
  tab.find("img").width(size).height(size).css("margin-left", margin + "px");
  tab.width(portalConf.tabWidth);
  
  if (tabSetting.tabIconVisible == 'checked'){
    tab.find("img").show();
  } else {
    tab.find("img").hide();
  }
  
  tab.css("height", "");
  
  if (tabSetting.tabVisible == 'checked'){
    $("#tab-area").show();
  } else {
    $("#tab-area").hide();
  }
  
  var h = 0;
  tab.each(function(){
    var wh = $(this).height();
    if (h < wh){
      h = wh;
    }
  });
  portalConf.tabHeight = h;
  tab.height(portalConf.tabHeight);
  
  portalConf.tabWidth = portalConf.tabWidth + 10;  // +10:padding Left&Right
  portalConf.tabHeight = portalConf.tabHeight + 10;  // +10:padding Left&Right
  
  resizePortal(true);
}


/* tab add */
function addTabs(tabId){
  tabCount = tabCount + 1;
  tabCountV = tabCountV + 1;
  
  tabs[tabId] = {no: (tabCount), id: (tabId), dispFlg: "1", tabNm: ("タブ"+tabNoSeq), tabNmEng: ("Tab"+tabNoSeq), icon: (staticImg.sp)};
  
  $("#tabtable .float-clear").before('<div id="tab-'+tabId+'" class="tabcell"><img src="' + tabs[tabId].icon + '"><p></p></div>');
  $("#tab-" + tabId).click(function(){
    changeTab($(this).attr("id").substring(4));
  }).hover(
    hoverMenuOver, hoverMenuOut
  );
  
  menus[tabId] = {};
  
  resizePortalTabs();
}
/* tab del */
function deleteTabs(tabId){
  tabCount = tabCount - 1;
  if (tabs[tabId].dispFlg == "1"){
    tabCountV = tabCountV - 1;
  }
  
  delete tabs[tabId];
  
  delete menus[tabId];
  
  $("#tab-" + tabId).unbind().remove();
  resizePortalTabs();
}

/* tab change */
function changeTab(tabId){
  if (tabs[tabId].dispFlg != "1"){
    return false;
  }
  if (portalConf.runMode == 'design'){
    alert("設定中はタブを切り替えられません。");
    return false;
  }
  
  // IE
  //if (jQuery.browser.msie){
  //  clearBehaviors();
  //}

  reloadPortal(tabId);
  
  return false;
}

/* menu folder click */
function menuFolderClick(obj){
  var wul = $('ul.tabmenu-sub-ul', obj);
  if (wul.hasClass("open")){
    $(document).unbind("click");
    wul.hide("blind", "", "fast", function(){
      wul.removeClass("open");
    });
  } else {
    wul.addClass("open");
    wul.show("blind", "", "fast", function(){
      $(document).click(function(){
        $(document).unbind("click");
        wul.hide("blind", "", "fast", function(){
          wul.removeClass("open");
        });
      });
    });
  }
}

/* menu show */
function showMenu(tabId, loadFlg, lang){
  var ul = $("#tabmenu-ul");
  ul.find("li").unbind();
  ul.empty();
  
  var menu = menus[tabId];
  if (typeof menu == 'undefined'){
    return false;
  }
  var menuSize = menu.length;
  var size = menuSize + sysMenus.length;
  
  var firstFlg = true;
  var folderNo = 0;
  var folderNm = "";
  for (i = 0; i < size; i++){
    var menuItem = (i < menuSize)? menu[i]: sysMenus[i-menuSize];
    if (menuItem.dispFlg == "1" && menuItem.authFlg){
      var wkFolderNm = menuItem.folderNm;
      if (lang != 'ja'){
        wkFolderNm = menuItem.folderNmEng;
      }  
      if (wkFolderNm != folderNm){
        if (wkFolderNm != ""){
          folderNo++;
          var ulid = "tabmenu-sub-ul" + folderNo;
          var z = '<li id="tabmenu-li' + folderNo + '"><span><img src="' + staticImg.menuFolder + '">&nbsp;' + wkFolderNm + '&nbsp;<img src="' + staticImg.menuFolderRight + '"></span><ul id="' + ulid + '" class="tabmenu-sub-ul"></ul></li>';
          $("#tabmenu-ul").append(z);
          var li = $("#tabmenu-li" + folderNo);
          ul = $("#" + ulid);
          
          li.click(function(){menuFolderClick(this);});
        } else {
          ul = $("#tabmenu-ul");
        }
        folderNm = wkFolderNm;
      }
      var x = "";
      switch (menuItem.menuKbnCd){
      case "1":
        var url = "";
        var cls = "";
        var mainWfId = "main_" + menuItem.menuId + "_menu";
        if (menuItem.portletFlg == "1"){
          url = getAjaxGetUrl(mainWfId);
          cls = "menu-portlet";
        } else {
          url = portalConf.webUrl + "?_flowId=" + menuItem.funcId + "-flow";
          cls = "menu-func";
        }
        
        x = x + '<li class="' + cls + '"><span onclick="return loadPortletMenu(';
        x = x + "'";
        x = x + menuItem.target;
        x = x + "','";
        x = x + url;
        x = x + "',{portletFlg: '";
        x = x + menuItem.portletFlg;
        x = x + "', mainWfId: '";
        x = x + mainWfId;
        x = x + "'});" + '">';
        if (menuItem.icon != null && menuItem.icon != '' && menuItem.icon != staticImg.base){
          x = x + '<img src="';
          x = x + menuItem.icon;
          x = x + '"> ';
        }
        if (lang == "ja"){
          x = x + menuItem.menuNm;
        } else {
          x = x + menuItem.menuNmEng;
        }
        x = x + "</span></li>";
        
        if (loadFlg && firstFlg){
          if (wkFolderNm == "" && (menuItem.target != "_blank" || menuItem.portletFlg == "1")){
            firstFlg = false;
            var firstTarget = menuItem.target;
            var firstUrl = url;
            var firstPortletFlg = menuItem.portletFlg;
            var firstMainWfId = mainWfId;
            setTimeout(function(){
              loadPortletMenu(firstTarget, firstUrl, {portletFlg: (firstPortletFlg), 'mainWfId': (firstMainWfId)});
            }, 50);
          }
        }
        break;
      case "2":
        if (menuItem.url != ""){
          x = x + '<li class="menu-link"><span onclick="return loadPortletMenu(';
          x = x + "'";
          x = x + menuItem.target;
          x = x + "','";
          x = x + menuItem.url;
          x = x + "');" + '">';
          if (menuItem.icon != null && menuItem.icon != '' && menuItem.icon != staticImg.base){
            x = x + '<img src="';
            x = x + menuItem.icon;
            x = x + '"> ';
          }
          if (lang == "ja"){
            x = x + menuItem.menuNm;
          } else {
            x = x + menuItem.menuNmEng;
          }
          x = x + "</span></li>";
          
          if (loadFlg && firstFlg){
            if (menuItem.target != "_blank"){
              firstFlg = false;
              var firstTarget = menuItem.target;
              var firstUrl = menuItem.url;
              setTimeout(function(){
                loadPortletMenu(firstTarget, firstUrl);
              }, 50);
            }
          }
        } else {
          x = x + '<li class="menu-nolink">';
          if (menuItem.icon != null && menuItem.icon != '' && menuItem.icon != staticImg.base){
            x = x + '<img src="';
            x = x + menuItem.icon;
            x = x + '"> ';
          }
          if (lang == "ja"){
            x = x + menuItem.menuNm;
          } else {
            x = x + menuItem.menuNmEng;
          }
          x = x + "</li>";
        }
        break;
      }
      if (x != ""){
        ul.append(x);
      }
    }
  }
  
  //if (firstFlg){
  //  $("#main-frame").hide();
  //}
  
  $("#tabmenu-ul").find("li:not(.menu-nolink)").hover(
    hoverMenuOver, hoverMenuOut
  );
  
  //changeStyle("", false);
  
  return false;
}

/* setting mode */
function portalDesign(){
  // IE
  if (portalConf.useIeCss3Pie && jQuery.browser.msie && jQuery.browser.version < 9){
    alert("Internet Explorer 8ではポータル設定機能を使用できません。\nWindows XPの場合には、FirefoxまたはChromeを使用してください。");
    return;
  }
  if (!portalConf.initPortalSettingFlg){
      initPortalSetting();
      portalConf.initPortalSettingFlg = true;
  }
  
  if (portalConf.runMode != 'design'){
    if (portalConf.runMode == ''){
      if (!confirm("入力などを行っている場合、設定モードに切り替えると入力内容が失われます。\n設定モードに切り替えてもよろしいですか？")){
        return;
      }
      $("#portal-setting-menu-tabs").val(currentTabId);
    }
    portalConf.runMode = 'design';
    
    $("#portalset").hide();
    $("#portalsetting").show();

    $(".portal-color-style").each(function(){
      $(this).campusColorPicker('update');
    });
    
    if ($("#portal-setting-scroll-lock").attr("checked") == 'checked'){
      $("#portal-setting-area-bg").height($("#portal-setting-area").outerHeight());
      $("#portal-setting-area-bg").slideDown("slow");
    }
    $("#portal-setting-area").slideDown("slow");
    if ($("#portal-setting-scroll-lock").attr("checked") == 'checked'){
      $("#portal-setting-area").css({position: "fixed", top: "0px", left: "0px"});
    }
    
    var iframe = $("#main-frame-if");
    if (iframe.size() > 0){
      loadPortletMenu("main", staticDoc.DesginMain, {disableCheckDesign: true});
    }
    
    if (portalConf.authLayout == 'checked'){
      $("div.portlet").each(function (i) {
        var _this = $(this);
        var _thisid = _this.attr("id");
        if (typeof _thisid == 'undefined' || _thisid.indexOf("dummy") == -1){
          addPortletSelecter(_thisid, _this, true);
        }
      });
      
      $("div.portalarea").each(function () {
        var _this = $(this);
        var _thisid = _this.attr("id");
        var _thisP = _this.parent();
        
        // IE9 turning
        if (jQuery.browser.msie && jQuery.browser.version == 9){
          /*
            //$("#"+ _thisid +"-sp").parent().removeClass("ie9fix-hide").addClass("ie9fix-show");
            var sp = $("#"+ _thisid +"-sp");
            if (sp.size() > 0){
              document.getElementById(sp.parent().attr("id")).style.display = 'block';
            }
            if (_this.hasClass("portalarea-row")){
              //_thisP.parent().removeClass("ie9fix-hide").addClass("ie9fix-show");
              document.getElementById(_thisP.parent().attr("id")).style.display = 'block';
            } else {
              //_thisP.removeClass("ie9fix-hide").addClass("ie9fix-show");
              document.getElementById(_thisP.attr("id")).style.display = 'block';
            }
          */
            $("#"+ _thisid +"-sp").parent().css({"visibility": "visible", "height": ""});
            if (_this.hasClass("portalarea-row")){
              _thisP.parent().css({"visibility": "visible", "height": ""});
            } else {
              _thisP.css({"visibility": "visible", "height": ""});
            }
        } else {
          $("#" + _thisid + "-sp").parent().show();
          if (_this.hasClass("portalarea-row")){
            _this.parent().parent().show();
          } else {
            _this.parent().show();
          }
        }
        
        $("div.end-of-dummy", this).each(function (i) {
          addPortletSelecter($(this).attr("id"), $(this), false);
        });
        
        _this.parent().css("border", "2px #f00 dashed");
      });
      portalAreaCount = $("#portalrow-body div.portalarea:visible").size();
      
    }
    
    $("div.portalarea").sortable( {
        items: 'div.portlet',
        //cancel: '.portletDesign-dummy',
        connectWith: 'div.portalarea',
        opacity: 0.3,
        delay: 0,
        distance: 20,
        handle: 'div.portletDesigner',
        forceHelperSize: true,
        //helper: 'clone',
        forcePlaceholderSize: true,
        placeholder: 'portlet-full portletDesign-helper',
        tolerance: 'pointer',
        scroll: true,
        //start: function(event, ui){ ui.item.css("display", "block"); },
        update: function(event, ui){
            ui.item.siblings('div.portletDesign-dummy').each(function(){
                $(this).insertAfter($(this).parent().children("*:last"));
            });
            ui.item.siblings('div.end-of-dummy').each(function(){
                $(this).insertAfter($(this).parent().children("*:last"));
            });
        },
    } );
    $("div.portalarea").sortable("enable");
    
    // Firefox 40 bug disableSelection() => select dropdown not working
    //$("div.portalarea").disableSelection().delegate('input,select','click',function(ev){
    //  ev.target.focus();
    //});
    
    
    setTimeout(function(){resizePortal(true);},700);
    
  } else {
    portalConf.runMode = 'preview';
    
    $("#portalsetting").hide();
    $("#portalset").show();
    
    $("#portal-setting-area-bg").hide();
    $("#portal-setting-area").slideUp("slow");
    
    if (portalConf.authLayout == 'checked'){
      
      // Firefox 40 bug disableSelection() => select dropdown not working
      //$("div.portalarea").disableSelection().undelegate('input,select','click');
      
      $("div.portalarea").sortable("destroy");
      
      $("div.portletSelecter, div.portletDesigner, div.portletDesign-dummy").addClass("display-hide").remove();  // display-hide for IE9bug
      
      $("div.portalarea").each(function(){
        var _this = $(this);
        var _thisid = _this.attr("id");
        var _thisP = _this.parent();
        
        _thisP.css("border", "");
        if (_this.children("div.portlet").size() <= 0){
          // IE9 turning
          if (jQuery.browser.msie && jQuery.browser.version == 9){
            /*
            //$("#"+ _thisid +"-sp").parent().addClass("ie9fix-hide").removeClass("ie9fix-show");
            var sp = $("#"+ _thisid +"-sp");
            if (sp.size() > 0){
              document.getElementById(sp.parent().attr("id")).style.display = 'none';
            }
            if (_this.hasClass("portalarea-row")){
              //_thisP.parent().addClass("ie9fix-hide").removeClass("ie9fix-show");
              document.getElementById(_thisP.parent().attr("id")).style.display = 'none';
            } else {
              //_thisP.addClass("ie9fix-hide").removeClass("ie9fix-show");
              document.getElementById(_thisP.attr("id")).style.display = 'none';
            }
            */
            $("#"+ _thisid +"-sp").parent().css({"visibility": "hidden", "height": "0px"});
            if (_this.hasClass("portalarea-row")){
              _thisP.parent().css({"visibility": "hidden", "height": "0px"});
            } else {
              _thisP.css({"visibility": "hidden", "height": "0px"});
            }
            
          } else {
            $("#"+ _thisid +"-sp").parent().hide();
            if (_this.hasClass("portalarea-row")){
              _thisP.parent().hide();
            } else {
              _thisP.hide();
            }
          }
        }
      });
      
      portalAreaCount = $("#portalrow-body div.portalarea:visible").size();
    }
    
    //setTimeout(function(){resizePortal(true);},700);
    setTimeout(function(){changeStyleSetting("", true);},700);
  }
  return false;
}

function addPortletSelecter(id, obj, beFlg){
  if (beFlg){
    addPortletDesignerTag(id, obj);
    var x = "<div class='portletSelecter'>";
    x = x + getPortletSelecterTag();
    x = x + "</div>";
    obj.prepend(x);
  } else {
    var x = "<div class='portletSelecter' id='" + id + "-selecter'>";
    x = x + getPortletSelecterTag();
    x = x + "</div>";
    x = "<div class='portlet-s portlet-break portletDesign-dummy' id='" + id + "-design'>" + x + "</div>";
    obj.before(x);
    changeStyle(id + "-selecter", false);
  }
  return false;
}

// getPortletSelecterTag()は、PortalMain.jsp

function addPortletDesignerTag(id, obj){
  var pid = $('#' + id).find(".portlet-box").attr("id");
  if (id == "main-frame" || id == "main-frame-if-box"){
    pid = "main-frame";
  }
  
  var deleteFlg = "0";
  if (pid == "main-frame"){
    deleteFlg = portalConf.mainDeleteFlg;
  } else {
    deleteFlg = $('#' + id).find("#wfDeleteFlg").val();
  }
  
  var x = "<div class='portletDesigner'>";
  x = x + "<div class=\"float-left\" style=\"width: 45px\"><a href='javasciprt:void(0);' onClick=\"return settingPortlet('" + pid + "')\"><img src='" + staticImg.portletSet + "'>設定</a></div>";
  if (deleteFlg != '0'){
    x = x + "<div class=\"float-left\" style=\"width: 45px\"><a href='javasciprt:void(0);' onClick='return deletePortlet(this)'><img src='" + staticImg.portletDel + "'>削除</a></div>";
  }
  x = x + "<div class=\"float-left\" style=\"width: 45px\"><a href='javasciprt:void(0);' onClick='return movePortlet(this, true)'><img src='" + staticImg.portletUp + "'>上へ</a></div>";
  x = x + "<div class=\"float-left\" style=\"width: 45px\"><a href='javasciprt:void(0);' onClick='return movePortlet(this, false)'><img src='" + staticImg.portletDown + "'>下へ</a></div>";
  if (obj.hasClass("portlet-break")){
    x = x + "<div class=\"float-left\" style=\"width: 70px\"><a href='javasciprt:void(0);' onClick='return breakPortlet(this)'><img src='" + staticImg.portletBreak + "'>折り返し</a></div>";
  } else {
    x = x + "<div class=\"float-left\" style=\"width: 70px\"><a href='javasciprt:void(0);' onClick='return breakPortlet(this)'><img src='" + staticImg.portletNoBreak + "'>折り返し</a></div>";
  }
  x = x + "<div class=\"float-left\" style=\"cursor: pointer\">&nbsp;ドラッグで移動&nbsp;</div>";
  x = x + "<div class=\"float-clear\"></div></div>";
  
  obj.prepend(x);
  
}

function getPortletNo(){
  var now = new Date();
  var res = ""
          + now.getFullYear() + ("0" + (now.getMonth() + 1)).slice(-2) + ("0" + now.getDate()).slice(-2)
          + ("0" + now.getHours()).slice(-2) + ("0" + now.getMinutes()).slice(-2) + ("0" + now.getSeconds()).slice(-2);
  return res;
}
function addPortlet(obj){
  var _obj = $(obj);
  var val = _obj.val();
  if (val == "" || val == "x"){
    _obj.val("x");
    return;
  }
  var idx = val.indexOf(":");
  if (idx <= 0){
    alert("サイズが不正です。");
    return false;
  }
  var size = val.substring(0, idx);
  //if (size != 'M' && size != 'L' && size != '3s'  && size != '2s' && size != 's' && size != 'm' && size != 'l'){
  //  alert("サイズが不正です。(" + size + ")");
  //  return false;
  //}
  
  var portletId = val.substring(idx+1);
  
  if (size == 'M' || size == 'L' || size == 'FULL'){
    if ($("#main-frame-if").size() > 0){
      alert("メニュー機能表示枠は既に配置されているため、追加できません。\nこの位置に追加する場合には、先に既存のメニュー機能表示枠を削除してください。");
      _obj.val("x");
      return;
    }
  }

  var url = "";
  var wfId = "nwf_" + portletId + "_" + getPortletNo();
  var x = "";
  if (size == 'M' || size == 'L' || size == 'FULL'){
    url = portletId;
    wfId = "main-frame-if";
    x = x + "<div class='portlet portlet-" + size.toLowerCase() + "  portlet-break' id='main-frame'>";
    x = x + "  <div class='loading' id='main-frame-if-loading'></div>";
    x = x + "  <iframe name='portlet-body' id='main-frame-if' scrolling='no' frameborder='0' framespacing='0' border='0' marginwidth='0' marginheight='0'></iframe>";
    x = x + "</div>";
    
    var conf = wfConf[wfId];
    if (conf == null || typeof conf == 'undefined'){
      conf = {};
      wfConf[wfId] = conf;
    }
    conf.wfNm = "メニュー機能表示枠";
    conf.wfNmEng = "Menu function display frame";
    conf.icon = "icon/star_silver.png";
  } else {
    url = getAjaxGetUrl(wfId, "");
    x = x + "<div class='portlet portlet-" + size;
    if (_obj.parent().parent().hasClass("portlet-break")){
      x = x + "  portlet-break'";
    } else {
      x = x + "'";
    }
    x = x + " id='" + wfId + "-box'>";
    x = x + "  <div class='loading' id='" + wfId + "-loading'></div>";
    x = x + "  <div class='portlet-box' id='" + wfId + "'></div>";
    x = x + "</div>";
  }
  
  _obj.parent().parent().before(x);
  addPortletSelecter(wfId + "-box", $("#" + wfId).parent(), true);
  loadPortletGet(wfId, {
    'url': (url),
    'complete': function(){
      var conf = wfConf[wfId];
      if (conf == null || typeof conf == 'undefined'){
        conf = {};
        wfConf[wfId] = conf;
      }
      conf.wfNm = getPortletTitle(wfId, 'ja');
      conf.wfNmEng = getPortletTitle(wfId, 'en');
      conf.icon = getPortletTitle(wfId, 'icon');
    }
  });
  _obj.val("x");
}
function deletePortlet(obj){
  var _obj = $(obj);
  if (!confirm("削除してもよろしいですか？")){
    return false;
  }
  
  var flg = false;
  var id = "";
  _obj.parents().each(function (i) {
    var _this = $(this);
    if (_this.hasClass("portlet")){
      id = _this.find(".portlet-box").attr("id");
      _this.remove();
      flg = true;
    }
  });
  if (!flg) alert("削除失敗");
  
  if (wfSetting[id] != null && typeof wfSetting[id] != 'undefined'){
    delete wfSetting[id];
  }
  if (wfConf[id] != null && typeof wfConf[id] != 'undefined'){
    delete wfConf[id];
  }
  
  resizePortal(true);
  
  return false;
}
function breakPortlet(obj){
  var _obj = $(obj);
  _obj.parents().each(function (i) {
    var _this = $(this);
    if (_this.hasClass("portlet")){
      if (_this.hasClass("portlet-break")){
        _this.removeClass("portlet-break");
        $("img:first", obj).attr("src", staticImg.portletNoBreak);
      } else {
        _this.addClass("portlet-break");
        $("img:first", obj).attr("src", staticImg.portletBreak);
      }
    }
  });
  resizePortal(true);
  return false;
}
function movePortlet(obj, upFlg){
  var _obj = $(obj);
  _obj.parents().each(function (i) {
    var _this = $(this);
    if (_this.hasClass("portlet")){
      if (upFlg){
        _this.insertBefore(_this.prev());
      } else {
        if (!_this.next().hasClass("portletDesign-dummy")){
          _this.insertAfter(_this.next());
        }
      }
    }
  });
  return false;
}

var currentDlgId = "";
function settingPortlet(id){
  currentDlgId = id;
  
  var _obj = $('#' + id);
  
  var commonFlg = false;
  
  var settings = wfSetting[id];
  if (typeof settings == 'undefined'){
    commonFlg = true;
    settings = {};
    wfSetting[id] = settings;
    setPortalSettingPortlet("ptld", tabSetting);
  } else {
    setPortalSettingPortlet("ptld", settings);
  }
  
  var conf = wfConf[id];
  if (conf == null || typeof conf == 'undefined'){
    conf = {};
    wfConf[id] = conf;
  }
  var title = conf.wfNm;
  if (title == null || typeof title == 'undefined' || title == ''){
    title = getPortletTitle(id, 'ja');
  }
  var titleEng = conf.wfNmEng;
  if (titleEng == null || typeof titleEng == 'undefined' || titleEng == ''){
    titleEng = getPortletTitle(id, 'en');
  }
  
  if (commonFlg){
    $("#portlet-setting-color-type0").attr("checked", "checked");
    $("#portal-setting-color-ptld").hide();
  } else {
    $("#portlet-setting-color-type1").attr("checked", "checked");
    $("#portal-setting-color-ptld").show();
  }
  
  if (_obj.find(".no-title").size() > 0){
    $("#portlet-setting-title-acc").hide();
    $("#portal-setting-ptld-title").hide();
  } else {
    if (id == "main-frame" || id == "main-frame-if" || id == "main-frame-div"){
      $("#portlet-setting-title-acc").hide();
    } else {
      $("#portlet-setting-title-acc").show();
      $("#portlet-setting-title-ja").val(title);
      $("#portlet-setting-title-ja").unbind();
      $("#portlet-setting-title-en").val(titleEng);
      $("#portlet-setting-title-en").unbind();
      if (portalConf.lang == 'ja'){
        $("#portlet-setting-title-ja").change(function(){
          _obj.find(".portlet-title > span").text($(this).val());
        });
      } else {
        $("#portlet-setting-title-en").change(function(){
          _obj.find(".portlet-title > span").text($(this).val());
        });
      }
    }
    
    $("#portal-setting-ptld-title").show();
  }
  
  $(".ptld-style").unbind();

  $(".ptld-color-style").each(function(){
    $(this).campusColorPicker('update');
  });
  
  changeStyleDlg(id);
  
  $('.ptld-style').change(function(){
    if ($(this).hasClass("ptld-color-style")){
      $(this).campusColorPicker('update'); // select color
    }
    changeStyleDlg(id);
  });
  
  $("#portlet-setting-dlg").find("input[name=portlet-setting-color-type]").unbind();
  $("#portlet-setting-dlg").find("input[name=portlet-setting-color-type]").change(function(){
    if ($("#portlet-setting-color-type1").attr("checked") == "checked"){
      $("#portal-setting-color-ptld").slideDown("fast");
    } else {
      $("#portal-setting-color-ptld").slideUp("fast");
    }
  });
  
  $("#portlet-setting-dlg .portal-setting-dlg-acc").find(".title").unbind();
  $("#portlet-setting-dlg .portal-setting-dlg-acc").find(".title").click(function(){
    var _this = $(this);
    _this.toggleClass("open");
    _this.parent().find(".portal-setting-box").toggle("blind", "", "fast");
    if (_this.hasClass("open")){
      _this.find("img").attr("src", staticImg.toggleOpen);
    } else {
      _this.find("img").attr("src", staticImg.toggleClose);
    }
  });
  
  $("#portlet-setting-dlg").dialog({
    autoOpen: true,
    modal: true,
    width: 550,
    height: "auto",
    minWidth: 550,
    title: (title + 'の設定'),
    buttons: {
      "OK": function(event) {
        var title = $("#portlet-setting-title-ja").val();
        if (portalConf.lang != 'ja'){
          title = $("#portlet-setting-title-en").val();
        }
        $('#' + id).find(".portlet-title > span").text(title);
        
        var conf = wfConf[id];
        if (conf == null || typeof conf == 'undefined'){
          conf = {};
          wfConf[id] = conf;
        }
        conf.wfNm = $("#portlet-setting-title-ja").val();
        conf.wfNmEng = $("#portlet-setting-title-en").val();
        
        $(this).dialog("close");
      }
    },
    open: function() {
      $(this).parent().parent().find(".ui-dialog").next(".ui-widget-overlay").css("background", "transparent");
      $(this).parent().find(".ui-dialog-titlebar-close").hide();
    },
    close: function() {
      if ($("#portlet-setting-color-type0").attr("checked") == "checked"){
        // 共通の場合、個別設定を削除して戻す
        delete wfSetting[id];
        changeStyleSetting(id, false);
      }
    }
  });
  
  return false;
}

function getPortletTitle(id, mode){
  var title = "";
  if (id == 'main-frame' || id == 'main-frame-if'){
    title = $("#main-frame-if").contents().find(".portlet-title > span").text();
  } else {
    //title = $('#' + id).find(".portlet-title > span").text();
    if (mode == 'ja'){
      title = $('#' + id).find("#wfNm").val();
    } else if (mode == 'en'){
      title = $('#' + id).find("#wfNmEng").val();
    } else if (mode == 'icon'){
      title = $('#' + id).find("#wfIcon").val();
    }
  }
  return title;
}

/* ポータル設定タブ切り替え */
var currentSettingTabId = "settingTab1";
function changeSettingTab(tabId){
  currentSettingTabId = tabId;
  
  $("#portal-setting-area .portal-setting-box").each(function(){
     $(this).hide();
  });
  
  $(".portal-setting-tab").each(function(){
    var _this = $(this);
    var thisid= _this.attr("id");
    
    _this.removeClass("portal-setting-tab-sel");
    
    if (thisid == tabId){
      _this.addClass("portal-setting-tab-sel");
    }
    
    var msg = $("#portal-setting-tab-box .msg");
    msg.empty();
    
    switch (tabId){
    case 'settingTabDesign':
      msg.text($("#portal-setting-tab-box .msg-design-hide").text());
      
      $("#portal-setting-colorgrp-box").show();
      $("#portal-setting-color").show();
      break;
    case 'settingTabAuth':
      msg.text($("#portal-setting-tab-box .msg-auth-hide").text());
      $("#portal-setting-colorgrp-box").hide();
      $("#portal-setting-auth").show();
      break;
    case 'settingTabTab':
      msg.text($("#portal-setting-tab-box .msg-tabs-hide").text());
      $("#portal-setting-colorgrp-box").hide();
      $("#portal-setting-tabs").show();
      break;
    case 'settingTabMenu':
      msg.text($("#portal-setting-tab-box .msg-menus-hide").text());
      $("#portal-setting-colorgrp-box").hide();
      $("#portal-setting-menus").show();
      break;
    }
    
  });
  
  $("#portal-setting-area-bg").height($("#portal-setting-area").outerHeight());
  
  return false;
}
function changeDesignGroup(groupId){
  $("#portal-setting-colorgrp-box .portal-setting-group").removeClass("portal-setting-group-sel");
  $("#" + groupId).addClass("portal-setting-group-sel");
  
  switch (groupId){
    case 'designGroupAll':
      $("#portal-setting-color .portal-setting-inner").show();
      break;
    case 'designGroupBodyTab':
      $("#portal-setting-color .portal-setting-inner").hide();
      $("#portal-setting-color-body").show();
      $("#portal-setting-color-tab").show();
      break;
    case 'designGroupColPortlet':
      $("#portal-setting-color .portal-setting-inner").hide();
      $("#portal-setting-color-col").show();
      $("#portal-setting-color-portlet").show();
      break;
    case 'designGroupBody':
      $("#portal-setting-color .portal-setting-inner").hide();
      $("#portal-setting-color-body").show();
      break;
    case 'designGroupTab':
      $("#portal-setting-color .portal-setting-inner").hide();
      $("#portal-setting-color-tab").show();
      break;
    case 'designGroupCol':
      $("#portal-setting-color .portal-setting-inner").hide();
      $("#portal-setting-color-col").show();
      break;
    case 'designGroupPortlet':
      $("#portal-setting-color .portal-setting-inner").hide();
      $("#portal-setting-color-portlet").show();
      break;
  }
  $("#portal-setting-color .portal-setting-inner:visible").each(function(){
    if ($(this).find(".portal-setting-item:visible").size() == 0){
      $(this).hide();
    }
  });
  
  $("#portal-setting-tab-btns").show();
  $("#portal-setting-area-bg").height($("#portal-setting-area").outerHeight());
  return false;
}

/* チェックボックスの値セット */
function setCheck(targetId, value){
  if (value == "checked"){
    $(targetId).attr("checked", "checked");
  } else { //if (typeof $(targetId).attr("checked") != 'undefined'){
    $(targetId).removeAttr("checked");
  }
}

function portalSave(confDlg){
  if (confDlg){
    if (!confirm("設定を保存してもよろしいですか？")){
      return false;
    }
  }
  var cf = {};
  cf["portalSaveCd"] = "1";
  
  var tabno = 0;
  $("#portal-setting-tabtable").find("tbody > tr").each(function(){
    var id = $(this).attr("id");
    id = id.substring(cstrPortalSettingIdBaseTab.length);
    var tab = tabs[id];
    if (tab != null && typeof tab != 'undefined'){
      var name = "tabSettings[" + (tabno++) + "].";
      cf[name + "tabId"] = id;
      cf[name + "sortNo"] = tabno;
      for (var m in tab) {
        if (m == 'id'){
        } else if (m == 'icon'){
          cf[name + m] = cutUrl(tab[m], staticImg.base);
        } else {
          cf[name + m] = tab[m];
        }
      }
    }
  });
  
  for (var i in tabSetting) {
    cf[i] = tabSetting[i];
  }
  
  var menuno = 0;
  for (var i in menus) {
    var menu = menus[i];
    if (menu != null && typeof menu != 'undefined'){
      for (no = 0; no < menu.length; no++){
        var name = "tabMenuSettings[" + (menuno++) + "].";
        cf[name + "tabId"] = i;
        cf[name + "sortNo"] = no;
        var item = menu[no];
        for (var m in item) {
          if (m == 'icon'){
            cf[name + m] = cutUrl(item[m], staticImg.base);
          } else {
            cf[name + m] = item[m];
          }
        }
      }
    }
  }
  
  var no = 0;
  var no2 = 0;
  $(".portlet").each(function(){
    var _this = $(this);
    var id = _this.find(".portlet-box").attr("id");
    if (_this.attr("id") == "main-frame"){
      id = "main-frame";
    }
    
    var name = "tabLayoutSettings[" + no + "].";
    
    var conf = wfConf[id];
    if (conf == null || typeof conf == 'undefined'){
      conf = {};
      wfConf[id] = conf;
    }
    
    cf[name + "tabId"] = currentTabId;
    cf[name + "wfId"] = id;
    cf[name + "areaId"] = _this.closest(".portalarea").attr("id");
    cf[name + "wfNm"] = conf.wfNm;
    cf[name + "wfNmEng"] = conf.wfNmEng;
    cf[name + "icon"] = cutUrl(conf.icon, staticImg.base);
    if (_this.attr("id") == "main-frame"){
      if (_this.hasClass("portlet-l")){
        cf[name + "mainFrameFlg"] = "2";
      } else {
        cf[name + "mainFrameFlg"] = "1";
      }
    } else {
      cf[name + "mainFrameFlg"] = "0";
    }
    if (_this.hasClass("portlet-break")){
      cf[name + "breakFlg"] = "1";
    } else {
      cf[name + "breakFlg"] = "0";
    }
    cf[name + "sortNo"] = no;
    
    var setting = wfSetting[id];
    if (setting != null || typeof setting != 'undefined'){
      name = "wfSettings[" + no2 + "].";
      
      cf[name + "wfId"] = id;
      
      for (var i in setting) {
        cf[name + i] = setting[i];
      }
      
      no2++;
    }
    
    no++;
  });
  
  $("#nwf_PTW0000001_99999999999999").hide().empty();
  $("#portal-setting-save-dlg").dialog({
    autoOpen: true,
    modal: true,
    width: 400,
    height: 350,
    title: ('ポータル設定の保存'),
    open: function() {
      $(this).parent().find(".ui-dialog-titlebar-close").hide();
      
      loadPortletPost('nwf_PTW0000001_99999999999999', 'portal-setting-form', {
        'customHidden': (cf),
        'complete': function(){
        }
      });
    }
  });
}
function portalSaveEnd(){
  $('#portal-setting-save-dlg').dialog('close');
  
  if ($('#portal-setting-save-dlg').find("#RESULT-OK").size() > 0){
    // OK to reload
    reloadPortal();
  } else {
    $("#nwf_PTW0000001_99999999999999").hide().empty();
  }
}

function portalDelete(confDlg){
  if (confDlg){
    if (!confirm("設定を削除してもよろしいですか？")){
      return false;
    }
  }
  var cf = {};
  cf.wfId = "nwf_PTW0000001_99999999999999";
  cf.event = "doDelete";
  cf.checkSrcKey = $("#portal-setting-form #checkSrcKey").val();
  
  $("#nwf_PTW0000001_99999999999999").hide().empty();
  $("#portal-setting-save-dlg").dialog({
    autoOpen: true,
    modal: true,
    width: 400,
    height: 350,
    title: ('ポータル設定の削除'),
    open: function() {
      $(this).parent().find(".ui-dialog-titlebar-close").hide();
      loadPortletPost('nwf_PTW0000001_99999999999999', null, {
        'customHidden': (cf)
      });
    }
  });
}

function iconSelectDialog(callback){
    var wh = Math.ceil($(window).height() / 3 * 2);
    
    $("#portal-setting-icons-dlg-box").empty();
    $("#portal-setting-icons-dlg").dialog({
      autoOpen: true,
      modal: true,
      resizable: false,
      minWidth: 600,
      minHeight: 300,
      height: (wh),
      maxHeight: (wh),
      title: ('アイコン選択'),
      buttons: {
        "OK": function(event) {
          var icon = "";
          $("#portal-setting-icons-dlg").find("input:checked").each(function(){
            var li = $(this).parent();
            icon = li.find("#icon").val();
          });
          
          callback(icon);
          
          $(this).dialog("close");
        },
        "キャンセル": function(event) {
          $(this).dialog("close");
        }
      },
      open: function() {
        $(this).parent().parent().find(".ui-dialog").next(".ui-widget-overlay").css("background", "");
        $(this).parent().find(".ui-dialog-titlebar-close").hide();
        
        var cf = {};
        cf.wfId = "nwf_PTW0000001_99999999999999";
        cf.event = "doListIcons";
        
        loadPortletPost('portal-setting-icons-dlg-box', null, {
          'customHidden': (cf),
          'complete': function(){
            $("#portal-setting-icons-dlg-box").find("input[type=radio]").unbind().click(function(){
              if ($(this).attr("checked") == "checked"){
                $(this).removeAttr("checked");
              } else {
                $(this).attr("checked", "checked");
              }
            });
            $("#portal-setting-icons-dlg-box").find("li").unbind()
            .mouseover(function(){
              $(this).addClass("hover");
            }).mouseout(function(){
              $(this).removeClass("hover");
            }).click(function(){
              if ($(this).find("input[type=radio]").attr("checked") == "checked"){
                $(this).find("input[type=radio]").removeAttr("checked");
                $(this).removeClass("select");
              } else {
                $(this).find("input[type=radio]").attr("checked", "checked");
                $("#portal-setting-icons-dlg-box").find("li").removeClass("select");
                $(this).addClass("select");
              }
            });
            
            $("#portal-setting-icons-dlg-box .portal-setting-dlg-acc").find(".title").unbind().click(function(){
              $(this).toggleClass("open");
              $(this).parent().find(".portal-setting-box").toggle("blind", "", "fast");
              if ($(this).hasClass("open")){
                $(this).find("img").attr("src", staticImg.toggleOpen);
              } else {
                $(this).find("img").attr("src", staticImg.toggleClose);
              }
            });
          }
        });
      }
    });
    return false;
}

function portletParamDialog(wfId){
    if (portalConf.runMode == 'design'){
      alert("ポータル設定中は機能設定を行えません。");
      return false;
    }
    
    var wh = Math.ceil($(window).height() / 3 * 2);
    
    var title = getPortletTitle(wfId, portalConf.lang);
    
    var mw = 600;
    var mh = 300;
    if (portalConf.isDeviceLocaleSmartphone){
      mw = Math.floor(defWindowWidth * 0.75);
    }
    
    $("#portal-setting-param-dlg-box").empty();
    $("#portlet-setting-param-dlg").dialog({
      autoOpen: true,
      modal: true,
      resizable: true,
      minWidth: (mw),
      minHeight: (mh),
      height: (wh),
      title: (title + 'の機能設定（個人設定）'),
      buttons: {
        "OK": function(event) {
          var id = $("#portal-setting-param-dlg-box").find("form:first").attr("id");
          $('#portlet-setting-param-dlg').parent().find(".ui-dialog-buttonpane").hide();
          
          loadPortletPost('portal-setting-param-dlg-box', id, {
            'inCallback': function(){
              if ($('#portlet-setting-param-dlg').find("#RESULT-OK").size() == 0){
                $('#portlet-setting-param-dlg').parent().find(".ui-dialog-buttonpane").show();
              }
            }
          });
          
        },
        "キャンセル": function(event) {
          $(this).dialog("close");
        }
      },
      open: function() {
        $(this).parent().parent().find(".ui-dialog").next(".ui-widget-overlay").css("background", "");
        $(this).parent().find(".ui-dialog-titlebar-close").hide();
        
        var cf = {};
        cf.wfId = "nwf_PTW0000001_99999999999999";
        cf.event = "doParamSetting";
        cf.wf = wfId;
        
        loadPortletPost('portal-setting-param-dlg-box', null, {
          'customHidden': (cf),
          'complete': function(){
            $("#portal-setting-param-dlg-box .portal-setting-dlg-acc").find(".title").unbind().click(function(){
              $(this).toggleClass("open");
              $(this).parent().find(".portal-setting-box").toggle("blind", "", "fast");
              if ($(this).hasClass("open")){
                $(this).find("img").attr("src", staticImg.toggleOpen);
              } else {
                $(this).find("img").attr("src", staticImg.toggleClose);
              }
            });
          }
        });
      }
    });
    return false;
}
function portletSettingSaveEnd(){
  $('#portlet-setting-param-dlg').dialog('close');
  // OK to reload
  reloadPortal();
}

function initPortalSetting(){
  $("#portal-setting-scroll-lock").click(function(){
    if (typeof $(this).attr("checked") != 'undefined'){
      $("#portal-setting-area").css({position: "fixed", top: "0px", left: "0px"});
      $("#portal-setting-area-bg").show();
      $("#portal-setting-area-bg").height($("#portal-setting-area").outerHeight());
    } else {
      $("#portal-setting-area").css({position: "", top: "", left: ""});
      $("#portal-setting-area-bg").hide();
    }
  });
  
  $("#portal-setting-tabs-savebtn").click(function(){
    portalSave(true);
  });
  
  $("#portal-setting-tabs-deletebtn").click(function(){
    portalDelete(true);
  });
  
  $("#portal-setting-tabs-previewbtn").click(function(){
    portalDesign();
  });
  
  $("#portal-setting-tabs-cancelbtn").click(function(){
    if (confirm("キャンセルすると保存していない設定は失われます。\nキャンセルしてもよろしいですか？")){
      reloadPortal();
    }
  });
  
  $("#portal-setting-change-page").change(function(){
    reloadPortal(currentTabId, $(this).val());
  });
  
  $("#portal-setting-template-select").change(function(){
    $("#portal-setting-form #selectTemplateNm").val($("#portal-setting-template-select").val());
    $("#portal-setting-temp-dlg-box").empty();
    $("#portal-setting-temp-dlg").dialog({
      autoOpen: true,
      modal: true,
      width: 400,
      height: 200,
      title: ('テンプレート選択'),
      open: function() {
          $(this).parent().find(".ui-dialog-titlebar-close").hide();
          var cf = {};
          cf.wfId = "nwf_PTW0000001_99999999999999";
          cf.event = "doSelectTemplate";
          
          loadPortletPost('portal-setting-temp-dlg-box', 'portal-setting-form', {
            'customHidden': (cf),
            'complete': function(){
              if ($('#portal-setting-temp-dlg-box').find("#RESULT-OK").size() > 0){
                reloadPortal('');
                $(this).dialog("close");
              }
            }
          });
      }
    });
    return false;
  });
  
  $("#portal-setting-template-btn").click(function(){
    var wh = Math.ceil($(window).height() / 3 * 2);
    $("#portal-setting-temp-dlg-box").empty();
    $("#portal-setting-temp-dlg").dialog({
      autoOpen: true,
      modal: true,
      resizable: false,
      minWidth: 700,
      minHeight: 400,
      height: (wh),
      maxHeight: (wh),
      title: ('ポータル設定一覧'),
      buttons: {
        "OK": function(event) {
          if ($("#portal-setting-temp-dlg").find("input:checked").size() == 0){
            alert("テンプレート設定または個人設定を選択してください。");
            return;
          }
          
          var cf = {};
          cf.wfId = "nwf_PTW0000001_99999999999999";
          cf.event = "doChangeTemplate";
          
          $("#portal-setting-temp-dlg").find("input:checked").each(function(){
            var tr = $(this).parent().parent();
            cf.authCd = tr.find("#authCd").val();
            cf.groupCd = tr.find("#groupCd").val();
            cf.userNm = tr.find("#userNm").val();
            cf.templateNm = tr.find("#templateNm").val();
          });
          
          $('#portlet-setting-temp-dlg').parent().find(".ui-dialog-buttonpane").hide();
          
          loadPortletPost('portal-setting-temp-dlg-box', null, {
            'customHidden': (cf),
            'complete': function(){
              if ($('#portal-setting-temp-dlg-box').find("#RESULT-OK").size() > 0){
                reloadPortal('');
                $(this).dialog("close");
              }
            }
          });
          
        },
        "キャンセル": function(event) {
          $(this).dialog("close");
        }
      },
      open: function() {
        $(this).parent().parent().find(".ui-dialog").next(".ui-widget-overlay").css("background", "");
        $(this).parent().find(".ui-dialog-titlebar-close").hide();
        
        var cf = {};
        cf.wfId = "nwf_PTW0000001_99999999999999";
        cf.event = "doListTemplate";
        
        loadPortletPost('portal-setting-temp-dlg-box', null, {
          'customHidden': (cf),
          'complete': function(){
            $("#portal-setting-temp-dlg-box").find("input[type=radio]").unbind().click(function(){
              if ($(this).attr("checked") == "checked"){
                $(this).removeAttr("checked");
              } else {
                $(this).attr("checked", "checked");
              }
            });
            $("#portal-setting-temp-dlg-box").find("tr").unbind()
            .mouseover(function(){
              $(this).addClass("hover");
            }).mouseout(function(){
              $(this).removeClass("hover");
            }).click(function(){
              if ($(this).find("input[type=radio]").attr("checked") == "checked"){
                $(this).find("input[type=radio]").removeAttr("checked");
                $(this).removeClass("select");
              } else {
                $(this).find("input[type=radio]").attr("checked", "checked");
                $("#portal-setting-temp-dlg-box").find("tr").removeClass("select");
                $(this).addClass("select");
              }
            });
            
            $("#portal-setting-temp-dlg-box .portal-setting-dlg-acc").find(".title").unbind().click(function(){
              $(this).toggleClass("open");
              $(this).parent().find(".portal-setting-box").toggle("blind", "", "fast");
              if ($(this).hasClass("open")){
                $(this).find("img").attr("src", staticImg.toggleOpen);
              } else {
                $(this).find("img").attr("src", staticImg.toggleClose);
              }
            });
            
            var x = '<div class="footer">'
                x = x + '<a href="javascript:void(0)" onclick="return campusVScrollId(' + "'#portal-setting-temp-dlg', '#portal-setting-template-list .title', {checkDesign: false}" + ');">テンプレート設定一覧へ</a>'
                x = x + '　<a href="javascript:void(0)" onclick="return campusVScrollId(' + "'#portal-setting-temp-dlg', '#portal-setting-template-user .title', {checkDesign: false}" + ');">個人設定一覧へ</a>'
                x = x + '</div>';
            
            $("#portal-setting-temp-dlg-box").closest(".ui-dialog").find(".ui-dialog-buttonpane").append(x);
            
          }
        });
      }
    });
    return false;
  });
  
  $("#portal-setting-template-reset-btn").click(function(){
    $("#portal-setting-temp-dlg-box").empty();
    $("#portal-setting-temp-dlg").dialog({
      autoOpen: true,
      modal: true,
      width: 400,
      height: 200,
      title: ('選択解除'),
      open: function() {
          $(this).parent().find(".ui-dialog-titlebar-close").hide();
          $(this).parent().find(".ui-dialog-buttonpane").hide();
          var cf = {};
          cf.wfId = "nwf_PTW0000001_99999999999999";
          cf.event = "doResetTemplate";
          
          loadPortletPost('portal-setting-temp-dlg-box', null, {
            'customHidden': (cf),
            'complete': function(){
              if ($('#portal-setting-temp-dlg-box').find("#RESULT-OK").size() > 0){
                reloadPortal();
                $(this).dialog("close");
              }
            }
          });
      }
    });
    return false;
  });
  
  $("#portal-setting-tab .portal-setting-tab").click(function(){
    changeSettingTab($(this).attr("id"));
  });
  $("#portal-setting-tab-box .portal-setting-group").click(function(){
    changeDesignGroup($(this).attr("id"));
  });
  
  $("#portal-setting-tabcustom-btn").click(function(){
    if (confirm("このタブをカスタマイズしますか？")){
      $("#portal-setting-form input[name=tabId]").val(currentTabId);
      portalSave(false);
    }
  });
  
  $("#portal-setting-tabcommon-btn").click(function(){
    if (confirm("現在、このタブはカスタマイズされています。\nカスタマイズを削除して、共通設定に戻しますか？")){
      var cf = {};
      cf.wfId = "nwf_PTW0000001_99999999999999";
      cf.event = "doTabCustomDelete";
      cf.checkSrcKey = $("#portal-setting-form #checkSrcKey").val();
      
      $("#nwf_PTW0000001_99999999999999").hide().empty();
      $("#portal-setting-save-dlg").dialog({
        autoOpen: true,
        modal: true,
        width: 400,
        height: 350,
        title: ('共通設定に戻す'),
        open: function() {
          $(this).parent().find(".ui-dialog-titlebar-close").hide();
          loadPortletPost('nwf_PTW0000001_99999999999999', null, {
            'customHidden': (cf),
            'complete': function(){
                if ($('#portal-setting-save-dlg').find("#RESULT-OK").size() > 0){
                  reloadPortal();
                  $(this).dialog("close");
                }
            }
          });
        }
      });
    }
  });
  
  $("#portal-setting-tabs-size").val(tabSetting.tabSize);
  setCheck("#portal-setting-tabs-icon-visible", tabSetting.tabIconVisible);
  setCheck("#portal-setting-tabs-text-visible", tabSetting.tabTextVisible);
  setCheck("#portal-setting-tabs-visible", tabSetting.tabVisible);
  setCheck("#portal-setting-tabmenus-visible", tabSetting.menuVisible);
  
  $("#portal-setting-tabs-size").change(function(){
    tabSetting.tabSize = $(this).val();
    resizePortalTabs();
  });
  
  $("#portal-setting-tabs-icon-visible").click(function(){
    tabSetting.tabIconVisible = $(this).attr("checked");
    resizePortalTabs();
  });
  
  $("#portal-setting-tabs-text-visible").click(function(){
    tabSetting.tabTextVisible = $(this).attr("checked");
    resizePortalTabs();
  });
  
  $("#portal-setting-tabs-visible").click(function(){
    tabSetting.tabVisible = $(this).attr("checked");
    if (tabSetting.tabVisible == 'checked'){
      $("#tab-area").slideDown("normal");
    } else {
      $("#tab-area").slideUp("normal");
      //tabSetting.menuVisible = "";
    }
    resizePortalTabs();
  });
  
  $("#portal-setting-tabmenus-visible").click(function(){
    tabSetting.menuVisible = $(this).attr("checked");
    if (tabSetting.menuVisible == 'checked'){
      $("#tabmenu-area").slideDown("normal", function(){
        $("#tabmenu-span").css("margin-top", "-1px");  // to Firefox
      });
    } else {
      $("#tabmenu-span").css("margin-top", "0px");  // to Firefox
      $("#tabmenu-area").slideUp("normal");
    }
  });
  
  $(".portal-auth-check").click(function(){
    tabSetting[$(this).attr("name")] = $(this).attr("checked");
  });
  
  //setPortalSetting();
  
  // ColorPicker
  var colorOptions = { colors: color_palette, columns: 8, width: 12, height: 12 };
  $(".portal-color-style").campusColorPicker(colorOptions);
  $(".ptld-color-style").campusColorPicker(colorOptions);
  
  
  $('.portal-style').unbind().change(function(){
    if ($(this).hasClass("portal-color-style")){
      $(this).campusColorPicker('update'); // select color
    }
    changeStyleSetting("", true);
    changeStyleSetting("main-frame", true);
  });
  
  // Tabs
  // add
  $("#portal-setting-tabs-addbtn").click(function(){
    tabNoSeq++;
    var row = addPortalSettingTabRow("tab" + tabNoSeq, tabNoSeq, true);
    if (row == null){
      return false;
    }
    var id = row.attr("id");
    row.trigger("click");
    $('#'+ id + "-text-ja:visible").focus();
    $('#'+ id + "-text-en:visible").focus();
    return false;
  });
  // del
  $("#portal-setting-tabs-delbtn").click(function(){
    var row = $("#portal-setting-tabtable .select");
    if (row.size() != 1){
      alert("行が選択されていません");
      return false;
    }
    var id = row.attr("id");
    if (tabCount <= 1){
      alert("タブは最低1個必要なため、これ以上削除できません。");
      return false;
    }
    
    if (!confirm("タブを削除すると、保存時にそのタブの設定は全て削除されて元に戻せません。\n削除してもよろしいですか？")){
      return false;
    }
    
    id = id.substring(cstrPortalSettingIdBaseTab.length);
    deleteTabs(id);
    var prev = row.prev();
    if (prev.size() == 0){
      prev = $("#portal-setting-tabtable").find("tbody").find("tr:first");
    }
    row.unbind().remove();
    prev.trigger("click");
    
    // menu tabs
    $("#portal-setting-menu-tabs option[value=" + id + "]").remove();
    
    return false;
  });
  // move be
  $("#portal-setting-tabs-upbtn").click(function(){
    var row = $("#portal-setting-tabtable .select");
    if (row.size() != 1){
      alert("行が選択されていません");
      return false;
    }
    row.prev().before(row);
    row.trigger("click");
    row.find("input:checkbox").focus();
    
    var id = row.attr("id");
    id = id.substring(cstrPortalSettingIdBaseTab.length);
    var tab = $('#tab-'+id);
    tab.prev(".tabcell").before(tab);
    
    // menu tabs
    $("#portal-setting-menu-tabs option[value=" + id + "]").each(function(){
        $(this).insertBefore($(this).prev());
    });
    return false;
  });
  // move af
  $("#portal-setting-tabs-downbtn").click(function(){
    var row = $("#portal-setting-tabtable .select");
    if (row.size() != 1){
      alert("行が選択されていません");
      return false;
    }
    row.next().after(row);
    row.trigger("click");
    row.find("input:checkbox").focus();
    
    var id = row.attr("id");
    id = id.substring(cstrPortalSettingIdBaseTab.length);
    var tab = $('#tab-'+id);
    tab.next(".tabcell").after(tab);
    
    // menu tabs
    $("#portal-setting-menu-tabs option[value=" + id + "]").each(function(){
        $(this).insertAfter($(this).next());
    });
    
    return false;
  });
  
  tabNoSeq = 0;
  $.each(tabs, function(i, val) {
    addPortalSettingTabRow(i, tabNoSeq++, false);
  });
  
  // Menus
  // tab change
  $("#portal-setting-menu-tabs").change(function(){
      var tabId = $("#portal-setting-menu-tabs").val();
      menuNoSeq = 0;
      $("#portal-setting-menutable").find("tbody").unbind().empty();
      for (i = 0; i < menus[tabId].length; i++){
          addPortalSettingMenuRow(i, false, tabId);
      }
  });
  
  // add
  $("#portal-setting-menus-funcaddbtn").click(function(){
    var wh = Math.ceil($(window).height() / 3 * 2);
    $("#portal-setting-func-dlg-box").empty();
    $("#portal-setting-func-dlg").dialog({
      autoOpen: true,
      modal: true,
      resizable: false,
      minWidth: 800,
      minHeight: 300,
      height: (wh),
      maxHeight: (wh),
      title: ('機能追加'),
      buttons: {
        "OK": function(event) {
          $("#portal-setting-func-dlg-box").find("input:checked").each(function(){
            var td = $(this).parent();
            var id = td.next().next().text();
            var nm = td.next().next().next().find("#nm").text();
            var eng = td.next().next().next().find("#eng").text();
            
            var tabId = $("#portal-setting-menu-tabs").val();
            var row = addPortalSettingMenuRow(-1, true, tabId);
            row.trigger("click");
            row.find("input:text").focus();
            
            var no = parseInt(row.find("input[type=hidden]:first").val());
            var wkEng = (eng == null || eng == '')? nm: eng;
            
            var menu = menus[tabId];
            menu[no].menuId = id;
            menu[no].menuKbnCd = "1";
            menu[no].dispFlg = "1";
            menu[no].icon = staticImg.sp;
            menu[no].folderNm = "";
            menu[no].folderNmEng = "";
            menu[no].folderOpenFlg = "0";
            menu[no].funcId = id;
            menu[no].funcNm = nm;
            menu[no].funcNmEng = eng;
            menu[no].menuNm = nm;
            menu[no].menuNmEng = wkEng;
            menu[no].url = "";
            menu[no].target = "main";
            menu[no].bookmarkFlg = "0";
            menu[no].authFlg = true;
            
            var rowid = row.attr("id");
            $("#" + rowid + "-id", row).val(id);
            $("#" + rowid + "-text-ja", row).val(nm);
            $("#" + rowid + "-text-en", row).val(wkEng);
            $(".funcnm", row).text(nm);
            $(".funcnmeng", row).text(eng);
            $("#" + rowid + "-url", row).val("");
            $("#" + rowid + "-text-ja:visible", row).focus();
            $("#" + rowid + "-text-en:visible", row).focus();
            
          });
          showMenu(currentTabId, false, portalConf.langDesign);
          
          $(this).dialog("close");
        },
        "キャンセル": function(event) {
          $(this).dialog("close");
        }
      },
      open: function() {
        $(this).parent().parent().find(".ui-dialog").next(".ui-widget-overlay").css("background", "");
        $(this).parent().find(".ui-dialog-titlebar-close").hide();
        
        var cf = {};
        cf.wfId = "nwf_PTW0000001_99999999999999";
        cf.event = "doListMenuFunc";
        
        loadPortletPost('portal-setting-func-dlg-box', null, {
          'customHidden': (cf),
          'complete': function(){
            var x = '<div class="footer">'
                x = x + '<a href="javascript:void(0)" onclick="return campusVScrollId(' + "'#portal-setting-func-dlg', '#portal-setting-func-mitoroku .title', {checkDesign: false}" + ');">未登録機能へ</a>'
                x = x + '　<a href="javascript:void(0)" onclick="return campusVScrollId(' + "'#portal-setting-func-dlg', '#portal-setting-func-all .title', {checkDesign: false}" + ');">全機能へ</a>'
                x = x + '</div>';
            
            $("#portal-setting-func-dlg-box").closest(".ui-dialog").find(".ui-dialog-buttonpane").append(x);
            
            $("#portal-setting-func-dlg-box").find("input[type=checkbox]").unbind().click(function(){
              if ($(this).attr("checked") == "checked"){
                $(this).removeAttr("checked");
              } else {
                $(this).attr("checked", "checked");
              }
            });
            $("#portal-setting-func-dlg-box").find("tr").unbind()
            .mouseover(function(){
              $(this).addClass("hover");
            }).mouseout(function(){
              $(this).removeClass("hover");
            }).click(function(){
              if ($(this).find("input[type=checkbox]").attr("checked") == "checked"){
                $(this).find("input[type=checkbox]").removeAttr("checked");
                $(this).removeClass("select");
              } else {
                $(this).find("input[type=checkbox]").attr("checked", "checked");
                $(this).addClass("select");
              }
            });
            
            $("#portal-setting-func-dlg-box .portal-setting-dlg-acc").find(".title").unbind();
            $("#portal-setting-func-dlg-box .portal-setting-dlg-acc").find(".title").click(function(){
              $(this).toggleClass("open");
              $(this).parent().find(".portal-setting-box").toggle("blind", "", "fast");
              if ($(this).hasClass("open")){
                $(this).find("img").attr("src", staticImg.toggleOpen);
              } else {
                $(this).find("img").attr("src", staticImg.toggleClose);
              }
            });
          }
        });
      }
    });
    return false;
  });
  // add
  $("#portal-setting-menus-urladdbtn").click(function(){
    var tabId = $("#portal-setting-menu-tabs").val();
    var row = addPortalSettingMenuRow(-1, true, tabId);
    var id = row.attr("id");
    row.trigger("click");
    $("#" + id + "-text-ja:visible", row).focus();
    $("#" + id + "-text-en:visible", row).focus();
    return false;
  });
  // del
  $("#portal-setting-menus-delbtn").click(function(){
    var row = $("#portal-setting-menutable .select");
    if (row.size() != 1){
      alert("行が選択されていません");
      return false;
    }
    var id = row.attr("id");
    var no = parseInt($("#" + id + "-no").val());
    if (no > -1){
      if (!confirm("削除してもよろしいですか？")){
        return false;
      }
      
      var tabId = $("#portal-setting-menu-tabs").val();
      var menu = menus[tabId];
      menu.splice(no, 1);
      
      var prev = row.prev();
      if (prev.size() == 0){
        prev = $("#portal-setting-menutable").find("tbody").find("tr:first");
      }
      row.unbind().remove();
      prev.trigger("click");
      row.find("input:checkbox").focus();
      
      if (no < menu.length){
        var i = 0;
        $("#portal-setting-menutable").find("tbody").find("tr").each(function(){
          $("#" + $(this).attr("id") + "-no").val(i++);
        });
      }
      
      showMenu(currentTabId, false, portalConf.langDesign);
    }
    
    return false;
  });
  // move be
  $("#portal-setting-menus-upbtn").click(function(){
    var row = $("#portal-setting-menutable .select");
    if (row.size() != 1){
      alert("行が選択されていません");
      return false;
    }
    
    var tabId = $("#portal-setting-menu-tabs").val();
    var menu = menus[tabId];
    var id = row.attr("id");
    var no = parseInt($("#" + id + "-no").val());
    if (no > 0){
      var chgid = row.prev().attr("id");
      row.prev().before(row);
      row.trigger("click");
      row.find("input:checkbox").focus();
      
      var cur = menu[no];
      menu[no] = menu[no - 1];
      $("#" + chgid + "-no").val(no);
      menu[no - 1] = cur;
      $("#" + id + "-no").val(no - 1);
      
      showMenu(currentTabId, false, portalConf.langDesign);
    }
    
    return false;
  });
  // move af
  $("#portal-setting-menus-downbtn").click(function(){
    var row = $("#portal-setting-menutable .select");
    if (row.size() != 1){
      alert("行が選択されていません");
      return false;
    }
    
    var tabId = $("#portal-setting-menu-tabs").val();
    var menu = menus[tabId];
    var id = row.attr("id");
    var no = parseInt($("#" + id + "-no").val());
    if (no < menu.length - 1){
      var chgid = row.next().attr("id");
      row.next().after(row);
      row.trigger("click");
      row.find("input:checkbox").focus();
      
      var cur = menu[no];
      menu[no] = menu[no + 1];
      $("#" + chgid + "-no").val(no);
      menu[no + 1] = cur;
      $("#" + id + "-no").val(no + 1);
      
      showMenu(currentTabId, false, portalConf.langDesign);
    }
    
    return false;
  });

  // menu
  menuNoSeq = 0;
  $("#portal-setting-menutable").find("tbody").unbind().empty();
  for (i = 0; i < menus[currentTabId].length; i++){
    addPortalSettingMenuRow(i, false, currentTabId);
  }
}

// tab id
var cstrPortalSettingIdBase = "portal-setting-";
var cstrPortalSettingIdBaseTab = cstrPortalSettingIdBase + "tab-";
var cstrPortalSettingIdBaseMenu = cstrPortalSettingIdBase + "menu-";

// tab lang
function tabLangChange(lang){
  if (lang == 'ja'){
    $("#portal-setting-tabtable").find(".en").hide();
    $("#portal-setting-tabtable").find(".ja").show();
    
    $("#portal-setting-tabtable").find("input:text[id$='-text-ja']").trigger("change");
  } else {
    $("#portal-setting-tabtable").find(".ja").hide();
    $("#portal-setting-tabtable").find(".en").show();
    
    $("#portal-setting-tabtable").find("input:text[id$='-text-en']").trigger("change");
  }
  $("#portal-setting-tabs").find("span[class^='tabLang']").toggle();
  return false;
}

// tab row
var tabNoSeq = 0;
function addPortalSettingTabRow(tabId, no, addFlg){
  if (addFlg){
    tabId = prompt("タブIDを入力してください。（半角英数字 10文字以内）", tabId);
    if (tabId != null && tabId != ""){
      if (tabId.match(/[^a-zA-Z0-9]/)){
        alert("半角英数字以外の文字が入力されているため、キャンセルします。");
        return null;
      } else if (tabId.length > 10){
        alert("10文字以上入力されているため、キャンセルします。");
        return null;
      } else if (typeof tabs[tabId] != 'undefined'){
        alert("タブIDが重複しているため、キャンセルします。");
        return null;
      }
    } else {
      return null;
    }
  }
  var id = cstrPortalSettingIdBaseTab + tabId;
  var name = "tabSettings[" + no + "].";
  var addImg = staticImg.sp;
  if (addFlg){
    addImg = staticImg.plus;
  }
  var tr = '<tr id="' + id + '">'
     + '<td><img id="' + id + '-add" src="' + addImg + '"><input type="hidden" id="' + id + '-sort" value=""></td>'
     + '<td><input type="checkbox" id="' + id + '-visible" value="1"></td>'
     + '<td><input type="text" id="' + id + '-id" size=11 readonly></td>'
     + '<td title="クリックでアイコン選択"><img id="' + id + '-iconimg" src="' + staticImg.sp + '"><input type="hidden" id="' + id + '-icon" value=""></td>'
     + '<td><input type="text" id="' + id + '-text-ja" size=24 class="ja"><input type="text" id="' + id + '-text-en" size=24 class="en display-hide"></td>'
     + '</tr>';
  $("#portal-setting-tabtable").find("tbody").append(tr);
  
  if (addFlg){
    addTabs(tabId);
  }

  if (tabs[tabId].dispFlg == "1"){
    setCheck('#' + id + '-visible', "checked");
  }
  $('#' + id + '-id').val(tabs[tabId].id);
  $('#' + id + '-iconimg').attr("src", tabs[tabId].icon);
  $('#' + id + '-icon').val(cutUrl(tabs[tabId].icon, staticImg.base));
  $('#' + id + '-text-ja').val(tabs[tabId].tabNm);
  $('#' + id + '-text-en').val(tabs[tabId].tabNmEng);
  
  //if (no == 1){
  //  $('#'+ id).addClass("select");
  //}
  
  // Events
  $('#'+ id).mouseover(function(){
    $(this).addClass("hover");
  }).mouseout(function(){
    $(this).removeClass("hover");
  }).click(function(){
    $("#portal-setting-tabtable").find("tr").removeClass("select");
    $(this).addClass("select");
    //$('#'+ id + "-visible").focus();
  });
  
  $('#' + id + '-visible').click(function(){
  if (typeof $(this).attr("checked") != 'undefined'){
    tabCountV = tabCountV + 1;
    resizePortal(true);
    tabs[tabId].dispFlg = "1";
    $('#tab-' + tabId).removeClass("tabcell-br");
    $('#tab-' + tabId + ' > p').text(tabs[tabId].tabNm);
    $('#tab-' + tabId + ' > img').attr("src", tabs[tabId].icon);
  } else {
    tabCountV = tabCountV - 1;
    resizePortal(true);
    tabs[tabId].dispFlg = "0";
    $('#tab-' + tabId).addClass("tabcell-br");
    $('#tab-' + tabId + ' > p').text("");
    $('#tab-' + tabId + ' > img').attr("src", staticImg.sp);
  }
  });
  $('#' + id + '-iconimg').click(function(){
    iconSelectDialog(function(icon){
      tabs[tabId].icon = icon;
      $('#' + id + '-iconimg').attr("src", tabs[tabId].icon);
      $('#' + id + '-icon').val(cutUrl(tabs[tabId].icon, staticImg.base));
    });
  });
  $('#' + id + '-text-ja').change(function(){
    tabs[tabId].tabNm = $(this).val();
    if (tabs[tabId].dispFlg == "1"){
      $('#tab-' + tabId + ' > p').text(tabs[tabId].tabNm);
      resizePortalTabs();
    }
  });
  $('#' + id + '-text-en').change(function(){
    tabs[tabId].tabNmEng = $(this).val();
    if (tabs[tabId].dispFlg == "1"){
      $('#tab-' + tabId + ' > p').text(tabs[tabId].tabNmEng);
      resizePortalTabs();
    }
  });
  
  // menu tabs
  $("#portal-setting-menu-tabs").append("<option value=" + tabId + ">" + tabs[tabId].tabNm);
  
  return $('#'+ id);
}



// menu
function tabMenuLangChange(lang){
  if (lang == 'ja'){
    $("#portal-setting-menutable").find(".en").hide();
    $("#portal-setting-menutable").find(".ja").show();
    
    $("#portal-setting-menutable").find("input:text[id$='-text-ja']").trigger("change");
  } else {
    $("#portal-setting-menutable").find(".ja").hide();
    $("#portal-setting-menutable").find(".en").show();
    
    $("#portal-setting-menutable").find("input:text[id$='-text-en']").trigger("change");
  }
  $("#portal-setting-menus").find("span[class^='tabMenuLang']").toggle();
  return false;
}

// menu row
var menuNoSeq = 0;
function addPortalSettingMenuRow(no, addFlg, tabId){
  var menu = menus[tabId];
  
  if (no == -1){
    no = menu.length;
  }
  
  var id = cstrPortalSettingIdBaseMenu + (menuNoSeq++);
  var addImg = staticImg.sp;
  if (addFlg){
    addImg = staticImg.plus;
    
    menu[no] = {};
    menu[no].menuId = "";
    menu[no].menuKbnCd = "2";
    menu[no].dispFlg = "1";
    menu[no].icon = staticImg.sp;
    menu[no].folderNm = "";
    menu[no].folderNmEng = "";
    menu[no].folderOpenFlg = "0";
    menu[no].menuNm = "新しいメニュー";
    menu[no].menuNmEng = "新しいメニュー";
    menu[no].url = "";
    menu[no].funcId = "";
    menu[no].funcNm = "";
    menu[no].funcNmEng = "";
    menu[no].target = "main";
    menu[no].bookmarkFlg = "0";
    menu[no].authFlg = true;
    
    if (portalConf.runMode == 'design'){
      showMenu(currentTabId, false, portalConf.langDesign);
    } else {
      showMenu(currentTabId, false, portalConf.lang);
    }
  }
  var tr = '<tr id="' + id + '">'
     + '<td><img id="' + id + '-add" src="' + addImg + '"><input type="hidden" id="' + id + '-no" value="' + no + '"><input type="hidden" id="' + id + '-type" value=""></td>'
     + '<td><input type="checkbox" id="' + id + '-visible" value="1"></td>'
     + '<td><input type="checkbox" id="' + id + '-bookmark" value="1"></td>'
     + '<td><input type="text" id="' + id + '-folder-ja" size=11 class="ja"><input type="text" id="' + id + '-folder-en" size=11 class="en display-hide">'
     + '／<input type="checkbox" id="' + id + '-folder-open" value="1"></td>'
     + '<td><input type="text" id="' + id + '-id" size=11></td>'
     + '<td title="クリックでアイコン選択"><img id="' + id + '-iconimg" src="' + staticImg.sp + '"><input type="hidden" id="' + id + '-icon" value=""></td>'
     + '<td><input type="text" id="' + id + '-text-ja" size=20 class="ja"><input type="text" id="' + id + '-text-en" size=20 class="en display-hide"></td>'
     + '<td class="left"><input type="hidden" id="' + id + '-funcId"><span class="funcnm ja">' + menu[no].funcNm + '</span><span class="funcnmeng en display-hide">' + menu[no].funcNmEng + '</span></td>'
     + '<td><input type="text" id="' + id + '-url" size=20></td>'
     + '<td><select id="' + id + '-target"><option value="main">画面内<option value="_blank">別画面</select></td>'
     + '</tr>';
  $("#portal-setting-menutable").find("tbody").append(tr);

  $('#' + id + '-type').val(menu[no].menuKbnCd);
  $('#' + id + '-funcId').val(menu[no].funcId);
  
  if (menu[no].dispFlg == "1"){
    setCheck('#' + id + '-visible', "checked");
  }
  if (menu[no].bookmarkFlg == "1"){
    setCheck('#' + id + '-bookmark', "checked");
  }
  $('#' + id + '-iconimg').attr("src", menu[no].icon);
  $('#' + id + '-icon').val(cutUrl(menu[no].icon, staticImg.base));
  $('#' + id + '-folder-ja').val(menu[no].folderNm);
  $('#' + id + '-folder-en').val(menu[no].folderNmEng);
  if (menu[no].folderOpenFlg == "1"){
    setCheck('#' + id + '-folder-open', "checked");
  }
  $('#' + id + '-id').val(menu[no].menuId);
  $('#' + id + '-text-ja').val(menu[no].menuNm);
  $('#' + id + '-text-en').val(menu[no].menuNmEng);
  $('#' + id + '-url').val(menu[no].url);
  $('#' + id + '-target').val(menu[no].target);
  
  if (no == 0){
    $('#'+ id).addClass("select");
  }
  
  // Events
  $('#'+ id).mouseover(function(){
    $(this).addClass("hover");
  }).mouseout(function(){
    $(this).removeClass("hover");
  }).click(function(){
    $("#portal-setting-menutable").find("tr").removeClass("select");
    $(this).addClass("select");
    //$('#'+ id + "-visible").focus();
  });
  
  $('#' + id + '-visible').click(function(){
    var no = parseInt($("#" + id + "-no").val());
    if (typeof $(this).attr("checked") != 'undefined'){
      menu[no].dispFlg = "1";
    } else {
      menu[no].dispFlg = "0";
    }
    showMenu(currentTabId, false, portalConf.langDesign);
  });
  $('#' + id + '-bookmark').click(function(){
    var no = parseInt($("#" + id + "-no").val());
    if (typeof $(this).attr("checked") != 'undefined'){
      menu[no].bookmarkFlg = "1";
    } else {
      menu[no].bookmarkFlg = "0";
    }
    //if (menu[no].dispFlg == "1"){
    //  showMenu(currentTabId, false, portalConf.langDesign);
    //}
  });
  $('#' + id + '-iconimg').click(function(){
    iconSelectDialog(function(icon){
      var no = parseInt($("#" + id + "-no").val());
      menu[no].icon = icon;
      $('#' + id + '-iconimg').attr("src", menu[no].icon);
      $('#' + id + '-icon').val(cutUrl(menu[no].icon, staticImg.base));
    });
  });
  $('#' + id + '-folder-ja').change(function(){
    var no = parseInt($("#" + id + "-no").val());
    menu[no].folderNm = $(this).val();
    if (menu[no].dispFlg == "1"){
      showMenu(currentTabId, false, portalConf.langDesign);
    }
  });
  $('#' + id + '-folder-en').change(function(){
    var no = parseInt($("#" + id + "-no").val());
    menu[no].folderNmEng = $(this).val();
    if (menu[no].dispFlg == "1"){
      showMenu(currentTabId, false, portalConf.langDesign);
    }
  });
  $('#' + id + '-folder-open').click(function(){
    var no = parseInt($("#" + id + "-no").val());
    if (typeof $(this).attr("checked") != 'undefined'){
      menu[no].folderOpenFlg = "1";
    } else {
      menu[no].folderOpenFlg = "0";
    }
    //if (menu[no].dispFlg == "1"){
    //  showMenu(currentTabId, false, portalConf.langDesign);
    //}
  });
  $('#' + id + '-id').change(function(){
    var no = parseInt($("#" + id + "-no").val());
    menu[no].menuId = $(this).val();
    if (menu[no].dispFlg == "1"){
      showMenu(currentTabId, false, portalConf.langDesign);
    }
  });
  $('#' + id + '-text-ja').change(function(){
    var no = parseInt($("#" + id + "-no").val());
    menu[no].menuNm = $(this).val();
    if (menu[no].dispFlg == "1"){
      showMenu(currentTabId, false, portalConf.langDesign);
    }
  });
  $('#' + id + '-text-en').change(function(){
    var no = parseInt($("#" + id + "-no").val());
    menu[no].menuNmEng = $(this).val();
    if (menu[no].dispFlg == "1"){
      showMenu(currentTabId, false, portalConf.langDesign);
    }
  });
  $('#' + id + '-url').change(function(){
    var no = parseInt($("#" + id + "-no").val());
    menu[no].url = $(this).val();
    if (menu[no].dispFlg == "1"){
      showMenu(currentTabId, false, portalConf.langDesign);
    }
  });
  $('#' + id + '-target').change(function(){
    var no = parseInt($("#" + id + "-no").val());
    menu[no].target = $(this).val();
    if (menu[no].dispFlg == "1"){
      showMenu(currentTabId, false, portalConf.langDesign);
    }
  });
  
  return $('#'+ id);
}

/* setting */
function setPortalSetting(){
  setCheck("#portal-header-grad", tabSetting.headerGrad);
  setCheck("#portal-header-whitetext", tabSetting.headerWhiteText);
  setCheck("#portal-body-grad", tabSetting.bodyGrad);
  setCheck("#portal-body-center", tabSetting.bodyCenter);
  setCheck("#portal-footer-grad", tabSetting.footerGrad);
  setCheck("#portal-footer-whitetext", tabSetting.footerWhiteText);
  setCheck("#portal-tabbk-grad", tabSetting.tabBkGrad);
  setCheck("#portal-tabbk-truns", tabSetting.tabBkTruns);
  setCheck("#portal-tabbk-allwidth", tabSetting.tabBkAllWidth);
  setCheck("#portal-tabbk-whitetext", tabSetting.tabBkWhiteText);
  setCheck("#portal-tab-grad", tabSetting.tabGrad);
  setCheck("#portal-tab-whitetext", tabSetting.tabWhiteText);
  setCheck("#portal-tab-borderdisp", tabSetting.tabBorderDisp);
  setCheck("#portal-tab-radius", tabSetting.tabRadius);
  setCheck("#portal-tab-allwidth", tabSetting.tabAllWidth);
  setCheck("#portal-table-grad", tabSetting.tableGrad);
  setCheck("#portal-table-truns", tabSetting.tableTruns);
  setCheck("#portal-area-grad", tabSetting.areaGrad);
  setCheck("#portal-area-truns", tabSetting.areaTruns);
  setCheck("#portal-area-borderdisp", tabSetting.areaBorderDisp);
  setCheck("#portal-area-radius", tabSetting.areaRadius);
  setCheck("#portal-area-shadow", tabSetting.areaShadow);
  
  $('#portal-header-bgcolor').val(tabSetting.headerBgColor);
  $("#portal-body-bgcolor").val(tabSetting.bodyBgColor);
  $("#portal-footer-bgcolor").val(tabSetting.footerBgColor);
  $('#portal-tabbk-bgcolor').val(tabSetting.tabBkBgColor);
  $('#portal-tabbk-allwidth').val(tabSetting.tabBkAllWidth);
  $('#portal-tab-bgcolor').val(tabSetting.tabBgColor);
  $('#portal-tab-bordercolor').val(tabSetting.tabBorderColor);
  $('#portal-tab-allwidth').val(tabSetting.tabAllWidth);
  $('#portal-table-bgcolor').val(tabSetting.tableBgColor);
  $('#portal-area-bgcolor').val(tabSetting.areaBgColor);
  $('#portal-area-bordercolor').val(tabSetting.areaBorderColor);
  $('#portal-area-margin').val(tabSetting.areaMargin);
  
  setCheck("#portal-authDesignShokuin", tabSetting.authDesignShokuin);
  setCheck("#portal-authDesignKyoin", tabSetting.authDesignKyoin);
  setCheck("#portal-authDesignGakusei", tabSetting.authDesignGakusei);
  setCheck("#portal-authDesignAllShokuin", tabSetting.authDesignAllShokuin);
  setCheck("#portal-authDesignAllKyoin", tabSetting.authDesignAllKyoin);
  setCheck("#portal-authDesignAllGakusei", tabSetting.authDesignAllGakusei);
  setCheck("#portal-authLayoutShokuin", tabSetting.authLayoutShokuin);
  setCheck("#portal-authLayoutKyoin", tabSetting.authLayoutKyoin);
  setCheck("#portal-authLayoutGakusei", tabSetting.authLayoutGakusei);
  
  setPortalSettingPortlet("portal", tabSetting);
}
function setPortalSettingPortlet(mode, settings){
  setCheck("#" + mode + "-portlet-grad", settings.portletGrad);
  setCheck("#" + mode + "-portlet-truns", settings.portletTruns);
  setCheck("#" + mode + "-portlet-borderdisp", settings.portletBorderDisp);
  setCheck("#" + mode + "-portlet-radius", settings.portletRadius);
  setCheck("#" + mode + "-portlet-shadow", settings.portletShadow);
  setCheck("#" + mode + "-title-grad", settings.titleGrad);
  setCheck("#" + mode + "-title-radius", settings.titleRadius);
  setCheck("#" + mode + "-title-disp", settings.titleDisp);
  setCheck("#" + mode + "-title-whitetext", settings.titleWhiteText);
  
  $("#" + mode + "-portlet-bgcolor").val(settings.portletBgColor);
  $("#" + mode + "-portlet-bordercolor").val(settings.portletBorderColor);
  $("#" + mode + "-portlet-bordersize").val(settings.portletBorderSize);
  $("#" + mode + "-title-bgcolor").val(settings.titleBgColor);
}

/* style */
function changeStyle(targetPortletId, marginResizeFlg){
  changeStyleAll("", targetPortletId, marginResizeFlg);
  return false;
}
function changeStyleMain(targetPortletId, marginResizeFlg, requiredFlg){
  if (portalConf.runMode == 'design' || portalConf.runMode == 'preview' || requiredFlg){ 
    changeStyleAll("", targetPortletId, marginResizeFlg);
  } else if (marginResizeFlg){
    resizePortal(marginResizeFlg);
  }
  return false;
}
function changeStyleSetting(targetPortletId, marginResizeFlg){
  changeStyleAll("portal", targetPortletId, marginResizeFlg);
  return false;
}
function changeStyleAll(mode, targetPortletId, marginResizeFlg){
  if (targetPortletId != ""){
    var settings = wfSetting[targetPortletId];
    if (typeof settings != 'undefined'){
      changeStyleImpl("", settings, targetPortletId, true);
    } else {
      changeStyleImpl(mode, tabSetting, targetPortletId, marginResizeFlg);
    }
  } else {
    changeStyleImpl(mode, tabSetting, targetPortletId, false);
    
    $.each(wfSetting, function(key, val){
      changeStyleImpl("", val, key, false);
    });
    
    resizePortal(marginResizeFlg);
  }
  
  return false;
}
function changeStyleDlg(targetPortletId){
  var settings = wfSetting[targetPortletId];
  changeStyleImpl("ptld", settings, targetPortletId, true);
  return false;
}

/* [WARN] !!! changeStyleImpl equal PortalMainCss !!! */
function changeStyleImpl(mode, settings, targetPortletId, marginResizeFlg){
  if (mode != ""){
    if (mode == "portal"){
      settings.headerBgColor = $('#portal-header-bgcolor').val();
      settings.headerGrad = $("#portal-header-grad").attr("checked");
      settings.headerWhiteText = $("#portal-header-whitetext").attr("checked");
      settings.bodyBgColor = $("#portal-body-bgcolor").val();
      settings.bodyGrad = $("#portal-body-grad").attr("checked");
      settings.bodyCenter = $("#portal-body-center").attr("checked");
      settings.footerBgColor = $("#portal-footer-bgcolor").val();
      settings.footerGrad = $("#portal-footer-grad").attr("checked");
      settings.footerWhiteText = $("#portal-footer-whitetext").attr("checked");
      settings.tabBkBgColor = $('#portal-tabbk-bgcolor').val();
      settings.tabBkGrad = $("#portal-tabbk-grad").attr("checked");
      settings.tabBkTruns = $("#portal-tabbk-truns").attr("checked");
      settings.tabBkAllWidth = $("#portal-tabbk-allwidth").attr("checked");
      settings.tabBkWhiteText = $("#portal-tabbk-whitetext").attr("checked");
      settings.tabBgColor = $('#portal-tab-bgcolor').val();
      settings.tabGrad = $("#portal-tab-grad").attr("checked");
      settings.tabWhiteText = $("#portal-tab-whitetext").attr("checked");
      settings.tabBorderColor = $('#portal-tab-bordercolor').val();
      settings.tabBorderDisp = $("#portal-tab-borderdisp").attr("checked");
      settings.tabRadius = $("#portal-tab-radius").attr("checked");
      settings.tabAllWidth = $("#portal-tab-allwidth").attr("checked");
      settings.tableBgColor = $('#portal-table-bgcolor').val();
      settings.tableGrad = $("#portal-table-grad").attr("checked");
      settings.tableTruns = $("#portal-table-truns").attr("checked");
      settings.areaBgColor = $('#portal-area-bgcolor').val();
      settings.areaGrad = $("#portal-area-grad").attr("checked");
      settings.areaTruns = $("#portal-area-truns").attr("checked");
      settings.areaBorderColor = $('#portal-area-bordercolor').val();
      settings.areaBorderDisp = $("#portal-area-borderdisp").attr("checked");
      settings.areaRadius = $("#portal-area-radius").attr("checked");
      settings.areaShadow = $("#portal-area-shadow").attr("checked");
      settings.areaMargin = $("#portal-area-margin").val();
    } else {
      // portlet mode
      settings.areaBgColor = $('#portal-area-bgcolor').val();
    }
    
    settings.portletBgColor = $("#" + mode + "-portlet-bgcolor").val();
    settings.portletGrad = $("#" + mode + "-portlet-grad").attr("checked");
    settings.portletTruns = $("#" + mode + "-portlet-truns").attr("checked");
    settings.portletBorderColor = $("#" + mode + "-portlet-bordercolor").val();
    settings.portletBorderDisp = $("#" + mode + "-portlet-borderdisp").attr("checked");
    settings.portletRadius = $("#" + mode + "-portlet-radius").attr("checked");
    settings.portletShadow = $("#" + mode + "-portlet-shadow").attr("checked");
    settings.portletBorderSize = $("#" + mode + "-portlet-bordersize").val();
    settings.titleBgColor = $("#" + mode + "-title-bgcolor").val();
    settings.titleGrad = $("#" + mode + "-title-grad").attr("checked");
    settings.titleRadius = $("#" + mode + "-title-radius").attr("checked");
    settings.titleDisp = $("#" + mode + "-title-disp").attr("checked");
    settings.titleWhiteText = $("#" + mode + "-title-whitetext").attr("checked");
  } else {
    // portlet mode
    settings.areaBgColor = $('#portal-area-bgcolor').val();
  }
  
  var headerCl = $([]);
  var header = $([]);
  var body = $([]);
  var footer = $([]);
  var tabspanCl = $([]);
  var tabspan = $([]);
  var tab = $([]);
  var taball = $([]);
  var menu = $([]);
  var menusub = $([]);
  var table = $([]);
  var area = $([]);
  var portlet = $([]);
  var portletMain = $([]);
  var title = $([]);
  var titlelnk = $([]);
  
  var designerFlg = false;
  
  if (targetPortletId != ""){
    if (targetPortletId == "main-frame"){
      portlet = $("#main-frame");
      portletMain = $("#main-frame-if").contents().find("body");
      title = $("#main-frame-if").contents().find(".portlet-title");
      titlelnk = $("#main-frame-if").contents().find(".portlet-title-linker");
    } else {
      portlet = $('#' + targetPortletId).parent();
      title = portlet.find(".portlet-title");
      titlelnk = portlet.find(".portlet-title-linker");
    }
    designerFlg = portlet.hasClass("portletDesign-dummy");
  } else {
    // IE
    if (portalConf.useIeCss3Pie && jQuery.browser.msie && jQuery.browser.version <= 9){
      clearBehaviors();
    }
    
    if (settings.tabBkAllWidth == "checked" && settings.tabBkTruns != "checked"){
      headerCl = $("#header-span");
      header = $("#logo-span");
    } else {
      headerCl = $("#logo-span");
      header = $("#header-span");
    }
    body = $("#body-span");
    footer = $("#footer-span");
    if (settings.tabBkAllWidth == "checked"){
      tabspanCl = $("#tabtable");
      tabspan = $("#tab-span");
    } else {
      tabspanCl = $("#tab-span");
      tabspan = $("#tabtable");
    }
    tab = $("#tabtable .tabcell-sel");
    taball = $("#tabtable .tabcell");
    menu = $("#tabmenu-area");
    menusub = $(".tabmenu-sub-ul");
    table = $("#body-area");
    area = $("#portaltable .portalarea");
    portlet = $(".portlet");
    title = $(".portlet-title");
    titlelnk = $(".portlet-title-linker");
  }
  
  // header
  if (header.size() > 0){
    changeBackColorStyle(headerCl, null, "truns", true, false, settings.headerBgColor, settings.tabBkBgColor, settings.headerBgColor);
    if ("checked" == settings.tabBkAllWidth){
      changeBackColorStyle(header, null, settings.headerGrad, true, false, settings.headerBgColor, settings.tabBkBgColor, settings.bodyBgColor);
    } else if ("checked" == settings.tabAllWidth){
      changeBackColorStyle(header, null, settings.headerGrad, true, false, settings.headerBgColor, settings.tabBgColor, settings.bodyBgColor);
    } else {
      changeBackColorStyle(header, null, settings.headerGrad, true, false, settings.headerBgColor, settings.bodyBgColor, settings.bodyBgColor);
    }
    headerCl.css("color", "");
    if ("checked" == settings.headerWhiteText){
      header.css("color", "white");
    } else {
      header.css("color", "black");
    }
  }
  
  // body
  if (body.size() > 0){
    changeBackColorStyle(body, null, settings.bodyGrad, true, false, settings.bodyBgColor, settings.footerBgColor, settings.footerBgColor);
  }
  
  // footer
  if (footer.size() > 0){
    changeBackColorStyle(footer, null, settings.footerGrad, false, false, settings.footerBgColor, settings.bodyBgColor, settings.bodyBgColor);
    $("body").css("background-color", settings.footerBgColor);  // 余りはフッター色
    
    if ("checked" == settings.footerWhiteText){
      footer.css("color", "white");
    } else {
      footer.css("color", "black");
    }
  }
  
  if (tab.size() > 0 || $("#tablist .tabcell").size() > 0){
    taball.css("border", "1px transparent solid");
    
    // tab
    if ("checked" == settings.tabBorderDisp){
      menu.css("border", "1px " + settings.tabBorderColor + " solid");
      menusub.css("border", "1px " + settings.tabBorderColor + " solid");
      
      tab.css("border-top", "1px " + settings.tabBorderColor + " solid");
      tab.css("border-left", "1px " + settings.tabBorderColor + " solid");
      tab.css("border-right", "1px " + settings.tabBorderColor + " solid");
      if (tabSetting.menuVisible != "checked"){
        tab.css("border-bottom", "1px " + settings.tabBgColor + " solid");
      } else {
        tab.css("border-bottom", "1px " + settings.tabBgColor + " solid");
      }
    } else {
      menu.css("border", "1px transparent solid");
      menusub.css("border", "1px transparent solid");
      //taball.css("border-top", "none");
      //taball.css("border-bottom", "none");
      
      tab.css("border-left", "1px transparent solid");
      tab.css("border-right", "1px transparent solid");
    }
    
    changeBackColorStyle(tabspanCl, null, "truns", true, false, settings.tabBkBgColor, settings.tabBgColor, settings.tabBkBgColor);
    if ("checked" == settings.tabBkTruns){
      changeBackColorStyle(tabspan, null, "truns", true, false, settings.tabBkBgColor, settings.tabBgColor, settings.tabBkBgColor);
    } else {
      changeBackColorStyle(tabspan, null, settings.tabBkGrad, true, false, settings.tabBkBgColor, settings.tabBgColor, settings.tabBkBgColor);
    }
    tabspanCl.css("color", "");
    if ("checked" == settings.tabBkWhiteText){
      tabspan.css("color", "white");
    } else {
      tabspan.css("color", "black");
    }
    
    changeBackColorStyle(tab, menu, settings.tabGrad, false, true, settings.tabBgColor, settings.headerBgColor, settings.bodyBgColor);
    menusub.css("background-color", settings.tabBgColor);
    
    if ("checked" == settings.tabWhiteText){
      tab.css("color", "white");
      menu.css("color", "white");
      menusub.css("color", "white");
    } else {
      tab.css("color", "black");
      menu.css("color", "black");
      menusub.css("color", "black");
    }
    
    if ("checked" == settings.tabRadius){
      // CSS3
      if ("checked" != settings.tabBkAllWidth){
        tabspan.css("border-radius", "10px 10px 0px 0px");
      }
      tab.css("border-radius", "10px 10px 0px 0px");
      // chrome safari
      if (jQuery.browser.webkit){
        if ("checked" != settings.tabBkAllWidth){
          tabspan.css("-webkit-border-radius", "10px 10px 0px 0px");
        }
        tab.css("-webkit-border-radius", "10px 10px 0px 0px");
      }
      // IE
      if (portalConf.useIeCss3Pie && jQuery.browser.msie && jQuery.browser.version <= 9){
        if ("checked" != settings.tabBkAllWidth){
          tabspan.css("border-radius", "10px 10px 0px 0px");
          addBehaviors(tabspan);
        }
        tab.css("border-radius", "10px 10px 0px 0px");
        addBehaviors(tab);
      }
    } else {
      tabspan.css("-webkit-border-radius", "0");
      tabspan.css("border-radius", "0");
      tab.css("-webkit-border-radius", "0");
      tab.css("border-radius", "0");
    }
  }
  
  // table
  if (table.size() > 0){
    if ("checked" == settings.tableTruns){
      changeBackColorStyle(table, null, "truns", true, false, settings.tableBgColor, settings.bodyBgColor, settings.bodyBgColor);
    } else {
      changeBackColorStyle(table, null, settings.tableGrad, true, false, settings.tableBgColor, settings.bodyBgColor, settings.bodyBgColor);
    }
  }
  
  // area
  if (area.size() > 0){
    if ("checked" == settings.areaTruns){
      changeBackColorStyle(area, null, "truns", false, true, settings.areaBgColor, settings.bodyBgColor, settings.bodyBgColor);
    } else {
      changeBackColorStyle(area, null, settings.areaGrad, false, true, settings.areaBgColor, settings.bodyBgColor, settings.bodyBgColor);
    }
    if ("checked" == settings.areaBorderDisp){
      area.css("border", "1px " + settings.areaBorderColor + " solid");
    } else {
      area.css("border", "1px transparent solid");
    }
    if ("checked" == settings.areaRadius){
      // CSS3
      area.css("border-radius", "10px 10px 10px 10px");
      //chrome safari
      if (jQuery.browser.webkit){
        area.css("-webkit-border-radius", "10px 10px 10px 10px");
      }
      // IE
      if (portalConf.useIeCss3Pie && jQuery.browser.msie && jQuery.browser.version <= 9){
        area.css("border-radius", "10px");
        addBehaviors(area);
      }
    } else {
      area.css("-webkit-border-radius", "0");
      area.css("border-radius", "0");
    }
    if ("checked" == settings.areaShadow){
      // CSS3
      area.css("box-shadow", "3px 3px 3px #000");
      // chrome safari
      if (jQuery.browser.webkit){
        area.css("-webkit-box-shadow", "3px 3px 3px #000");
      }
      // firefox
      if (jQuery.browser.mozilla){
        area.css("-moz-box-shadow", "3px 3px 3px #000");
      }
      // Opera
      if (jQuery.browser.opera){
        area.css("-o-box-shadow", "3px 3px 3px #000");
      }
      // IE
      if (portalConf.useIeCss3Pie && jQuery.browser.msie && jQuery.browser.version <= 9){
        area.css("-ms-box-shadow", "3px 3px 3px #000");
        addBehaviors(area);
      }
    } else {
      // CSS3
      area.css("box-shadow", "none");
      // chrome safari
      if (jQuery.browser.webkit){
        area.css("-webkit-box-shadow", "none");
      }
      // firefox
      if (jQuery.browser.mozilla){
        area.css("-moz-box-shadow", "none");
      }
      // Opera
      if (jQuery.browser.opera){
        area.css("-o-box-shadow", "none");
      }
      // IE
      if (jQuery.browser.msie && jQuery.browser.version <= 9){
        area.css("-ms-box-shadow", "none");
      }
    }
    
    $("#portaltable .portalarea-row-sp").find(".space").height(settings.areaMargin);
    $("#portaltable .portalarea-sp").find(".space").width(settings.areaMargin);
    /*
    $(".portalarea").each(function (i) {
      var _this = $(this);
      var _thisid = $(this).attr("id");
      if (_this.children(".portlet").size() > 1){
        $("#"+_thisid+"-sp").parent().show();
      }
    });
    */
  }
  
  // portlet
  if (portlet.size() > 0){
    // IE
    if (!designerFlg && jQuery.browser.msie && jQuery.browser.version <= 9){
      removeBehaviors(portletMain);
      removeBehaviors(portlet);
    }
    if ("checked" == settings.portletTruns){
      changeBackColorStyle(portlet, portletMain, "truns", true, false, settings.portletBgColor, settings.areaBgColor, settings.areaBgColor);
    } else {
      changeBackColorStyle(portlet, portletMain, settings.portletGrad, true, false, settings.portletBgColor, settings.areaBgColor, settings.areaBgColor);
    }
    
    if ("checked" == settings.portletBorderDisp){
      portlet.css("border", settings.portletBorderSize + " solid " + settings.portletBorderColor + "");
    } else {
      portlet.css("border", "1px transparent solid");
    }
    
    // test
    //portlet.css("margin", "0px");
    //$(".portlet-2s").css("min-width", "95px");
    
    if ("checked" == settings.portletRadius){
      // CSS3
      portlet.css("border-radius", "10px 10px 10px 10px");
      //chrome safari
      if (jQuery.browser.webkit){
        portlet.css("-webkit-border-radius", "10px 10px 10px 10px");
      }
      // IE
      if (!designerFlg && portalConf.useIeCss3Pie && jQuery.browser.msie && jQuery.browser.version <= 9){
        portlet.css("border-radius", "10px");
        addBehaviors(portlet);
      }
    } else {
      portlet.css("-webkit-border-radius", "0");
      portlet.css("border-radius", "0");
    }
    if ("checked" == settings.portletShadow){
      // CSS3
      portlet.css("box-shadow", "3px 3px 3px #000");
      // chrome safari
      if (jQuery.browser.webkit){
        portlet.css("-webkit-box-shadow", "3px 3px 3px #000");
      }
      // firefox
      if (jQuery.browser.mozilla){
        portlet.css("-moz-box-shadow", "3px 3px 3px #000");
      }
      // Opera
      if (jQuery.browser.opera){
        portlet.css("-o-box-shadow", "3px 3px 3px #000");
      }
      // IE
      if (!designerFlg && portalConf.useIeCss3Pie && jQuery.browser.msie && jQuery.browser.version <= 9){
        portlet.css("-ms-box-shadow", "3px 3px 3px #000");
        addBehaviors(portlet);
      }
    } else {
      // CSS3
      portlet.css("box-shadow", "none");
      // chrome safari
      if (jQuery.browser.webkit){
        portlet.css("-webkit-box-shadow", "none");
      }
      // firefox
      if (jQuery.browser.mozilla){
        portlet.css("-moz-box-shadow", "none");
      }
      // Opera
      if (jQuery.browser.opera){
        portlet.css("-o-box-shadow", "none");
      }
      // IE
      if (!designerFlg && jQuery.browser.msie && jQuery.browser.version <= 9){
        portlet.css("-ms-box-shadow", "none");
      }
    }
  }
  
  // title
  if (title.size() > 0){
    // IE
    if (!designerFlg && jQuery.browser.msie && jQuery.browser.version <= 9){
      removeBehaviors(title);
    }
    
    if ("checked" == settings.titleDisp){
      title.show();
      titlelnk.show();
      changeBackColorStyle(title, null, settings.titleGrad, true, false, settings.titleBgColor, settings.portletBgColor, settings.portletBgColor);
      
      if ("checked" == settings.titleRadius){
        // CSS3
        title.css("border-radius", "10px 10px 10px 10px");
        // chrome safari
        if (jQuery.browser.webkit){
          title.css("-webkit-border-radius", "10px 10px 10px 10px");
        }
        // IE
        if (!designerFlg && portalConf.useIeCss3Pie && jQuery.browser.msie && jQuery.browser.version <= 9){
          title.css("border-radius", "10px");
          addBehaviors(title);
        }
      } else {
        title.css("-webkit-border-radius", "0");
        title.css("border-radius", "0");
      }
      if ("checked" == settings.titleWhiteText){
        title.css("color", "white");
      } else {
        title.css("color", "black");
      }
    } else {
      title.hide();
      titlelnk.hide();
    }
  }
  
  if (targetPortletId != "" && settings != tabSetting){
    delete settings.areaBgColor;
  }
  
  // resize
  if (mode == "portal" && targetPortletId == ""){
    resizePortal(marginResizeFlg);
  }
}

/* background */
function changeBackColorStyle(target, target2, grad, downFlg, secondReverseFlg, stColor, endColor, endColor2){
  var start = "center top";
  var start2 = "center top";
  var end = "center bottom";
  var end2 = "center bottom";
  if (!downFlg){
    start = "center bottom";
    start2 = "center bottom";
    end = "center top";
    end2 = "center top";
    if (secondReverseFlg){
      start2 = "center top";
      end2 = "center bottom";
    }
  } else {
    if (secondReverseFlg){
      start2 = "center bottom";
      end2 = "center top";
    }
  }
  
  var designerFlg = target.hasClass("portletDesign-dummy");
  
  if ("checked" == grad){
    // CSS3
    target.css("background", "linear-gradient(" + start + " , "+stColor+", "+endColor+")");
    if (target2 != null){
       target2.css("background", "linear-gradient(" + start2 + " , "+stColor+", "+endColor2+")");
    }
    
    // chrome safari
    if (jQuery.browser.webkit){
      target.css("background", "-webkit-linear-gradient(" + start + " , "+stColor+", "+endColor+")");
      target.css("background-image", "-webkit-gradient(linear, " + start + ", " + end + ", from("+stColor+"), to("+endColor+"))");
      if (target2 != null){
         target2.css("background", "-webkit-linear-gradient(" + start2 + " , "+stColor+", "+endColor2+")");
         target2.css("background-image", "-webkit-gradient(linear, " + start2 + ", " + end2 + ", from("+stColor+"), to("+endColor2+"))");
      }
    }
    // firefox
    if (jQuery.browser.mozilla){
      target.css("background-image", "-moz-linear-gradient(" + start + " , "+stColor+", "+endColor+")");
      if (target2 != null){
         target2.css("background-image", "-moz-linear-gradient(" + start2 + " , "+stColor+", "+endColor2+")");
      }
    }
    // Opera
    if (jQuery.browser.opera){
      target.css("background-image", "-o-linear-gradient(to " + start + ", "+stColor+", "+endColor+")");
      if (target2 != null){
         target2.css("background-image", "-o-linear-gradient(to " + start2 + ", "+stColor+", "+endColor2+")");
      }
    }
    // IE8,9 (+ pie)
    if (!designerFlg && jQuery.browser.msie && jQuery.browser.version <= 9){
      if (portalConf.useIeCss3Pie){
        target.css("-ms-linear-gradient", "linear-gradient("+stColor+", "+endColor+")");
        target.css("-pie-background", "linear-gradient(" + start + " , "+stColor+", "+endColor+")");
        addBehaviors(target);
        if (target2 != null){
          $("#main-frame-if").attr("allowtransparency", "none");
          target2.css("-ms-linear-gradient", "linear-gradient("+stColor+", "+endColor2+")");
          target2.css("-pie-background", "linear-gradient(" + start2 + " , "+stColor+", "+endColor2+")");
          addBehaviors(target2);
        }
      } else {
        // グラデーションが効かない場合のため、背景色をセット
        target.css("background", "");
        target.css("background", "none");
        target.css("background-image", "none");
        target.css("background-color", stColor);
        if (target2 != null){
          target2.css("background", "");
          target2.css("background", "none");
          target2.css("background-image", "none");
          target2.css("background-color", stColor);
          $("#main-frame-if").attr("allowtransparency", "none");
        }
      }
    }
  } else {
    target.css("background", "none");
    target.css("background-image", "none");
    if (grad == "truns"){
      target.css("background-color", "transparent");
    } else {
      target.css("background-color", stColor);
    }
    if (target2 != null){
      target2.css("background", "none");
      target2.css("background-image", "none");
      if (grad == "truns"){
        target2.css("background-color", "transparent");
        // IE
        if (jQuery.browser.msie && jQuery.browser.version <= 9){
          $("#main-frame-if").attr("allowtransparency", "true");  // for IE iframe transparent
        }
      } else {
        target2.css("background-color", stColor);
        // IE
        if (jQuery.browser.msie && jQuery.browser.version <= 9){
          $("#main-frame-if").attr("allowtransparency", "none");  // for IE iframe transparent
        }
      }
    }
    // IE8,9 (+ pie => css or pie)
    if (!designerFlg && jQuery.browser.msie && jQuery.browser.version <= 9){
      if (grad == "truns"){
        if (portalConf.useIeCss3Pie){
          target.css("-ms-linear-gradient", "none");
          target.css("-pie-background", "transparent");
          if (target2 != null){
            target2.css("-ms-linear-gradient", "none");
            target2.css("-pie-background", "transparent");
          }
        } else {
          target.css("-ms-linear-gradient", "none");
          target.css("-pie-background", "");
          if (target2 != null){
            target2.css("-ms-linear-gradient", "none");
            target2.css("-pie-background", "");
          }
        }
      } else {
        if (portalConf.useIeCss3Pie){
          target.css("-ms-linear-gradient", "none");
          target.css("-pie-background", stColor);
          if (target2 != null){
            target2.css("-ms-linear-gradient", "none");
            target2.css("-pie-background", stColor);
          }
        } else {
          target.css("-ms-linear-gradient", "none");
          target.css("-pie-background", stColor);
          if (target2 != null){
            target2.css("-ms-linear-gradient", "none");
            target2.css("-pie-background", stColor);
          }
        }
      }
    }
  }
}


/* MSIE behavior */
var behaviorIDs ={};

function clearBehaviors(){
  if (!(portalConf.useIeCss3Pie && jQuery.browser.msie && jQuery.browser.version <= 9)){
      return false;
  }
  $.each(behaviorIDs, function(key){
    var _obj = $("#"+ key);
    if (_obj[0] != null && _obj[0].addBehavior){
      if (typeof behaviorIDs[key] != 'undefined'){
        _obj[0].removeBehavior(behaviorIDs[key]);
      }
    }
    _obj.removeClass('pie_first-child');
    _obj.css("behavior", "none");
    delete behaviorIDs[key];
  });
  $(".pie_first-child").each(function(){
    try{
      _obj.css("behavior", "none");
      _obj.removeClass('pie_first-child');
      _obj[0].removeBehavior();
    } catch (e){
    }
  });
  $(document).find("css3-container").remove();
}

function addBehaviors(target){
  if (!(portalConf.useIeCss3Pie && jQuery.browser.msie && jQuery.browser.version <= 9)){
      return false;
  }
  target.each(function(){
    var _this = $(this);
    var _thisid = _this.attr("id");
    if (typeof _thisid == 'undefined'){
      alert("オブジェクトにid属性が設定されていません\n" + _this.html().substring(0, 300));
    } else {
      if (_this[0].addBehavior){
        if (typeof behaviorIDs[_thisid] == 'undefined'){
          behaviorIDs[_thisid] = _this[0].addBehavior(staticDoc.PIE);
        } else {
          //alert(_thisid + " is exists behavior.");
        }
      } else {
        alert(_thisid + " is not support '.addBehavior'.");
      }
    }
  });
}
function removeBehaviors(target){
  if (!(portalConf.useIeCss3Pie && jQuery.browser.msie && jQuery.browser.version <= 9)){
      return false;
  }
  target.each(function(){
    var _this = $(this);
    var _thisid = _this.attr("id");
    if (typeof _thisid == 'undefined'){
      alert("オブジェクトにid属性が設定されていません\n" + _this.html().substring(0, 300));
    } else {
      if (_this[0].addBehavior){
        if (typeof behaviorIDs[_thisid] != 'undefined'){
          _this[0].removeBehavior(behaviorIDs[_thisid]);
          delete behaviorIDs[_thisid];
        }
        _this.removeClass('pie_first-child');
        _this.css("behavior", "none");
      }
    }
  });
}
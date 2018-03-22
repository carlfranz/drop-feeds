/*global browser DefaultValues Listener ListenerProviders ThemeManager*/
'use strict';
class BrowserManager { /* exported BrowserManager*/
  static get instance() {
    if (!this._instance) {
      this._instance = new BrowserManager();
    }
    return this._instance;
  }

  constructor() {
    this._alwaysOpenNewTab = DefaultValues.alwaysOpenNewTab;
    this._openNewTabForeground = DefaultValues.openNewTabForeground;
    Listener.instance.subscribe(ListenerProviders.localStorage, 'alwaysOpenNewTab', BrowserManager._setAlwaysOpenNewTab_sbscrb, true);
    Listener.instance.subscribe(ListenerProviders.localStorage, 'openNewTabForeground', BrowserManager._setOpenNewTabForeground_sbscrb, true);
  }

  //non statics
  get alwaysOpenNewTab() {
    return this._alwaysOpenNewTab;
  }

  async openTab_async(url, openNewTabForce) {
    let activeTab = await BrowserManager.getActiveTab_async();
    let isEmptyActiveTab = await BrowserManager.isTabEmpty_async(activeTab);
    let openNewTab = this._alwaysOpenNewTab || openNewTabForce;
    if(openNewTab && !isEmptyActiveTab) {
      await browser.tabs.create({url: url, active: this._openNewTabForeground});
    } else {
      await browser.tabs.update(activeTab.id, {url: url});
    }
  }

  //statics
  static async isTabEmpty_async(tab) {
    let isEmpty = (tab.url == 'about:blank' || tab.url == 'about:newtab') && (tab.status == 'complete');
    return isEmpty;
  }

  static async getActiveTab_async() {
    let tabInfos = await browser.tabs.query({active: true, currentWindow: true});
    return tabInfos[0];
  }

  static displayNotification(message) {
    browser.notifications.create({
      'type': 'basic',
      'iconUrl': browser.extension.getURL(ThemeManager.instance.iconDF96Url),
      'title': 'Drop feeds',
      'message': message
    });
  }

  static bookmarkHasChild(bookmarkItem) {
    let result = false;
    if (bookmarkItem.children) {
      result = (bookmarkItem.children.length > 0);
    }
    return result;
  }

  static setInnerHtmlByElement(element, innerHTML) {
    element.innerHTML = innerHTML;
  }

  static setInnerHtmlById(id, innerHTML) {
    BrowserManager.setInnerHtmlByElement(document.getElementById(id), innerHTML);
  }

  static loadScript(url, callback){
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = function(){ callback(); };
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  static async isVisitedLink_async(url) {
    var visits = await browser.history.getVisits({url: url});
    return (visits.length > 0);
  }

  static _setAlwaysOpenNewTab_sbscrb(value){
    BrowserManager.instance._alwaysOpenNewTab = value;
  }

  static _setOpenNewTabForeground_sbscrb(value){
    BrowserManager.instance._openNewTabForeground = value;
  }

}

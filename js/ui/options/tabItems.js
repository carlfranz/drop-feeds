/*global browser DefaultValues LocalStorageManager CssManager */
'use strict';
class TabItems { /*exported TabItems*/
  static get instance() { return (this._instance = this._instance || new this()); }

  async init_async() {
    this._updateLocalizedStrings();

    let elFeedItemListCheckbox = document.getElementById('feedItemListCheckbox');
    elFeedItemListCheckbox.checked =  await LocalStorageManager.getValue_async('feedItemList', DefaultValues.feedItemList);
    elFeedItemListCheckbox.addEventListener('click', (e) => { this._feedItemListCheckboxClicked_event(e); });

    let elFeedItemListToolbarCheckbox = document.getElementById('feedItemListToolbarCheckbox');
    elFeedItemListToolbarCheckbox.checked =  await LocalStorageManager.getValue_async('feedItemListToolbar', DefaultValues.feedItemListToolbar);
    elFeedItemListToolbarCheckbox.addEventListener('click', (e) => { this._feedItemListToolbarCheckboxClicked_event(e); });

    let elFeedItemDescriptionTooltipsCheckbox = document.getElementById('feedItemDescriptionTooltipsCheckbox');
    elFeedItemDescriptionTooltipsCheckbox.checked =  await LocalStorageManager.getValue_async('feedItemDescriptionTooltips', DefaultValues.feedItemDescriptionTooltips);
    elFeedItemDescriptionTooltipsCheckbox.addEventListener('click', (e) => { this._feedItemDescriptionTooltipsCheckboxClicked_event(e); });

    let elFeedItemMarkAsReadOnLeaving = document.getElementById('feedItemMarkAsReadOnLeavingCheckbox');
    elFeedItemMarkAsReadOnLeaving.checked =  await LocalStorageManager.getValue_async('feedItemMarkAsReadOnLeaving', DefaultValues.feedItemMarkAsReadOnLeaving);
    elFeedItemMarkAsReadOnLeaving.addEventListener('click', (e) => { this._feedItemMarkAsReadOnLeavingCheckboxClicked_event(e); });

    let elFeedItemRenderInSidebarCheckbox = document.getElementById('feedItemRenderInSidebarCheckbox');
    elFeedItemRenderInSidebarCheckbox.checked =  await LocalStorageManager.getValue_async('feedItemRenderInSidebar', DefaultValues.feedItemRenderInSidebar);
    elFeedItemRenderInSidebarCheckbox.addEventListener('click', (e) => { this._feedItemRenderInSidebarCheckboxClicked_event(e); });

    this._enableItemOptions();

  }

  _updateLocalizedStrings() {
    document.getElementById('textFeedItemList').textContent = browser.i18n.getMessage('optFeedItemList');
    document.getElementById('textFeedItemListToolbar').textContent = browser.i18n.getMessage('optFeedItemListToolbar');
    document.getElementById('textDescriptionTooltips').textContent = browser.i18n.getMessage('optDescriptionTooltips');
    document.getElementById('textNavigationHistoryWarning').textContent = browser.i18n.getMessage('optNavigationHistoryWarning');
    document.getElementById('textFeedItemMarkAsReadOnLeaving').textContent = browser.i18n.getMessage('optFeedItemMarkAsReadOnLeaving');
    document.getElementById('textFeedItemRenderInSidebar').textContent = browser.i18n.getMessage('optFeedItemRenderInSidebar');
  }

  async _feedItemListCheckboxClicked_event() {
    await LocalStorageManager.setValue_async('feedItemList', document.getElementById('feedItemListCheckbox').checked);
    this._enableItemOptions();
  }

  async _feedItemListToolbarCheckboxClicked_event() {
    await LocalStorageManager.setValue_async('feedItemListToolbar', document.getElementById('feedItemListToolbarCheckbox').checked);
  }

  async _feedItemDescriptionTooltipsCheckboxClicked_event() {
    await LocalStorageManager.setValue_async('feedItemDescriptionTooltips', document.getElementById('feedItemDescriptionTooltipsCheckbox').checked);
  }

  async _feedItemMarkAsReadOnLeavingCheckboxClicked_event() {
    await LocalStorageManager.setValue_async('feedItemMarkAsReadOnLeaving', document.getElementById('feedItemMarkAsReadOnLeavingCheckbox').checked);
  }

  async _feedItemRenderInSidebarCheckboxClicked_event() {
    await LocalStorageManager.setValue_async('feedItemRenderInSidebar', document.getElementById('feedItemRenderInSidebarCheckbox').checked);
  }

  _enableItemOptions() {
    let enabled = document.getElementById('feedItemListCheckbox').checked;
    this._enableCheckbox('feedItemListToolbarCheckbox', 'textFeedItemListToolbar', enabled);
    this._enableCheckbox('feedItemDescriptionTooltipsCheckbox', 'textDescriptionTooltips', enabled);
    this._enableCheckbox('feedItemMarkAsReadOnLeavingCheckbox', 'textFeedItemMarkAsReadOnLeaving', enabled);
    this._enableCheckbox('feedItemRenderInSidebarCheckbox', 'textFeedItemRenderInSidebar', enabled);
  }

  _enableCheckbox(checkboxId, textId, enabled) {
    document.getElementById(checkboxId).disabled = ! enabled;
    CssManager.setElementEnableById(checkboxId, enabled);
    CssManager.setElementEnableById(textId, enabled);
  }
}

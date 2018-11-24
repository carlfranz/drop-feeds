/*global browser BrowserManager RenderOptions ItemSorter Transfer TextTools ThemeManager*/
'use strict';

class FeedTransform { /*exported FeedTransform*/

  static async transformFeedToHtml_async(feedInfo) {
    let xmlDoc = await FeedTransform._exportFeedToXml_async(feedInfo);
    let htmlText = await FeedTransform._transform_async(xmlDoc, feedInfo.isError);
    return htmlText;
  }

  static async _exportFeedToXml_async(feedInfo, xsltUrl) {
    let feedXml = FeedTransform._getFeedXml(feedInfo, xsltUrl);
    return feedXml;
  }

  static _getFeedXml(feedInfo) {
    let iconUrl = browser.runtime.getURL(ThemeManager.instance.iconDF32Url);
    let templateCssUrl = browser.runtime.getURL(ThemeManager.instance.getRenderCssTemplateUrl(feedInfo.isError));
    let xsltUrl = browser.runtime.getURL(ThemeManager.instance.getRenderXslTemplateUrl(feedInfo.isError));
    let themeUrl = browser.runtime.getURL(ThemeManager.instance.getRenderCssUrl());

    let feedXml = '<?xml-stylesheet type="text/xsl" href= "' + xsltUrl + `" ?>
<render>
  <context>
    <icon>` + iconUrl + `</icon>
    <template>` + templateCssUrl + `</template>
    <theme>` + themeUrl + `</theme>  
  </context>
  <channel>
    <title>` + (feedInfo.channel.title || '(no title)') + `</title>
    <link>` + feedInfo.channel.link + `</link>
    <description>`
      + (feedInfo.channel.description || '') + `
    </description>
    </channel>
  <items>`
      + FeedTransform._getItemsXmlFragments(feedInfo) + `
  </items>
</render>`;

    return feedXml;
  }

  static _getItemsXmlFragments(feedInfo) {
    feedInfo.itemList = ItemSorter.instance.sort(feedInfo.itemList);
    let itemsXmlFragments = '';
    for (let i = 0; i < feedInfo.itemList.length; i++) {
      itemsXmlFragments += FeedTransform._getItemXmlFragments(feedInfo.itemList[i], i + 1);
    }
    return itemsXmlFragments;
  }

  static _getItemXmlFragments(item, itemNumber) {
    let itemXmlFragments = '';
    itemXmlFragments = `
    <item>
      <number>` + (itemNumber ? itemNumber : item.number) + `</number>
      <title>` + item.title + `</title>      
      <target>` + (RenderOptions.instance.itemNewTab ? '_blank' : '') + `</target>
      <link>` + item.link + `</link>
      <description>
        <![CDATA[` + FeedTransform._transformEncode(item.description) + ']]>' + `
      </description>
      <category>` + item.category + `</category>
      <author>` + item.author + `</author>
      <pubDateText>` + item.pubDateText + `</pubDateText>
      <enclosures>
        <enclosure>
          <mimetype>` + (item.enclosure ? item.enclosure.mimetype : '') + `</mimetype>
          <link>` + (item.enclosure ? item.enclosure.url : '') + `</link>
        </enclosure>
      
      </enclosures>
    </item>\n`;
    return itemXmlFragments;
  }

  static async _transform_async(xmlText, isError) {
    let xslDocUrl = browser.runtime.getURL(ThemeManager.instance.getRenderXslTemplateUrl(isError));
    let xslStylesheet = await Transfer.downloadXlsFile_async(xslDocUrl);
    let xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xslStylesheet);
    let oParser = new DOMParser();
    let xmlDoc = oParser.parseFromString(xmlText, 'application/xml');
    let htmlDoc = xsltProcessor.transformToDocument(xmlDoc);
    FeedTransform._decodeElements(htmlDoc, 'itemDescription');
    let htmlText = htmlDoc.documentElement.outerHTML;
    return htmlText;
  }

  static _decodeElements(htmlDoc, elementClass) {
    let elementList = htmlDoc.getElementsByClassName(elementClass);
    for (let element of elementList) {
      let decodedContent = FeedTransform._transformDecode(element.innerHTML);
      BrowserManager.setInnerHtmlByElement(element, decodedContent, true);
    }
  }

  static _transformEncode(decodedText) {
    let encodedText = TextTools.toTextCharCodeArray(decodedText);
    return encodedText;
  }

  static _transformDecode(encodedText) {
    let decodedText = TextTools.fromTextCharCodeArray(encodedText);
    return decodedText;
  }
}
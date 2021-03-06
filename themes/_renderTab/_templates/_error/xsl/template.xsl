<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="5.0" encoding="UTF-8" indent="yes" />  
  <xsl:template match="/">
    <html>
     <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <xsl:element name="link">
          <xsl:attribute name="rel">icon</xsl:attribute>
          <xsl:attribute name="type">image/png/css</xsl:attribute>
          <xsl:attribute name="href"><xsl:value-of select="/render/context/icon"/></xsl:attribute>
        </xsl:element>
        <xsl:element name="link">
          <xsl:attribute name="rel">stylesheet</xsl:attribute>
          <xsl:attribute name="type">text/css</xsl:attribute>
          <xsl:attribute name="href"><xsl:value-of select="/render/context/template"/></xsl:attribute>
        </xsl:element>
        <xsl:element name="link">
          <xsl:attribute name="rel">stylesheet</xsl:attribute>
          <xsl:attribute name="type">text/css</xsl:attribute>
          <xsl:attribute name="href"><xsl:value-of select="/render/context/theme"/></xsl:attribute>
        </xsl:element>
        <title><span class="encodedText"><xsl:value-of select="/render/channel/title"/></span> - Drop Feeds</title>
     </head>
     <body>
      <div class="channelHead error">
        <h1 class="channelTitle error">
          <xsl:element name="a">
            <xsl:attribute name="class">channelLink error</xsl:attribute>
            <xsl:attribute name="href"><xsl:value-of select="/render/channel/link"/></xsl:attribute>
            <span class="encodedText"><xsl:value-of select="/render/channel/title"/></span>
          </xsl:element>
        </h1>
        
        <p class="channelDescription error"><span class="encodedText"><xsl:value-of select="/render/channel/description"/></span></p>
      </div>

	    <xsl:for-each select="/render/items/item">
        <div class="item error">
          <h2 class="itemTitle error">
            <span class="itemNumber"><xsl:value-of select="./number" />.</span>
            <xsl:element name="a">
              <xsl:attribute name="target"><xsl:value-of select="./target"/></xsl:attribute>
              <xsl:attribute name="href"><xsl:value-of select="./link"/></xsl:attribute>
              <span class="encodedText"><xsl:value-of select="./title" /></span>
            </xsl:element>
          </h2>
          <div class="itemDescription"><span class="encodedHtml"><xsl:value-of disable-output-escaping="yes" select="./description"/></span></div>
          <div class="itemInfo">
            <div   class="itemPubDate"><xsl:value-of disable-output-escaping="yes" select="./pubDateText"/></div>
          </div>
        </div>
	    </xsl:for-each>      
      </body>
    </html>
  </xsl:template>
    
</xsl:stylesheet>
